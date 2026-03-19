import os

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from payments.models import PaymentMethod
from product.models import Category, Product


class Command(BaseCommand):
    help = 'Seed payment methods, sample products, and create superuser for a fresh deployment.'

    def handle(self, *args, **options):
        self._create_superuser()
        self._seed_payment_methods()
        self._seed_products()
        self.stdout.write(self.style.SUCCESS('Bootstrap complete.'))

    def _seed_payment_methods(self):
        payment_methods = [
            ('bkash', 'bKash', 'mobile-alt'),
            ('visa', 'Visa', 'credit-card'),
            ('mastercard', 'MasterCard', 'credit-card'),
            ('cash', 'Cash on Delivery', 'money-bill'),
        ]
        for name, display_name, icon in payment_methods:
            PaymentMethod.objects.get_or_create(
                name=name,
                defaults={'display_name': display_name, 'icon': icon, 'is_active': True},
            )

    def _seed_products(self):
        categories_data = [
            ('Rice & Grains', 'Fresh staple grains and cereals from Bangladesh'),
            ('Vegetables & Fruits', 'Fresh produce sourced locally'),
            ('Dairy & Eggs', 'Farm-fresh dairy products and eggs'),
            ('Beverages', 'Drinks, juices and hot beverages'),
            ('Snacks & Sweets', 'Local and imported snacks and confections'),
            ('Spices & Condiments', 'Authentic spices, sauces and cooking essentials'),
            ('Personal Care', 'Health, beauty and hygiene products'),
            ('Household & Cleaning', 'Cleaning and household supplies'),
            ('Frozen & Packaged', 'Ready-to-cook and packaged food items'),
            ('Electronics', 'Gadgets, devices and accessories'),
        ]
        categories = {}
        for name, desc in categories_data:
            cat, _ = Category.objects.get_or_create(name=name, defaults={'description': desc})
            categories[name] = cat

        # (name, description, price, stock, category, is_featured)
        products_data = [
            # Rice & Grains
            ('Miniket Rice 5kg', 'Premium quality Miniket rice grown in the Barind region. Long grain, aromatic and non-sticky.', '7.99', True, 'Rice & Grains', True),
            ('Basmati Rice 2kg', 'Extra-long grain basmati with delicate fragrance. Ideal for biryani and pilaf.', '6.49', True, 'Rice & Grains', False),
            ('Atap Rice 5kg', 'Traditional short-grain sticky rice perfect for pitha and sweet dishes.', '5.99', True, 'Rice & Grains', False),
            ('Red Lentils (Masoor Dal) 1kg', 'Washed split red lentils. Cooks quickly into a creamy, protein-rich dal.', '2.29', True, 'Rice & Grains', False),
            ('Yellow Lentils (Moog Dal) 1kg', 'Split yellow moong lentils. Light, digestible and versatile in cooking.', '2.49', True, 'Rice & Grains', False),
            ('Black Chickpeas (Kala Chana) 1kg', 'Earthy, fiber-rich black chickpeas. Great for curries and chaat.', '2.79', True, 'Rice & Grains', False),
            ('Rolled Oats 500g', 'Whole-grain rolled oats. High in beta-glucan fiber. Ideal for a healthy breakfast.', '2.19', True, 'Rice & Grains', False),
            ('Semolina (Suji) 500g', 'Fine semolina flour. Used in halwa, upma, pasta and fried coatings.', '1.49', True, 'Rice & Grains', False),
            ('Flattened Rice (Chira) 500g', 'Parboiled and flattened rice flakes. Ready to eat with milk or fry as poha.', '1.29', True, 'Rice & Grains', False),
            ('Whole Wheat Flour (Atta) 2kg', 'Stone-ground whole wheat flour. Ideal for roti, paratha and flatbreads.', '3.49', True, 'Rice & Grains', False),

            # Vegetables & Fruits
            ('Fresh Tomatoes 1kg', 'Locally grown ripe red tomatoes. Essential for curries, salads and sauces.', '1.29', True, 'Vegetables & Fruits', False),
            ('Yellow Onion 2kg', 'Sweet and pungent yellow onions. The foundation of Bangladeshi cuisine.', '1.79', True, 'Vegetables & Fruits', True),
            ('Garlic 250g', 'Fresh whole garlic bulbs with a sharp pungent aroma. Grown locally.', '0.99', True, 'Vegetables & Fruits', False),
            ('Fresh Ginger 250g', 'Plump, juicy ginger root. Adds warmth and depth to curries and teas.', '0.89', True, 'Vegetables & Fruits', False),
            ('Red Potatoes 2kg', 'Firm waxy red potatoes. Great for curries, boiling and roasting.', '1.49', True, 'Vegetables & Fruits', False),
            ('Green Chilli 100g', 'Fiery fresh green chillies. A staple condiment in every Bangladeshi kitchen.', '0.59', True, 'Vegetables & Fruits', False),
            ('Banana (Sagar) 6 pcs', 'Sweet and fragrant Sagar bananas. Perfect for eating fresh or in smoothies.', '0.99', True, 'Vegetables & Fruits', True),
            ('Papaya (medium)', 'Ripe orange-fleshed papaya. Rich in vitamin C and digestive enzymes.', '1.19', True, 'Vegetables & Fruits', False),
            ('Mango Himsagar 1kg', 'Prized Himsagar mangoes with honey-sweet flesh and minimal fiber.', '3.99', True, 'Vegetables & Fruits', True),
            ('Karela (Bitter Gourd) 500g', 'Fresh bitter gourd with powerful health benefits. Ideal for stir-fry.', '0.79', True, 'Vegetables & Fruits', False),

            # Dairy & Eggs
            ('Full Cream Milk 1L', 'Pasteurized full-fat cow milk. Fresh, creamy and rich in calcium.', '1.49', True, 'Dairy & Eggs', True),
            ('Farm Eggs (12 pcs)', 'Free-range brown eggs from local farms. Rich in nutrients and protein.', '2.49', True, 'Dairy & Eggs', True),
            ('Plain Yogurt 500g', 'Thick, tangy full-fat yogurt. Great for raita, marinades or eaten plain.', '1.29', True, 'Dairy & Eggs', False),
            ('Ghee (Clarified Butter) 200g', 'Pure cow ghee with a rich golden colour and nutty aroma.', '4.99', True, 'Dairy & Eggs', True),
            ('Unsalted Butter 200g', 'Creamy unsalted French-style butter. Ideal for baking and cooking.', '2.99', True, 'Dairy & Eggs', False),
            ('Mozzarella Cheese 200g', 'Fresh mozzarella block. Melts perfectly on pizzas and in pasta bakes.', '3.49', True, 'Dairy & Eggs', False),
            ('Condensed Milk 397g', 'Sweetened condensed milk in a classic tin. Essential for desserts and teas.', '1.99', True, 'Dairy & Eggs', False),
            ('Mishti Doi 250g', 'Traditional Bengali sweet yogurt set in an earthen pot. Subtly caramelised.', '1.79', True, 'Dairy & Eggs', True),

            # Beverages
            ('Mineral Water 1.5L', 'Naturally filtered mineral water from the Himalayan foothills. Low sodium.', '0.79', True, 'Beverages', False),
            ('Mango Juice 1L (Frooto)', 'Real mango pulp drink with no added preservatives. Refreshingly sweet.', '1.29', True, 'Beverages', True),
            ('Taaza Black Tea 400g', 'Strong Assam-blend CTC tea. Brews into a rich, malty cup. Great with milk.', '3.49', True, 'Beverages', True),
            ('Nescafe Classic Instant Coffee 100g', 'Bold, smooth instant coffee with a deep roasted aroma.', '4.99', True, 'Beverages', False),
            ('Tiger Energy Drink 250ml', 'Carbonated energy drink with taurine, caffeine and B-vitamins.', '0.99', True, 'Beverages', False),
            ('Seven Up 1.5L', 'Crisp, lemon-lime flavoured sparkling soft drink. Caffeine-free.', '1.19', True, 'Beverages', False),
            ('Green Tea Bags 25 pcs', 'Delicate green tea sachets with antioxidant-rich flavour. Light and calming.', '2.29', True, 'Beverages', False),
            ('Lemon Barley Water 1L', 'Refreshing barley water with real lemon. A classic thirst quencher.', '1.49', True, 'Beverages', False),
            ('Fresh Coconut Water 330ml', 'Cold-pressed pure coconut water. Naturally isotonic. No added sugar.', '1.09', True, 'Beverages', False),
            ('Horlicks Original 500g', 'Classic malted milk drink mix. Fortified with vitamins and minerals.', '4.49', True, 'Beverages', True),

            # Snacks & Sweets
            ('Prawn Crackers 200g', 'Light, airy prawn-flavoured crackers. Perfect snack with tea.', '1.49', True, 'Snacks & Sweets', False),
            ('Cashew Nuts 150g', 'Premium whole cashews. Roasted and lightly salted for a delicious crunch.', '4.29', True, 'Snacks & Sweets', True),
            ('Dark Chocolate Bar 100g', '70% cacao dark chocolate. Intense, bittersweet and satisfying.', '2.99', True, 'Snacks & Sweets', True),
            ('Digestive Biscuits 400g', 'Crisp wholemeal biscuits with a hint of sweetness. Classic British staple.', '2.19', True, 'Snacks & Sweets', False),
            ('Chanachur Mix 200g', 'Crunchy spiced Bangladesh street snack mix with peanuts and lentil crisps.', '1.09', True, 'Snacks & Sweets', False),
            ('Roshogolla (12 pcs)', 'Soft, spongy cottage-cheese dumplings in light sugar syrup. Iconic Bengali sweet.', '3.99', True, 'Snacks & Sweets', True),
            ('Peanut Butter 340g', 'Creamy, all-natural peanut butter. No added sugar, palm oil or preservatives.', '3.49', True, 'Snacks & Sweets', False),
            ('Rusk Toast 200g', 'Double-baked crunchy rusk. Perfect companion for morning tea or coffee.', '1.19', True, 'Snacks & Sweets', False),
            ('Mixed Dried Fruits 200g', 'Raisins, apricots, dates and cranberries. A healthy, energy-packed snack.', '3.79', True, 'Snacks & Sweets', False),
            ('Popcorn (Salted) 100g', 'Light and fluffy air-popped salted popcorn. Low calorie cinema-style snack.', '0.89', True, 'Snacks & Sweets', False),

            # Spices & Condiments
            ('Turmeric Powder 200g', 'Bright-yellow ground turmeric with a warm earthy flavour. High curcumin content.', '0.99', True, 'Spices & Condiments', False),
            ('Cumin Seeds 100g', 'Aromatic whole cumin with warm, earthy notes. Essential for tempering oil.', '0.89', True, 'Spices & Condiments', False),
            ('Coriander Powder 100g', 'Mild, citrusy ground coriander. Adds depth to curries, dals and marinades.', '0.79', True, 'Spices & Condiments', False),
            ('Mustard Oil 500ml', 'Cold-pressed pure mustard oil with a distinctive pungent aroma. Rich in omega-3.', '2.49', True, 'Spices & Condiments', True),
            ('Tomato Ketchup 340g', 'Classic tangy tomato ketchup. No artificial colours or flavours.', '1.99', True, 'Spices & Condiments', False),
            ('Soy Sauce 200ml', 'Naturally brewed dark soy sauce with a rich, umami flavour.', '1.49', True, 'Spices & Condiments', False),
            ('Hot Chilli Sauce 300ml', 'Fiery red chilli sauce with garlic. Perfect with snacks and grilled foods.', '1.69', True, 'Spices & Condiments', False),
            ('Garam Masala 50g', 'Freshly ground blend of warming whole spices. The finishing touch for curries.', '1.29', True, 'Spices & Condiments', False),
            ('White Vinegar 500ml', 'Distilled white vinegar. Ideal for pickling, cooking and natural cleaning.', '0.99', True, 'Spices & Condiments', False),
            ('Sesame Oil 250ml', 'Toasted sesame oil with a deep, nutty flavour. A finishing oil for Asian dishes.', '3.29', True, 'Spices & Condiments', False),

            # Personal Care
            ('Dove Shampoo 400ml', 'Moisturising shampoo with NutriumMoisture technology. For dry, damaged hair.', '4.49', True, 'Personal Care', False),
            ('Lifebuoy Body Wash 250ml', 'Antibacterial bodywash with 10x better germ protection. Fresh and invigorating.', '2.99', True, 'Personal Care', False),
            ('Closeup Toothpaste 150g', 'Red hot gel toothpaste with deep action whitening and fresh breath protection.', '1.99', True, 'Personal Care', True),
            ('Nivea Daily Moisturiser 200ml', 'Lightweight, non-greasy moisturiser. Absorbs instantly for 24-hour hydration.', '5.49', True, 'Personal Care', False),
            ('Sunscreen SPF 50 75ml', 'Broad-spectrum SPF 50 PA+++ sunscreen. Lightweight and non-whitening formula.', '6.99', True, 'Personal Care', True),
            ('Hand Sanitiser 100ml', '70% alcohol-based sanitiser with aloe vera. Kills 99.9% of germs.', '1.49', True, 'Personal Care', False),
            ('Face Wash (Neem) 100ml', 'Purifying neem face wash for oily and acne-prone skin. Gentle daily cleanser.', '2.49', True, 'Personal Care', False),
            ('Lip Balm SPF 20', 'Moisturising lip balm with SPF 20. Protects and softens dry chapped lips.', '1.29', True, 'Personal Care', False),
            ('Vaseline Petroleum Jelly 250g', 'Pure triple-purified petroleum jelly. Heals dry, cracked skin overnight.', '2.29', True, 'Personal Care', False),
            ('Deodorant Spray 150ml', 'Long-lasting 48-hour anti-perspirant deodorant. Fresh floral fragrance.', '3.49', True, 'Personal Care', False),

            # Household & Cleaning
            ('Dish Soap 500ml', 'Ultra-concentrated grease-cutting dish liquid with lemon fragrance.', '1.29', True, 'Household & Cleaning', False),
            ('Laundry Detergent 1kg', 'Active foam washing powder with stain-lift technology. Suitable for all fabrics.', '3.49', True, 'Household & Cleaning', True),
            ('Toilet Cleaner 500ml', 'Thick bleach-based toilet bowl cleaner. Kills bacteria and removes stains.', '1.19', True, 'Household & Cleaning', False),
            ('Mosquito Coil (10 pcs)', 'Long-burning mosquito repellent coils. 8-hour protection per coil.', '1.49', True, 'Household & Cleaning', False),
            ('Tissue Box 200 sheets', '3-ply facial tissue. Soft, strong and hypoallergenic. 200 sheets per box.', '1.99', True, 'Household & Cleaning', False),
            ('Floor Cleaner 1L', 'Concentrated floor cleaning liquid with pine fragrance. Leaves a streak-free shine.', '2.49', True, 'Household & Cleaning', False),
            ('Garbage Bags (30 pcs)', 'Heavy-duty black refuse sacks. 60-litre capacity with drawstring top.', '1.79', True, 'Household & Cleaning', False),
            ('Sponge Scrub (3 pcs)', 'Non-scratch dual-sided scrub sponge. Cleans without damaging surfaces.', '0.99', True, 'Household & Cleaning', False),
            ('Air Freshener Spray 300ml', 'Long-lasting room spray with ocean breeze fragrance. Neutralises odours.', '2.99', True, 'Household & Cleaning', False),
            ('LED Bulb 9W', 'Cool white LED bulb. Energy-saving with 10,000-hour lifespan.', '2.49', True, 'Household & Cleaning', False),

            # Frozen & Packaged
            ('Instant Noodles (5 pack)', 'Spicy chicken-flavoured instant noodles. Ready in 3 minutes.', '1.49', True, 'Frozen & Packaged', True),
            ('Canned Chickpeas 400g', 'Ready-to-use cooked chickpeas in brine. Perfect for salads and curries.', '1.29', True, 'Frozen & Packaged', False),
            ('Coconut Milk 400ml', 'Rich, creamy coconut milk. Ideal for curries, soups and desserts.', '1.99', True, 'Frozen & Packaged', False),
            ('Pasta (Penne) 500g', 'Durum wheat penne rigate. Perfect with tomato sauce or pasta bakes.', '1.49', True, 'Frozen & Packaged', False),
            ('Canned Tuna 170g', 'Skipjack tuna in spring water. High protein, low fat. Ready to eat.', '1.89', True, 'Frozen & Packaged', False),
            ('Tomato Puree 400g (can)', 'Double-concentrated Italian tomato puree. The base for any great sauce.', '1.09', True, 'Frozen & Packaged', False),
            ('Frozen Shrimp 500g', 'Peeled, de-veined white shrimp. Individually quick-frozen for freshness.', '7.99', True, 'Frozen & Packaged', True),
            ('Halal Chicken Nuggets 400g', 'Crispy breaded chicken nuggets made from 100% halal breast meat.', '4.49', True, 'Frozen & Packaged', True),
            ('Peanut Oil 1L', 'Pure refined peanut oil with a high smoke point. Ideal for deep frying.', '3.99', True, 'Frozen & Packaged', False),
            ('Bread Crumbs 200g', 'Golden dried breadcrumbs for coating, topping and stuffing recipes.', '0.99', True, 'Frozen & Packaged', False),

            # Electronics
            ('USB-C Charging Cable 1m', 'Braided nylon 60W fast-charging USB-C cable. Compatible with all USB-C devices.', '5.99', True, 'Electronics', False),
            ('Wireless Earbuds', 'True wireless earbuds with active noise cancellation and 24-hour battery case.', '34.99', True, 'Electronics', True),
            ('10000mAh Power Bank', 'Compact dual-port power bank. Charges a smartphone 2.5 times. Airline approved.', '19.99', True, 'Electronics', True),
            ('Phone Stand (Adjustable)', 'Foldable aluminium phone and tablet stand with 360° rotation.', '7.49', True, 'Electronics', False),
            ('Mechanical Keyboard (TKL)', 'Tenkeyless mechanical keyboard with blue switches and RGB backlight.', '59.99', True, 'Electronics', False),
            ('Wireless Mouse', 'Silent, ergonomic wireless mouse with 2.4GHz nano receiver and 18-month battery.', '17.99', True, 'Electronics', False),
            ('HDMI Cable 2m (4K)', 'High-speed HDMI 2.0 cable supporting 4K@60Hz HDR. Gold-plated connectors.', '6.99', True, 'Electronics', False),
            ('Screen Cleaning Kit', 'Microfibre cloth and 100ml spray solution. Safe for all screens.', '4.49', True, 'Electronics', False),
            ('Smart LED Strip 5m', 'Wi-Fi enabled RGB LED strip. Voice-compatible. App-controlled colours.', '14.99', True, 'Electronics', True),
            ('Portable Bluetooth Speaker', 'IPX7 waterproof Bluetooth 5.3 speaker. 12-hour playtime. 360° stereo sound.', '28.99', True, 'Electronics', True),
            ('Webcam 1080p HD', 'Full HD 1080p webcam with built-in stereo microphone. Plug-and-play USB.', '29.99', True, 'Electronics', False),
            ('Memory Card 64GB', 'UHS-I A1 microSD card. Up to 100 MB/s read speed. Ideal for smartphones.', '9.99', True, 'Electronics', False),
        ]
        count = 0
        for name, desc, price, stock, cat_name, is_featured in products_data:
            _, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'description': desc,
                    'price': price,
                    'stock': stock,
                    'category': categories[cat_name],
                    'is_featured': is_featured,
                },
            )
            if created:
                count += 1
        if count:
            self.stdout.write(self.style.SUCCESS(f'Seeded {count} sample products.'))

    def _create_superuser(self):
        username = os.getenv('DJANGO_SUPERUSER_USERNAME')
        email = os.getenv('DJANGO_SUPERUSER_EMAIL', '')
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

        if not username or not password:
            return

        if User.objects.filter(username=username).exists():
            return

        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" created.'))