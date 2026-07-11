import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import ProductCard from '@/components/product/ProductCard';
import { fetchStorefront } from '@/lib/storefront';
import { StorefrontProduct, hasInStockVariant, toProductCardModel } from '@/lib/product';

type BrandResponse = {
    id: number;
    name: string;
    slug: string;
};

function titleFromSlug(slug: string) {
    return slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [homeData, productsPayload] = await Promise.all([
        fetchStorefront<{ brands: BrandResponse[] }>('/api/storefront/home'),
        fetchStorefront<{ data: StorefrontProduct[]; meta?: unknown }>(`/api/storefront/products?brand=${slug}&per_page=48`),
    ]);

    const brand = homeData?.brands?.find((item) => item.slug === slug);
    const brandTitle = brand?.name || titleFromSlug(slug);
    const products = (productsPayload?.data ?? [])
        .filter((item) => hasInStockVariant(item))
        .map((item) => toProductCardModel(item));

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: brandTitle },
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="pb-4">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>

                <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{brandTitle}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {products.length} products from this brand
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#0c4a9e] hover:text-[#0c4a9e]"
                    >
                        All Products
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pb-20">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-10 text-center">
                        <h2 className="text-xl font-semibold text-gray-900">No products found</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            We could not find any products for this brand right now.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
