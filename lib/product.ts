export interface StorefrontProduct {
    id: number;
    slug: string;
    name: string;
    sku?: string | null;
    brand: { name: string } | null;
    category: { slug: string } | null;
    featured_image: string | null;
    gallery?: string[];
    price: number;
    min_price?: number;
    max_price?: number;
    rating?: number;
    review_count?: number;
    variants?: Array<{
        id: number;
        sku: string | null;
        unit: string | null;
        size: string | null;
        price: number;
        stock: number;
    }>;
    description?: string | null;
    key_features?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
}

export interface ProductCardModel {
    id: string;
    slug?: string;
    brand?: string;
    title: string;
    image: string;
    weight: string;
    price: number;
    originalPrice: number;
    discount?: string;
    rating?: number;
    reviews?: number;
    isSponsored?: boolean;
    promoText?: string;
    expiryDate?: string;
    category?: string;
    subCategory?: string;
    variants?: Array<{
        id: number;
        sku: string | null;
        unit: string | null;
        size: string | null;
        price: number;
        stock: number;
    }>;
}

export function toProductCardModel(product: StorefrontProduct): ProductCardModel {
    const variant = product.variants?.[0];
    const activePrice = variant?.price ?? product.price ?? 0;
    const weight = variant ? `${variant.size || ''} ${variant.unit || ''}`.trim() : '1 unit';
    const originalPrice = product.max_price && product.max_price > activePrice
        ? product.max_price
        : Math.round((activePrice || 0) * 1.15 * 100) / 100;

    return {
        id: String(product.id),
        slug: product.slug,
        brand: product.brand?.name,
        title: product.name,
        image: product.featured_image || '/logo/mock-logo.png',
        weight: weight || '1 unit',
        price: activePrice,
        originalPrice,
        discount: originalPrice > activePrice
            ? `${Math.max(1, Math.round((1 - (activePrice / originalPrice)) * 100))}%`
            : undefined,
        rating: product.rating || 0,
        reviews: product.review_count || 0,
        category: product.category?.slug,
        variants: product.variants,
    };
}
