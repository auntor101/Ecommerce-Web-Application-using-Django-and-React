from .models import BillingAddress, OrderModel
from django.http import Http404
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework import authentication, permissions
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer 
from rest_framework_simplejwt.views import TokenObtainPairView # for login page
from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from .serializers import (
    UserSerializer, 
    UserRegisterTokenSerializer, 
    BillingAddressSerializer,
    AllOrdersListSerializer
)
import logging

logger = logging.getLogger(__name__)

class UserRegisterView(APIView):

    def post(self, request, format=None):
        data = request.data
        username = data["username"]
        email = data["email"]

        if username == "" or email == "":
            logger.warning(f"Registration attempt with empty username or email from IP {request.META.get('REMOTE_ADDR')}")
            return Response({"detail": "username or email cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)

        else:
            check_username = User.objects.filter(username=username).count()
            check_email =  User.objects.filter(email=email).count()

            if check_username:
                message = "A user with that username already exist!"
                logger.warning(f"Registration attempt with existing username: {username} from IP {request.META.get('REMOTE_ADDR')}")
                return Response({"detail": message}, status=status.HTTP_403_FORBIDDEN)
            if check_email:
                message = "A user with that email address already exist!"
                logger.warning(f"Registration attempt with existing email: {email} from IP {request.META.get('REMOTE_ADDR')}")
                return Response({"detail": message}, status=status.HTTP_403_FORBIDDEN)
            else:
                user = User.objects.create(
                    username=username,
                    email=email,
                    password=make_password(data["password"]),
                )
                serializer = UserRegisterTokenSerializer(user, many=False)
                logger.info(f"User registered: {username} from IP {request.META.get('REMOTE_ADDR')}")
                return Response(serializer.data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserRegisterTokenSerializer(self.user).data

        for k, v in serializer.items():
            data[k] = v
        
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserAccountDetailsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"details": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class UserAccountUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({"details": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data

        if request.user.id != user.id:
            logger.warning(f"Permission denied for user update: user id {request.user.id} tried to update user id {user.id} from IP {request.META.get('REMOTE_ADDR')}")
            return Response({"details": "Permission Denied."}, status=status.HTTP_403_FORBIDDEN)

        username = data.get("username")
        email = data.get("email")
        if not username or not email:
            return Response({"details": "Username and email are required."}, status=status.HTTP_400_BAD_REQUEST)

        user.username = username
        user.email = email

        if data.get("password"):
            user.password = make_password(data["password"])

        user.save()
        serializer = UserSerializer(user, many=False)
        message = {"details": "User Successfully Updated.", "user": serializer.data}
        logger.info(f"User updated their account: {user.username} (id={user.id}) from IP {request.META.get('REMOTE_ADDR')}")
        return Response(message, status=status.HTTP_200_OK)


class UserAccountDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            user = User.objects.get(id=pk)
        except User.DoesNotExist:
            return Response({"details": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data

        if request.user.id == user.id:
            if check_password(data["password"], user.password):
                user.delete()
                logger.info(f"User deleted their account: {user.username} (id={user.id}) from IP {request.META.get('REMOTE_ADDR')}")
                return Response({"details": "User successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
            else:
                logger.warning(f"Failed account deletion attempt due to wrong password for user: {user.username} (id={user.id}) from IP {request.META.get('REMOTE_ADDR')}")
                return Response({"details": "Incorrect password."}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            logger.warning(f"Permission denied for account deletion: user id {request.user.id} tried to delete user id {user.id} from IP {request.META.get('REMOTE_ADDR')}")
            return Response({"details": "Permission Denied."}, status=status.HTTP_403_FORBIDDEN)


class UserAddressesListView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        user_address = BillingAddress.objects.filter(user=user)
        serializer = BillingAddressSerializer(user_address, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserAddressDetailsView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            user_address = BillingAddress.objects.get(id=pk)
        except BillingAddress.DoesNotExist:
            return Response({"details": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if user_address.user != request.user:
            return Response({"details": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        serializer = BillingAddressSerializer(user_address, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreateUserAddressView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        
        new_address = {
            "name": request.data["name"],
            "user": request.user.id,
            "phone_number": request.data["phone_number"],
            "pin_code": request.data["pin_code"],
            "house_no": request.data["house_no"],
            "landmark": request.data["landmark"],
            "city": request.data["city"],
            "state": request.data["state"],
        }

        serializer = BillingAddressSerializer(data=new_address, many=False)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Billing address created for user id {request.user.id} from IP {request.META.get('REMOTE_ADDR')}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            logger.warning(f"Failed billing address creation for user id {request.user.id} from IP {request.META.get('REMOTE_ADDR')}: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateUserAddressView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        data = request.data

        try:
            user_address = BillingAddress.objects.get(id=pk)

            if request.user.id == user_address.user.id:

                updated_address = {
                    "name": data.get("name", user_address.name),
                    "user": request.user.id,
                    "phone_number": data.get("phone_number", user_address.phone_number),
                    "pin_code": data.get("pin_code", user_address.pin_code),
                    "house_no": data.get("house_no", user_address.house_no),
                    "landmark": data.get("landmark", user_address.landmark),
                    "city": data.get("city", user_address.city),
                    "state": data.get("state", user_address.state),
                }

                serializer = BillingAddressSerializer(user_address, data=updated_address)
                if serializer.is_valid():
                    serializer.save()
                    logger.info(f"Billing address updated for user id {request.user.id} from IP {request.META.get('REMOTE_ADDR')}")
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    logger.warning(f"Failed billing address update for user id {request.user.id} from IP {request.META.get('REMOTE_ADDR')}: {serializer.errors}")
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                logger.warning(f"Permission denied for billing address update: user id {request.user.id} tried to update address id {pk} from IP {request.META.get('REMOTE_ADDR')}")
                return Response({"details": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        except BillingAddress.DoesNotExist:
            return Response({"details": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class DeleteUserAddressView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        
        try:
            user_address = BillingAddress.objects.get(id=pk)

            if request.user.id == user_address.user.id:
                user_address.delete()
                logger.info(f"Billing address deleted for user id {request.user.id} from IP {request.META.get('REMOTE_ADDR')}")
                return Response({"details": "Address successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
            else:
                logger.warning(f"Permission denied for billing address deletion: user id {request.user.id} tried to delete address id {pk} from IP {request.META.get('REMOTE_ADDR')}")
                return Response({"details": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        except BillingAddress.DoesNotExist:
            return Response({"details": "Not found."}, status=status.HTTP_404_NOT_FOUND)


class OrdersListView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_staff_status = request.user.is_staff
        
        if user_staff_status:
            all_users_orders = OrderModel.objects.all()
            serializer = AllOrdersListSerializer(all_users_orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            all_orders = OrderModel.objects.filter(user=request.user)
            serializer = AllOrdersListSerializer(all_orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

class ChangeOrderStatus(APIView):

    permission_classes = [permissions.IsAdminUser]

    def put(self, request, pk):
        data = request.data
        try:
            order = OrderModel.objects.get(id=pk)
        except OrderModel.DoesNotExist:
            return Response({"details": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        order.is_delivered = data["is_delivered"]
        order.delivered_at = data["delivered_at"]
        order.save()

        serializer = AllOrdersListSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
            reset_link = f"{frontend_url}/password-reset/{uid}/{token}"
            logger.info(f"Password reset requested for user: {user.username} (id={user.id})")
            # In production, send email. For now, return the link in response for development.
            if settings.DEBUG:
                return Response({
                    "detail": "Password reset link generated.",
                    "reset_link": reset_link
                }, status=status.HTTP_200_OK)
            else:
                from django.core.mail import send_mail
                send_mail(
                    subject="Password Reset Request",
                    message=f"Click the link to reset your password: {reset_link}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
                return Response({"detail": "Password reset email sent."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # Return success even if user doesn't exist (security best practice)
            return Response({"detail": "If an account with that email exists, a reset link has been sent."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, uid, token):
        password = request.data.get('password', '').strip()
        if not password:
            return Response({"detail": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid_decoded = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid_decoded)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired reset token."}, status=status.HTTP_400_BAD_REQUEST)

        user.password = make_password(password)
        user.save()
        logger.info(f"Password reset completed for user: {user.username} (id={user.id})")
        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)
