import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import ProductDetailClient from '@/components/product/detail/ProductDetailClient';
import { fetchStorefront } from '@/lib/storefront';
import { StorefrontProduct, toProductCardModel } from '@/lib/product';

type ProductResponse = StorefrontProduct;

function splitHighlights(value?: string | null): string[] {
    if (!value) return [];
    return value.split(/\r?\n|•|;/).map((item) => item.trim()).filter(Boolean);
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const homeData = await fetchStorefront<{ products: StorefrontProduct[] }>('/api/storefront/home');
    let product = await fetchStorefront<ProductResponse>(`/api/storefront/products/${slug}`);

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

    const suggestedProducts = (homeData?.products ?? [])
        .filter((item) => item.slug !== product.slug)
        .slice(0, 10)
        .map((item) => toProductCardModel(item));

    const gallery = [product.featured_image, ...(product.gallery ?? [])].filter((img): img is string => Boolean(img));

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <nav className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-6 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-[#0c4a9e]">Home</Link>
                    <ChevronRight className="w-3 h-3 text-gray-200" />
                    <Link href="/products" className="hover:text-[#0c4a9e]">Products</Link>
                    <ChevronRight className="w-3 h-3 text-gray-200" />
                    <span className="text-gray-600 truncate max-w-[240px]">{product.name}</span>
                </nav>

                <ProductDetailClient
                    product={{
                        id: product.id,
                        slug: product.slug,
                        title: product.name,
                        brand: product.brand?.name || 'Triangle Cart',
                        price: selectedPrice,
                        originalPrice,
                        rating: product.rating || 0,
                        reviews: product.review_count || 0,
                        description: product.description || 'No product description is available yet.',
                        highlights: splitHighlights(product.key_features),
                        images: gallery.length > 0 ? gallery : ['/logo/mock-logo.png'],
                        variants,
                    }}
                />

                {suggestedProducts.length > 0 && (
                    <div className="pt-16 mt-16 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">You May Also Like</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                            {suggestedProducts.map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
