export const mockProducts = [
    {
        id: 1,
        name: 'Minimal Desk Lamp',
        description: 'A compact ambient desk lamp with a warm tone, matte finish, and adjustable neck for focused work lighting.',
        price: 2490,
        stock: true,
        image: 'https://picsum.photos/id/26/800/800'
    },
    {
        id: 2,
        name: 'Canvas Travel Backpack',
        description: 'Lightweight daily backpack with padded straps, inner laptop sleeve, and enough room for work or weekend essentials.',
        price: 3890,
        stock: true,
        image: 'https://picsum.photos/id/1062/800/800'
    },
    {
        id: 3,
        name: 'Ceramic Coffee Mug Set',
        description: 'A clean four-piece ceramic mug set designed for everyday use, with a durable glaze and balanced grip.',
        price: 1290,
        stock: true,
        image: 'https://picsum.photos/id/30/800/800'
    },
    {
        id: 4,
        name: 'Wireless Headphones',
        description: 'Over-ear wireless headphones with balanced sound, soft cushions, and long battery life for all-day listening.',
        price: 6790,
        stock: true,
        image: 'https://picsum.photos/id/180/800/800'
    },
    {
        id: 5,
        name: 'Modern Side Chair',
        description: 'A simple accent chair with a curved backrest and textured fabric, made for compact living spaces.',
        price: 8490,
        stock: false,
        image: 'https://picsum.photos/id/29/800/800'
    },
    {
        id: 6,
        name: 'Smart Water Bottle',
        description: 'Insulated stainless steel bottle with a sleek profile and everyday carry design for work, travel, or the gym.',
        price: 2190,
        stock: true,
        image: 'https://picsum.photos/id/225/800/800'
    }
]

export const getMockProductById = (id) => {
    const normalizedId = Number(id)
    return mockProducts.find((product) => product.id === normalizedId)
}