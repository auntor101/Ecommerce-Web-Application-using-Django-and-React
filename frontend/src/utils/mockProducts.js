export const mockProducts = [
    {
        id: 1,
        name: 'Premium Basmati Rice (5kg)',
        description: 'Aromatic long-grain basmati rice, perfect for biryani, pulao, and everyday meals. Sourced from the finest paddy fields.',
        price: 850,
        stock: true,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=450&fit=crop'
    },
    {
        id: 2,
        name: 'Fresh Hilsha Fish (per kg)',
        description: 'Wild-caught Hilsha (Ilish) from the rivers of Bangladesh. The national fish — rich, oily, and perfect for traditional recipes.',
        price: 1200,
        stock: true,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=450&fit=crop'
    },
    {
        id: 3,
        name: 'Organic Mixed Vegetables Box',
        description: 'A curated box of fresh, locally-grown seasonal vegetables including potatoes, tomatoes, onions, green chillies, and more.',
        price: 450,
        stock: true,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=450&fit=crop'
    },
    {
        id: 4,
        name: 'Wireless Bluetooth Earbuds',
        description: 'Lightweight true wireless earbuds with noise cancellation, 24hr battery life, and IPX5 water resistance — ideal for Dhaka commuters.',
        price: 2490,
        stock: true,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&h=450&fit=crop'
    },
    {
        id: 5,
        name: 'Pran Mango Juice (6-pack)',
        description: 'Refreshing mango juice made from real Rajshahi mangoes. No artificial colours or preservatives. 250ml × 6.',
        price: 320,
        stock: true,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=450&fit=crop'
    },
    {
        id: 6,
        name: 'Mustard Oil (1 Litre)',
        description: 'Pure pressed mustard oil — the essential cooking medium for authentic Bengali cuisine. Cold-pressed for maximum flavour.',
        price: 280,
        stock: true,
        image: 'https://images.unsplash.com/photo-1474979266404-7571d7841e56?w=600&h=450&fit=crop'
    },
    {
        id: 7,
        name: 'Portable Power Bank 20000mAh',
        description: 'High-capacity portable charger with dual USB and USB-C ports. Fast charging support for smartphones and tablets.',
        price: 1850,
        stock: true,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=450&fit=crop'
    },
    {
        id: 8,
        name: 'Darjeeling Premium Tea (500g)',
        description: 'Finest quality loose-leaf tea from the Darjeeling region. A perfect blend for your morning and evening cha.',
        price: 380,
        stock: false,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=450&fit=crop'
    }
]

export const getMockProductById = (id) => {
    const normalizedId = Number(id)
    return mockProducts.find((product) => product.id === normalizedId)
}