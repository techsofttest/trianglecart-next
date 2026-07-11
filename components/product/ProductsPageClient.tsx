'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { LayoutGrid, Package } from 'lucide-react';

// Component Imports
import { BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import CategorySidebar from '@/components/category/CategorySidebar';
import CategoryHeader from '@/components/category/CategoryHeader';
import ProductGrid from '@/components/category/ProductGrid';
import { ProductGridSkeleton } from '@/components/category/ProductSkeleton';
import { FilterOption } from '@/components/category/SubCategoryFilter';
import { Product } from '@/components/product/ProductCard';

// API Imports
import { fetchStorefront } from '@/lib/storefront';
import { StorefrontProduct, hasInStockVariant, toProductCardModel } from '@/lib/product';

interface CategoryApiResponse {
    id: number;
    name: string;
    slug: string;
    product_count: number;
}

interface ProductApiResponse {
    data: StorefrontProduct[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function ProductsPageClient() {
    // 1. Core States
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<CategoryApiResponse[]>([]);
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
    
    // Sidebar Filters State
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('relevance');

    // Loading & Pagination
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    // 2. Fetch Initial Categories & Max Prices
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const fetched = await fetchStorefront<CategoryApiResponse[]>('/api/storefront/categories');
                if (fetched) {
                    setCategories(fetched);
                }
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        };
        loadCategories();
    }, []);

    // 3. Dynamic Brands list extraction & Max Price calculator from current loaded products
    const { dynamicBrands, maxProductPrice } = useMemo(() => {
        const brands = new Set<string>();
        let maxPrice = 0;
        products.forEach(p => {
            if (p.brand) brands.add(p.brand);
            if (p.price > maxPrice) maxPrice = p.price;
        });
        return {
            dynamicBrands: Array.from(brands).sort(),
            maxProductPrice: Math.ceil(maxPrice) || 1000
        };
    }, [products]);

    // Update price slider range based on loaded products max price
    useEffect(() => {
        if (maxProductPrice > 0) {
            setPriceRange(prev => ({ min: 0, max: Math.max(prev.max, maxProductPrice) }));
        }
    }, [maxProductPrice]);

    // 4. Fetch Products hook when category or sort changes
    const fetchProducts = async (page: number, append = false) => {
        if (page === 1) setIsLoading(true);
        else setIsLoadingMore(true);

        try {
            let url = `/api/storefront/products?per_page=24&page=${page}`;
            if (selectedCategorySlug !== 'all') {
                url += `&category=${selectedCategorySlug}`;
            }
            if (sortBy === 'price-low') {
                url += '&sort=price_low';
            } else if (sortBy === 'price-high') {
                url += '&sort=price_high';
            } else if (sortBy === 'rating') {
                url += '&sort=featured'; // or Top Rated
            }

            const response = await fetchStorefront<ProductApiResponse>(url);
            if (response && response.data) {
                const inStockProducts = response.data.filter((product) => hasInStockVariant(product));
                const mapped: Product[] = inStockProducts.map(toProductCardModel);
                if (append) {
                    setProducts(prev => {
                        const existingIds = new Set(prev.map(p => p.id));
                        const uniqueNew = mapped.filter(p => !existingIds.has(p.id));
                        return [...prev, ...uniqueNew];
                    });
                } else {
                    setProducts(mapped);
                }
                setHasMore(response.meta.current_page < response.meta.last_page);
                setCurrentPage(response.meta.current_page);
            } else {
                if (!append) setProducts([]);
                setHasMore(false);
            }
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Trigger initial fetch or fetch on category/sort change
    useEffect(() => {
        fetchProducts(1, false);
    }, [selectedCategorySlug, sortBy]);

    // 5. Client-Side filtering for Price Range & Brands
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Price Filter
            if (product.price < priceRange.min || product.price > priceRange.max) return false;
            
            // Brand Filter
            if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand || "")) return false;

            return true;
        });
    }, [products, priceRange, selectedBrands]);

    // Infinite Scroll Observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoadingMore && hasMore && !isLoading) {
                fetchProducts(currentPage + 1, true);
            }
        }, { threshold: 0.1 });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [currentPage, hasMore, isLoadingMore, isLoading, selectedCategorySlug, sortBy]);

    // Category pills selection
    const filterOptions: FilterOption[] = useMemo(() => {
        const allOption: FilterOption = { id: "all", label: "All", icon: <LayoutGrid className="w-4 h-4" /> };
        const mappedOptions: FilterOption[] = categories.map(cat => ({
            id: cat.slug,
            label: cat.name,
            icon: <Package className="w-4 h-4" />
        }));
        return [allOption, ...mappedOptions];
    }, [categories]);

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Products' }
    ];

    return (
        <div className="bg-[#fff] min-h-screen pb-8">
            <div className="max-w-[1440px] mx-auto px-1 sm:px-2 md:px-3">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* LEFT SIDEBAR */}
                    <CategorySidebar 
                        brands={dynamicBrands} 
                        selectedBrands={selectedBrands}
                        setSelectedBrands={setSelectedBrands}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedRatings={[]}
                        setSelectedRatings={() => {}}
                    />

                    {/* RIGHT MAIN CONTENT */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5">
                        {/* Category Header & Filters */}
                        <CategoryHeader
                            title="All Products"
                            productCount={filteredProducts.length}
                            filters={filterOptions}
                            activeFilterId={selectedCategorySlug}
                            onFilterSelect={setSelectedCategorySlug}
                            breadcrumbItems={breadcrumbItems}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />

                        {/* Product Grid or Skeletons */}
                        {isLoading ? (
                            <ProductGridSkeleton count={8} />
                        ) : (
                            <ProductGrid products={filteredProducts} />
                        )}

                        {/* Infinite Scroll Loading State */}
                        {isLoadingMore && (
                            <div className="mt-4">
                                <ProductGridSkeleton count={4} />
                            </div>
                        )}

                        {/* Infinite Scroll Loader Trigger */}
                        {hasMore && !isLoading && !isLoadingMore && (
                            <div ref={loaderRef} className="py-10 flex justify-center">
                                <div className="w-8 h-8 border-4 border-[#0c4a9e] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {!hasMore && filteredProducts.length > 0 && !isLoading && (
                            <div className="py-10 text-center text-gray-400 font-medium border-t border-gray-50 mt-4 text-[13px]">
                                You've reached the end of the list.
                            </div>
                        )}

                        {filteredProducts.length === 0 && !isLoading && (
                            <div className="py-20 text-center">
                                <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
                                <p className="text-gray-500 mt-2 font-medium">Try adjusting your filters or category selection to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
