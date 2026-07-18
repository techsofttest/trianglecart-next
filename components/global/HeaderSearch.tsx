'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { fetchStorefront } from '@/lib/storefront';
import { hasInStockVariant, StorefrontProduct } from '@/lib/product';

type SearchCategory = { id: number; name: string; slug: string; };
type SearchBrand = { id: number; name: string; slug: string; };
type SearchProduct = StorefrontProduct & {
    brand: { name: string; slug: string } | null;
    category: { slug: string; name: string } | null;
};

type SearchResult =
    | { type: 'product'; id: string; title: string; subtitle?: string; href: string }
    | { type: 'category'; id: string; title: string; subtitle?: string; href: string }
    | { type: 'brand'; id: string; title: string; subtitle?: string; href: string };

export default function HeaderSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        setQuery('');
        setResults([]);
        setLoading(false);
        setFocused(false);
    }, [pathname]);

    useEffect(() => {
        const term = query.trim();
        if (!focused || term.length < 2) {
            setResults([]);
            return;
        }

        let cancelled = false;
        const handle = window.setTimeout(async () => {
            setLoading(true);
            const [productsPayload, headerData, homeData] = await Promise.all([
                fetchStorefront<{ data: SearchProduct[] }>(`/api/storefront/products?search=${encodeURIComponent(term)}&per_page=8`),
                fetchStorefront<{ categories: SearchCategory[] }>('/api/storefront/header'),
                fetchStorefront<{ brands: SearchBrand[] }>('/api/storefront/home'),
            ]);

            if (cancelled) return;

            const productResults: SearchResult[] = (productsPayload?.data ?? [])
                .filter((product) => hasInStockVariant(product))
                .map((product) => ({
                type: 'product',
                id: `product-${product.id}`,
                title: product.name,
                subtitle: [product.brand?.name, product.category?.name].filter(Boolean).join(' • ') || 'Product',
                href: `/product/${product.slug}`,
            }));

            const categoryResults: SearchResult[] = (headerData?.categories ?? [])
                .filter((category) =>
                    category.name.toLowerCase().includes(term.toLowerCase()) ||
                    category.slug.toLowerCase().includes(term.toLowerCase())
                )
                .slice(0, 4)
                .map((category) => ({
                    type: 'category',
                    id: `category-${category.id}`,
                    title: category.name,
                    subtitle: 'Category',
                    href: `/category/${category.slug}`,
                }));

            const brandResults: SearchResult[] = (homeData?.brands ?? [])
                .filter((brand) =>
                    brand.name.toLowerCase().includes(term.toLowerCase()) ||
                    brand.slug.toLowerCase().includes(term.toLowerCase())
                )
                .slice(0, 4)
                .map((brand) => ({
                    type: 'brand',
                    id: `brand-${brand.id}`,
                    title: brand.name,
                    subtitle: 'Brand',
                    href: `/brand/${brand.slug}`,
                }));

            setResults([...productResults, ...categoryResults, ...brandResults].slice(0, 10));
            setLoading(false);
        }, 250);

        return () => {
            cancelled = true;
            window.clearTimeout(handle);
        };
    }, [query, focused]);

    const searchQuery = query.trim();
    const hasResults = results.length > 0;
    const showPanel = focused && (query.trim().length >= 2 || loading || hasResults);

    const groupedLabel = useMemo(() => 'Search', []);

    const navigateToSearchPage = () => {
        if (!searchQuery) return;
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <div className="flex-1 max-w-xl relative">
            <div className={`flex items-center w-full bg-white rounded-md transition-all duration-200 border border-brand-blue ${focused ? 'shadow-md ring-2 ring-brand-blue/10' : ''}`}>
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-brand-blue transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        placeholder="Search for groceries, spices, brands..."
                        className="w-full bg-transparent py-2.5 pl-10 pr-4 outline-none text-sm text-gray-800 placeholder-gray-500"
                        onFocus={() => setFocused(true)}
                        onBlur={() => setTimeout(() => setFocused(false), 150)}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                navigateToSearchPage();
                            }
                        }}
                    />
                </div>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={navigateToSearchPage}
                    disabled={!searchQuery}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-r-md bg-[#0c4a9e] text-white text-sm font-semibold transition hover:bg-[#0c4a9e]/90 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                >
                    <Search className="w-4 h-4" />
                    Search
                </button>
            </div>

            {showPanel && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 shadow-xl rounded-md z-50 py-2 max-h-[420px] overflow-auto">
                    <div className="px-4 py-2 text-sm font-bold text-gray-700 uppercase tracking-wider">{groupedLabel}</div>
                    {loading ? (
                        <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
                    ) : hasResults ? (
                        <ul>
                            {results.map((item) => (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => router.push(item.href)}
                                        className="w-full px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-start gap-3 text-sm text-gray-700 text-left"
                                    >
                                        <Search className="w-4 h-4 text-gray-500 mt-0.5" />
                                        <span className="flex flex-col">
                                            <span className="font-medium text-gray-900">{item.title}</span>
                                            <span className="text-xs text-gray-500">{item.subtitle}</span>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : query.trim().length >= 2 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
