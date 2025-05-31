from account import views
from django.http import response
from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from django.contrib.auth.models import User
from .models import BillingAddress, OrderModel
from .views import (
    CardsListView,
    ChangeOrderStatus,
    CreateUserAddressView,
    DeleteUserAddressView,
    OrdersListView,
    UpdateUserAddressView,
    UserAccountDeleteView,
    UserAccountDetailsView,
    UserAccountUpdateView,
    UserAddressDetailsView,
    UserAddressesListView
)

class AccountApisSetUp(APITestCase):
    def setUp(self):
        self.register_url = reverse("register-page")
        self.login_url = reverse("login-page")

        self.user_data = {
            "email": "test@example.com",
            "username": "testuser",
            "password": "test1234"
        }

        self.empty_fields = {
            "email": "",
            "username": "",
            "password": ""
        }

        self.admin_user = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="admin1234"
        )

        self.normal_user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testuser1234"
        )

        self.dummy_address = BillingAddress.objects.create(
            name="testuser",
            user=self.normal_user,
            phone_number="01712345678",
            pin_code="1200",
            house_no="House 123",
            landmark="Near Mosque",
            city="Dhaka",
            state="Dhaka"
        )

        self.dummy_order = OrderModel.objects.create(
            name="testuser",
            ordered_item="Office Chair",
            card_number="4242424242424242",
            address="House 123, Dhaka",
            paid_status="True",
            paid_at=timezone.now(),
            total_price="5999.99",
            is_delivered="False", 
            delivered_at="Not Delivered",
            user=self.normal_user
        )

class AccountApisAuthTest(AccountApisSetUp):
    def test_user_registration_without_user_data(self):
        response = self.client.post(self.register_url, self.empty_fields, format="json")
        self.assertEqual(response.status_code, 400)

    def test_user_login_without_user_data(self):
        response = self.client.post(self.login_url, self.empty_fields, format="json")
        self.assertEqual(response.status_code, 400)

    def test_user_registration_with_user_data(self):
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_user_login_with_user_data(self):
        self.client.post(self.register_url, self.user_data, format="json")
        response = self.client.post(self.login_url, self.user_data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_user_account_details_page_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='admin')
        view = UserAccountDetailsView.as_view()
        request = factory.get('/accounts/user/1/')
        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_user_account_details_page_when_logged_out(self):
        response = self.client.get('/accounts/user/1/')
        self.assertEqual(response.status_code, 404)

    def test_user_account_updation_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='admin')
        view = UserAccountUpdateView.as_view()
        updates = {"username": "admin22", "email": "", "password": ""}
        request = factory.put('/accounts/user_update/1/', updates)
        force_authenticate(request, user=user)
        update_user = User.objects.get(id='1')
        update_user.username = updates["username"]
        update_user.save()
        response = view(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_user_account_updation_when_logged_out(self):
        updates = {"username": "admin22", "email": "", "password": ""}
        response = self.client.put('/accounts/user_update/1/', updates)
        self.assertEqual(response.status_code, 404)

    def test_user_account_deletion_with_wrong_password(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = UserAccountDeleteView.as_view()
        request = factory.post('/accounts/user_delete/2/', {"password": "wrong_password"})
        force_authenticate(request, user=user)
        response = view(request, 2)
        self.assertEqual(response.status_code, 401)

    def test_user_account_deletion_with_correct_password(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = UserAccountDeleteView.as_view()
        request = factory.post('/accounts/user_delete/2/', {"password": "testuser1234"})
        force_authenticate(request, user=user)
        response = view(request, 2)
        self.assertEqual(response.status_code, 204)

    def test_user_account_deletion_without_login(self):
        response = self.client.post(('/accounts/user_delete/1/', {"password": "admin1234"}))
        self.assertEqual(response.status_code, 404)

    def test_get_all_the_addresses_of_user_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username="testuser")
        view = UserAddressesListView.as_view()
        request = factory.get('/accounts/all-addresses-details/')
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)

    def test_get_all_addresses_of_user_when_logged_out(self):
        response = self.client.get('/accounts/all-addresses-details/')
        self.assertEqual(response.status_code, 404)

    def test_address_creation_of_registered_user(self):
        factory = APIRequestFactory()
        user = User.objects.get(username="testuser")
        view = CreateUserAddressView.as_view()
        user_address = {
            "name": "testuser",
            "user": user,
            "phone_number": "01712345678",
            "pin_code": "1200",
            "house_no": "House 123",
            "landmark": "Near Mosque",
            "city": "Dhaka",
            "state": "Dhaka"
        }
        request = factory.post('/account/create-address/', user_address)
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)

    def test_address_creation_api_when_logged_out(self):
        user = User.objects.get(username="testuser")
        user_address = {
            "name": "testuser",
            "user": user,
            "phone_number": "01712345678",
            "pin_code": "1200",
            "house_no": "House 123",
            "landmark": "Near Mosque",
            "city": "Dhaka",
            "state": "Dhaka"
        }
        response = self.client.post('/account/create-address/', user_address)
        self.assertEqual(response.status_code, 401)

    def test_address_updation_of_registered_user(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = UpdateUserAddressView.as_view()
        updated_address = {
            "name": "",
            "user": user,
            "phone_number": "",
            "pin_code": "1201",
            "house_no": "",
            "landmark": "",
            "city": "Chittagong",
            "state": ""
        }
        request = factory.put('/account/update-address/1/', updated_address)
        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_address_updation_when_logged_out(self):
        user = User.objects.get(username='testuser')
        updated_address = {
            "name": "",
            "user": user,
            "phone_number": "",
            "pin_code": "1201",
            "house_no": "",
            "landmark": "",
            "city": "Chittagong",
            "state": ""
        }
        response = self.client.put('/account/update-address/1/', updated_address)
        self.assertEqual(response.status_code, 401)

    def test_fetching_address_details_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = UserAddressDetailsView.as_view()
        request = factory.get('/accounts/address-details/1/')
        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_fetching_address_details_when_logged_out(self):
        response = self.client.get('/accounts/address-details/1/')
        self.assertEqual(response.status_code, 404)

    def test_delete_user_address_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = DeleteUserAddressView.as_view()
        request = factory.delete('/account/delete-address/1/')
        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 204)

    def test_delete_user_address_when_logged_out(self):
        response = self.client.delete('/account/delete-address/1/')
        self.assertEqual(response.status_code, 403)

    def test_get_orders_list_when_logged_in(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = OrdersListView.as_view()
        request = factory.get('/account/all-orders-list/')
        force_authenticate(request, user=user)
        response = view(request)
        self.assertEqual(response.status_code, 200)

    def test_get_orders_list_when_logged_out(self):
        response = self.client.get('/account/all-orders-list/')
        self.assertEqual(response.status_code, 401)

    def test_changing_of_order_status_by_admin(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='admin')
        view = ChangeOrderStatus.as_view()
        request = factory.put('/account/change-order-status/1/', {
            "is_delivered": "True",
            "delivered_at": timezone.now()
        })
        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 200)

    def test_changing_of_order_status_by_normal_user(self):
        factory = APIRequestFactory()
        user = User.objects.get(username='testuser')
        view = ChangeOrderStatus.as_view()
        request = factory.put('/account/change-order-status/1/', {
            "is_delivered": "True",
            "delivered_at": timezone.now()
        })
        force_authenticate(request, user=user)
        response = view(request, 1)
        self.assertEqual(response.status_code, 403)

    def test_changing_of_order_status_when_logged_out(self):
        response = self.client.put('/account/change-order-status/1/', {
            "is_delivered": "True",
            "delivered_at": timezone.now()
        })
        self.assertEqual(response.status_code, 401)