import { Product } from '@/components/product/ProductCard';
import { SubCategoryItem } from '@/components/product/SubCategories';
import { slugify } from '@/utils/slugify';

export const MOCK_BRANDS = [
    "Aashirvaad", "MDH", "Everest", "Catch", "Suhana", "MTR",
    "Amul", "India Gate", "Maggi", "Tata", "Haldiram's", "Parle-G",
    "Kwality Walls", "Vadilal", "Real", "Bikaji", "Mother Dairy",
    "Nescafe", "Coca-Cola", "Lay's", "Cadbury", "Kellogg's", "Saffola",
    "Dettol", "Himalaya", "Patanjali", "Wai Wai", "Brooke Bond", "Taj Mahal",
    "Lijjat", "Gits", "Dabur"
];

export const MOCK_VISUAL_SUBCATEGORIES: SubCategoryItem[] = [
    { label1: "Whole Spices", label2: "Premium Quality", imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/spices/whole-spices" },
    { label1: "Powdered Spices", label2: "Freshly Ground", imageUrl: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/spices/powdered-spices" },
    { label1: "Blended Masalas", label2: "Authentic Taste", imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bb087?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/spices/blended-masalas" },
    { label1: "Cooking Pastes", label2: "Easy & Quick", imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/spices/cooking-pastes" },
];

export const CATEGORY_STRUCTURE = [
    { name: "Fresh Indian Street Food", slug: "fresh-indian-street-food", subCategories: ["Samosas", "Kachoris", "Dhokla", "Paneer Tikka"] },
    { name: "Organic Products", slug: "organic-products", subCategories: ["Honey", "Ghee", "Pulses", "Oils"] },
    { name: "Nepali Items", slug: "nepali-items", subCategories: ["Wai Wai", "Momo Chutney", "Nepali Tea", "Chhurpi"] },
    { name: "Fruits & Vegetables", slug: "fruits-and-vegetables", subCategories: ["Vegetables", "Fruits", "Leafy Greens"] },
    { name: "Bread & Fresh Chapati", slug: "bread-and-fresh-chapati", subCategories: ["Chapati", "Bread", "Pav", "Kulcha"] },
    { name: "Biscuits", slug: "biscuits", subCategories: ["Glucose Biscuits", "Cream Biscuits", "Cookies"] },
    { name: "Drinks", slug: "drinks", subCategories: ["Flavored Milk", "Fruit Juices", "Soft Drinks"] },
    { name: "Sweets", slug: "sweets", subCategories: ["Traditional Sweets", "Tin Sweets", "Barfi"] },
    { name: "Frozen", slug: "frozen", subCategories: ["Ice Creams", "Frozen Veggies", "Ready to Fry"] },
    { name: "Dairy", slug: "dairy", subCategories: ["Ghee", "Butter", "Paneer", "Yogurt"] },
    { name: "Mukhavas", slug: "mukhavas", subCategories: ["Mouth Fresheners", "Digestives"] },
    { name: "Snacks & Chips", slug: "snacks-and-chips", subCategories: ["Namkeen", "Chips", "Extruded Snacks"] },
    { name: "Ready To Eat", slug: "ready-to-eat", subCategories: ["Curries", "Rice Meals", "Soups"] },
    { name: "Ready To Cook", slug: "ready-to-cook", subCategories: ["Meal Kits", "Marinated Items"] },
    { name: "Instant Mix", slug: "instant-mix", subCategories: ["Idli Mix", "Dosa Mix", "Gulab Jamun Mix"] },
    { name: "Spice Mixes/Masala", slug: "spice-mixes-masala", subCategories: ["Biryani Masala", "Chicken Masala", "Sabji Masala"] },
    { name: "Spices", slug: "spices", subCategories: ["Whole Spices", "Powdered Spices", "Blended Masalas"] },
    { name: "Flours", slug: "flours", subCategories: ["Wheat Flour", "Gram Flour", "Millet Flour"] },
    { name: "Jaggery", slug: "jaggery", subCategories: ["Jaggery Blocks", "Jaggery Powder"] },
    { name: "Poha & Mamra", slug: "poha-and-mamra", subCategories: ["Poha", "Mamra", "Rice Flakes"] },
    { name: "Pickles", slug: "pickles", subCategories: ["Mango Pickle", "Lime Pickle", "Mixed Pickle"] },
    { name: "Chutney, Paste & Sauces", slug: "chutney-paste-and-sauces", subCategories: ["Garlic Paste", "Ginger Paste", "Chutneys"] },
    { name: "Khakhara, Papad & Fryums", slug: "khakhara-papad-and-fryums", subCategories: ["Khakhara", "Papad", "Fryums"] },
    { name: "Noodles", slug: "noodles", subCategories: ["Instant Noodles", "Hakka Noodles"] },
    { name: "Oil & Ghee", slug: "oil-and-ghee", subCategories: ["Cooking Oil", "Ghee", "Mustard Oil"] },
    { name: "Dry Fruits & Nuts", slug: "dry-fruits-and-nuts", subCategories: ["Almonds", "Cashews", "Raisins"] },
    { name: "Tea & Drink Mixes", slug: "tea-and-drink-mixes", subCategories: ["Tea Leaves", "Instant Coffee", "Drink Mixes"] },
    { name: "Rice & Atta", slug: "rice-and-atta", subCategories: ["Basmati Rice", "Wheat Flour", "Sona Masoori"] },
    { name: "Lentils", slug: "lentils", subCategories: ["Toor Dal", "Moong Dal", "Urad Dal"] },
    { name: "Fasting Items", slug: "fasting-items", subCategories: ["Sabudana", "Rajgira", "Fasting Snacks"] },
    { name: "Other Food Items", slug: "other-food-items", subCategories: ["Sugar", "Salt", "Vinegar"] },
    { name: "Cosmetic", slug: "cosmetic", subCategories: ["Face Care", "Hair Care", "Body Care"] },
];

// Base list of high-quality manual products
const BASE_PRODUCTS: Product[] = [
    { id: "s1", brand: "Aashirvaad", title: "Aashirvaad Whole Wheat Atta", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80", weight: "5 kg", price: 12.50, originalPrice: 15.00, discount: "16%", rating: 4.9, reviews: 45000, category: "rice-and-atta", subCategory: "wheat-flour" },
    { id: "s2", brand: "Amul", title: "Amul Pure Ghee", image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=400&q=80", weight: "1 L Tin", price: 16.99, originalPrice: 18.50, discount: "8%", rating: 4.9, reviews: 8430, category: "dairy", subCategory: "ghee" },
    { id: "s3", brand: "Maggi", title: "Maggi Masala Noodles 8pk", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&q=80", weight: "560 g", price: 5.20, originalPrice: 6.50, discount: "20%", rating: 4.8, reviews: 45000, category: "noodles", subCategory: "instant-noodles" },
    { id: "s4", brand: "Haldiram's", title: "Haldiram's Gulab Jamun", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80", weight: "1 kg", price: 9.50, originalPrice: 11.00, discount: "14%", rating: 4.8, reviews: 12000, category: "sweets", subCategory: "traditional-sweets" },
    { id: "s5", brand: "Kwality Walls", title: "Vanilla Magic Ice Cream", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80", weight: "700 ml", price: 5.50, originalPrice: 6.50, discount: "15%", rating: 4.6, reviews: 3200, category: "frozen", subCategory: "ice-creams" },
];

// Helper to get a realistic brand based on category
const getBrandForCategory = (categorySlug: string) => {
    if (categorySlug.includes('atta') || categorySlug.includes('flours')) return "Aashirvaad";
    if (categorySlug.includes('dairy') || categorySlug.includes('sweets') || categorySlug.includes('drinks')) return "Amul";
    if (categorySlug.includes('spices')) return "Everest";
    if (categorySlug.includes('snacks')) return "Haldiram's";
    if (categorySlug.includes('noodles')) return "Maggi";
    if (categorySlug.includes('frozen')) return "Vadilal";
    if (categorySlug.includes('nepali')) return "Wai Wai";
    if (categorySlug.includes('cosmetic')) return "Himalaya";
    return "Triangle Choice";
};

// Programmatically generate at least 2 products for EVERY subcategory
export const MOCK_PRODUCTS: Product[] = [
    ...BASE_PRODUCTS,
    ...CATEGORY_STRUCTURE.flatMap(cat =>
        cat.subCategories.flatMap((sub, subIdx) =>
            Array.from({ length: 3 }, (_, pIdx) => ({
                id: `gen-${cat.slug}-${slugify(sub)}-${pIdx}`,
                brand: getBrandForCategory(cat.slug),
                title: `${sub} ${pIdx + 1} - Premium Selection`,
                image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=400&q=80",
                weight: "500 g",
                price: parseFloat(((subIdx + pIdx + 5) * 1.5).toFixed(2)),
                originalPrice: parseFloat(((subIdx + pIdx + 8) * 2.2).toFixed(2)),
                discount: "15%",
                rating: parseFloat((4 + ((subIdx + pIdx) % 10) / 10).toFixed(1)),
                reviews: 100 + (subIdx * 50) + (pIdx * 20),
                category: cat.slug,
                subCategory: slugify(sub)
            }))
        )
    )
];

// Infinite scroll set
export const LARGE_MOCK_PRODUCTS: Product[] = Array.from({ length: 800 }, (_, i) => ({
    ...MOCK_PRODUCTS[i % MOCK_PRODUCTS.length],
    id: `prod-infinite-${i}`,
    title: `${MOCK_PRODUCTS[i % MOCK_PRODUCTS.length].title} (Special Pack ${i + 1})`,
}));

// Address Mock Data
export const MOCK_ADDRESSES = [
    {
        id: '1',
        name: 'John Smith',
        type: 'HOME',
        address: '123 George St, Sydney NSW 2000',
        phone: '+61 412 345 678',
        email: 'john@example.com',
        icon: 'Home'
    }
];

// Cart Mock Data
export const MOCK_CART_ITEMS = [
    {
        id: 'c1',
        name: 'Aashirvaad Superior MP Atta',
        price: 18.50,
        image: 'https://www.aashirvaad.com/img/product-listing/superior-mp-atta.png',
        quantity: 1,
        weight: '10kg',
        brand: 'Aashirvaad',
        category: 'Flour & Atta',
        inStock: true
    },
    {
        id: 'c2',
        name: 'Daawat Rozana Super Basmati Rice',
        price: 12.99,
        image: 'https://daawat.com/wp-content/uploads/2021/04/Rozana-Super.png',
        quantity: 2,
        weight: '5kg',
        brand: 'Daawat',
        category: 'Rice & Grains',
        inStock: false
    },
    {
        id: 'c3',
        name: 'Aashirvaad Superior MP Atta',
        price: 18.50,
        image: 'https://www.aashirvaad.com/img/product-listing/superior-mp-atta.png',
        quantity: 1,
        weight: '10kg',
        brand: 'Aashirvaad',
        category: 'Flour & Atta',
        inStock: true
    },
    {
        id: 'c4',
        name: 'Daawat Rozana Super Basmati Rice',
        price: 12.99,
        image: 'https://daawat.com/wp-content/uploads/2021/04/Rozana-Super.png',
        quantity: 2,
        weight: '5kg',
        brand: 'Daawat',
        category: 'Rice & Grains',
        inStock: false
    }
];

