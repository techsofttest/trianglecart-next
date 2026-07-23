import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailClient from '@/components/product/detail/ProductDetailClient';
import { fetchStorefront } from '@/lib/storefront';
import { DEFAULT_PRODUCT_IMAGE, StorefrontProduct, resolveProductImageUrl, toProductCardModel } from '@/lib/product';

type ProductResponse = StorefrontProduct;

type CategoryResponse = {
    id: number;
    name: string;
    slug: string;
    children?: Array<{ id: number; name: string; slug: string }>;
};

function splitHighlights(value?: string | null): string[] {
    if (!value) return [];
    return value.split(/\r?\n|•|;/).map((item) => item.trim()).filter(Boolean);
}

function deriveSuggestionCategorySlug(categories: CategoryResponse[] | null, categorySlug?: string | null): string | undefined {
    if (!categorySlug || !categories) return undefined;

    const topLevelCategory = categories.find((item) => item.slug === categorySlug);
    if (topLevelCategory) {
        return categorySlug;
    }

    const parentCategory = categories.find((item) =>
        item.children?.some((child) => child.slug === categorySlug)
    );

    return parentCategory?.slug || categorySlug;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [homeData, categories, fetchedProduct] = await Promise.all([
        fetchStorefront<{ products: StorefrontProduct[] }>('/api/storefront/home'),
        fetchStorefront<CategoryResponse[]>('/api/storefront/categories'),
        fetchStorefront<ProductResponse>(`/api/storefront/products/${slug}`),
    ]);

    let product = fetchedProduct;

    if (!product) {
        const fallback = homeData?.products.find((item) => item.slug === slug || String(item.id) === slug);
        if (fallback?.slug) {
            product = (await fetchStorefront<ProductResponse>(`/api/storefront/products/${fallback.slug}`)) || fallback;
        }
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md text-center space-y-3">
                    <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
                    <p className="text-gray-600">
                        We couldn&apos;t load this product right now. Please go back to the products list and try another item.
                    </p>
                    <Link href="/products" className="inline-flex px-5 py-2.5 rounded-xl bg-[#0c4a9e] text-white font-semibold">
                        Back to products
                    </Link>
                </div>
            </div>
        );
    }

    const suggestionCategorySlug = deriveSuggestionCategorySlug(categories, product.category?.slug);
    const suggestedCategoryResponse = suggestionCategorySlug
        ? await fetchStorefront<{ data: StorefrontProduct[] }>(`/api/storefront/products?category=${encodeURIComponent(suggestionCategorySlug)}&per_page=18`)
        : null;

    const suggestedProducts = (suggestedCategoryResponse?.data ?? [])
        .filter((item) => item.slug !== product.slug)
        .slice(0, 10)
        .map((item) => toProductCardModel(item));

    const fallbackProducts = suggestedProducts.length === 0
        ? (homeData?.products ?? []).filter((item) => item.slug !== product.slug).slice(0, 10).map((item) => toProductCardModel(item))
        : suggestedProducts;

    const variants = (product.variants ?? []).map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        unit: variant.unit,
        size: variant.size,
        price: variant.price,
        stock: variant.stock,
    }));

    const selectedPrice = variants[0]?.price ?? product.price ?? 0;
    const originalPrice = product.max_price && product.max_price > selectedPrice
        ? product.max_price
        : Math.round(selectedPrice * 1.15 * 100) / 100;

    const gallery = [product.featured_image, ...(product.gallery ?? [])]
        .filter((img): img is string => Boolean(img))
        .map((img) => resolveProductImageUrl(img));

    return (
        <div className="bg-white min-h-screen">
            <div className="mx-auto px-3 sm:px-3 lg:px-3 py-0">
                <nav className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-6 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-[#0c4a9e]">Home</Link>
                    <ChevronRight className="w-3 h-3 text-gray-200" />
                    <Link href="/products" className="hover:text-[#0c4a9e]">Products</Link>
                    <ChevronRight className="w-3 h-3 text-gray-200" />
                    <span className="text-gray-600 truncate max-w-[240px]">{product.name}</span>
                </nav>

                <ProductDetailClient
                    product={{
                        id: String(product.id),
                        slug: product.slug,
                        title: product.name,
                        brand: product.brand?.name || 'Triangle Cart',
                        price: selectedPrice,
                        originalPrice,
                        rating: product.rating || 0,
                        reviews: product.review_count || 0,
                        description: product.description || 'No product description is available yet.',
                        highlights: splitHighlights(product.key_features),
                        images: gallery.length > 0 ? gallery : [DEFAULT_PRODUCT_IMAGE],
                        variants,
                    }}
                />

                {fallbackProducts.length > 0 && (
                    <div className="pt-16 mt-16 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">You May Also Like</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                            {fallbackProducts.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
