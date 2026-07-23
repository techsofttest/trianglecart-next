import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import ProductCard from '@/components/product/ProductCard';
import { fetchStorefront } from '@/lib/storefront';
import { StorefrontProduct, hasInStockVariant, toProductCardModel } from '@/lib/product';

type CategoryResponse = {
    id: number;
    name: string;
    slug: string;
    href: string;
};

type BrandResponse = {
    id: number;
    name: string;
    slug: string;
    href: string;
};

export const metadata = {
    title: 'Search | Triangle Cart',
    description: 'Search products, brands, and categories on Triangle Cart.',
};

export const dynamic = 'force-dynamic';

type SearchPageSearchParams = {
    q?: string | string[];
    search?: string | string[];
};

function normalizeSearchParam(value: string | string[] | undefined): string {
    if (!value) return '';
    return Array.isArray(value) ? value[0] : value;
}

function getSearchQuery(searchParams?: SearchPageSearchParams): string {
    const query = normalizeSearchParam(searchParams?.q ?? searchParams?.search);
    return query.trim();
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<SearchPageSearchParams> }) {
    const resolvedParams = await searchParams;
    const query = getSearchQuery(resolvedParams);
    const searchPayload = query
        ? await fetchStorefront<{ products: StorefrontProduct[]; categories: CategoryResponse[]; brands: BrandResponse[] }>(
            `/api/storefront/search?q=${encodeURIComponent(query)}&per_page=48`
        )
        : null;

    const products = (searchPayload?.products ?? [])
        .filter((item) => hasInStockVariant(item))
        .map((item) => toProductCardModel(item));

    const categories = searchPayload?.categories ?? [];
    const brands = searchPayload?.brands ?? [];

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Search' },
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="pb-4">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>

                {/* <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 sm:p-5 mb-8">
                    <form action="/search" method="get" className="flex flex-col sm:flex-row gap-3 items-stretch">
                        <label htmlFor="q" className="sr-only">Search keyword</label>
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                key={query}
                                id="q"
                                name="q"
                                type="text"
                                defaultValue={query}
                                placeholder="Search for products, brands, categories..."
                                className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-32 text-sm text-gray-900 outline-none transition focus:border-[#0c4a9e] focus:ring-2 focus:ring-[#0c4a9e]/10"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-2xl bg-[#0c4a9e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0c4a9e]/90"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </button>
                    </form>
                </div> */}

                <div className="mb-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Search results for “{query || '...' }”</h2>
                   
                </div>

                {!query ? (
                    <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                        <Search className="mx-auto h-10 w-10 text-gray-300" />
                        <h2 className="mt-4 text-lg font-semibold text-gray-900">Start typing to search</h2>
                        <p className="mt-2 text-sm text-gray-500">Enter a keyword to see matching products, categories, and brands.</p>
                    </div>
                ) : (
                    <div className="space-y-10">


                       {/* <div className="rounded-3xl border border-gray-200 bg-white p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Search keyword</p>
                                    <h2 className="text-xl font-semibold text-gray-900">{query}</h2>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {products.length} product{products.length === 1 ? '' : 's'} · {categories.length} category{categories.length === 1 ? '' : 'ies'} · {brands.length} brand{brands.length === 1 ? '' : 's'}
                                </div>
                            </div>

                            {products.length > 0 ? (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                                    <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
                                    <p className="mt-2 text-sm text-gray-500">Try searching for a different keyword or browse other categories.</p>
                                </div>
                            )}
                        </div> */}

                        {products.length > 0 && (
                            <section className="rounded-3xl border border-gray-200 bg-white p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-5">Products</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {categories.length > 0 && (
                            <section className="rounded-3xl border border-gray-200 bg-white p-6">
                                <div className="flex items-center justify-between gap-4 mb-5">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
                                        <p className="text-sm text-gray-500">Browse matching categories.</p>
                                    </div>
                                    <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-semibold text-[#0c4a9e] hover:text-[#0b3f7c]">
                                        View all
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={category.href}
                                            className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[#0c4a9e]"
                                        >
                                            <p className="text-base font-semibold text-gray-900">{category.name}</p>
                                            <p className="mt-2 text-sm text-gray-500">Category</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {brands.length > 0 && (
                            <section className="rounded-3xl border border-gray-200 bg-white p-6">
                                <div className="flex items-center justify-between gap-4 mb-5">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Brands</h2>
                                        <p className="text-sm text-gray-500">Matching brands for your search.</p>
                                    </div>
                                    <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-[#0c4a9e] hover:text-[#0b3f7c]">
                                        View all products
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {brands.map((brand) => (
                                        <Link
                                            key={brand.id}
                                            href={brand.href}
                                            className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left transition hover:border-[#0c4a9e]"
                                        >
                                            <p className="text-base font-semibold text-gray-900">{brand.name}</p>
                                            <p className="mt-2 text-sm text-gray-500">Brand</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {products.length === 0 && categories.length === 0 && brands.length === 0 && (
                            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                                <Search className="mx-auto h-12 w-12 text-gray-300" />
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">No results found</h3>
                                <p className="mt-2 text-sm text-gray-500">We couldn't find any products, categories, or brands matching "{query}". Try a different search term or browse our categories.</p>
                                <Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#0c4a9e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0c4a9e]/90">
                                    Browse all products
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
