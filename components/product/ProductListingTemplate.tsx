'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Tag, Percent, TrendingDown, Star, Sparkles, LayoutGrid } from 'lucide-react';

// Component Imports
import { BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import CategorySidebar from '@/components/category/CategorySidebar';
import CategoryHeader from '@/components/category/CategoryHeader';
import ProductGrid from '@/components/category/ProductGrid';
import { ProductGridSkeleton } from '@/components/category/ProductSkeleton';
import SubCategories, { SubCategoryItem } from '@/components/product/SubCategories';
import { FilterOption } from '@/components/category/SubCategoryFilter';
import { Product } from '@/components/product/ProductCard';

// Data Imports
import { fetchStorefront } from '@/lib/storefront';
import { StorefrontProduct, toProductCardModel } from '@/lib/product';

interface ProductListingTemplateProps {
    title: string;
    breadcrumbItems: BreadcrumbItem[];
    showSubCategories?: boolean;
    initialProducts?: Product[];
    currentCategorySlug?: string;
    subCategorySlug?: string;
}

export default function ProductListingTemplate({ 
    title, 
    breadcrumbItems,
    showSubCategories = true,
    initialProducts,
    currentCategorySlug,
    subCategorySlug
}: ProductListingTemplateProps) {
    
    // 1. Quick Filters State
    const filterOptions: FilterOption[] = [
        { id: "all", label: "All", icon: <LayoutGrid className="w-4 h-4" /> },
        { id: "upto20", label: "Upto 20% Off", icon: <Tag className="w-4 h-4" /> },
        { id: "upto30", label: "30% Off or Discount", icon: <Percent className="w-4 h-4" /> },
        { id: "lowest", label: "Lowest Price", icon: <TrendingDown className="w-4 h-4" /> },
        { id: "best", label: "Best Price", icon: <Star className="w-4 h-4" /> },
        { id: "new", label: "Newly Added", icon: <Sparkles className="w-4 h-4" /> },
    ];
    const [activeQuickFilter, setActiveQuickFilter] = useState("all");

    // 2. Sidebar Filters State
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState("relevance");

    // 3. Infinite Scroll State
    const [visibleCount, setVisibleCount] = useState(12);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    // 4. Dynamic Data Calculation & Initial Filtering
    const [fetchedProducts, setFetchedProducts] = useState<Product[] | null>(null);
    const [fetchedSubCategories, setFetchedSubCategories] = useState<string[] | null>(null);
    useEffect(() => {
        let cancelled = false;
        const loadProducts = async () => {
            try {
                let url = `/api/storefront/products?per_page=48&page=1`;
                if (currentCategorySlug) url += `&category=${currentCategorySlug}`;
                const resp = await fetchStorefront<{ data: StorefrontProduct[] }>(url);
                if (!cancelled && resp && Array.isArray(resp.data)) {
                    const mapped = resp.data
                        .filter(p => p.variants && p.variants.length > 0)
                        .map(toProductCardModel)
                        .map(pc => ({
                            id: pc.id,
                            slug: pc.slug,
                            brand: pc.brand,
                            title: pc.title,
                            image: pc.image,
                            weight: pc.weight,
                            price: pc.price,
                            originalPrice: pc.originalPrice,
                            discount: pc.discount,
                            rating: pc.rating,
                            reviews: pc.reviews,
                            category: pc.category,
                            subCategory: (pc as any).subCategory || (pc as any).sub_category || undefined,
                            variants: pc.variants || undefined
                        }));
                    setFetchedProducts(mapped);
                }
            } catch (err) {
                console.error('Failed to load products for listing template', err);
                setFetchedProducts([]);
            }
        };
        loadProducts();
        // Load subcategories for this category
        const loadSubcats = async () => {
            try {
                if (!currentCategorySlug) return setFetchedSubCategories([]);
                const remote = await fetchStorefront<any>(`/api/storefront/subcategories?category=${currentCategorySlug}`);
                if (Array.isArray(remote) && remote.length > 0) return setFetchedSubCategories(remote.map((s: any) => typeof s === 'string' ? s : s.name || s.title || s.slug));

                // derive from fetched products if available
                if (resp && Array.isArray(resp?.data)) {
                    const set = new Set<string>();
                    resp.data.forEach((p: any) => {
                        const sc = p.subCategory || p.sub_category || p.subcategory;
                        if (sc) set.add(typeof sc === 'string' ? sc : sc.name || sc.title || '');
                    });
                    setFetchedSubCategories(Array.from(set));
                } else {
                    setFetchedSubCategories([]);
                }
            } catch (e) {
                setFetchedSubCategories([]);
            }
        };
        loadSubcats();
        return () => { cancelled = true; };
    }, [currentCategorySlug, subCategorySlug]);

    const baseProducts = useMemo(() => {
        const products = initialProducts || fetchedProducts || [];
        if (subCategorySlug) return products.filter(p => p.subCategory === subCategorySlug || slugify((p.subCategory || '') as string) === subCategorySlug);
        if (currentCategorySlug) return products.filter(p => p.category === currentCategorySlug);
        return products;
    }, [initialProducts, fetchedProducts, currentCategorySlug, subCategorySlug]);

    const { dynamicBrands, maxProductPrice } = useMemo(() => {
        const brands = new Set<string>();
        let maxPrice = 0;
        baseProducts.forEach(p => {
            if (p.brand) brands.add(p.brand);
            if (p.price > maxPrice) maxPrice = p.price;
        });
        return {
            dynamicBrands: Array.from(brands).sort(),
            maxProductPrice: Math.ceil(maxPrice) || 1000
        };
    }, [baseProducts]);

    // Update price range when maxProductPrice changes (e.g. category change)
    useEffect(() => {
        setPriceRange({ min: 0, max: maxProductPrice });
    }, [maxProductPrice]);

    // 5. Filter & Sort Logic
    const filteredProducts = useMemo(() => {
        let result = baseProducts.filter(product => {
            // Price Filter
            if (product.price < priceRange.min || product.price > priceRange.max) return false;
            
            // Brand Filter
            if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand || "")) return false;
            
            // Rating Filter
            if (selectedRatings.length > 0 && !selectedRatings.some(r => (product.rating || 0) >= r)) return false;

            // Quick Filters
            if (activeQuickFilter === "upto20" && parseFloat(product.discount || "0") < 20) return false;
            if (activeQuickFilter === "upto30" && parseFloat(product.discount || "0") < 30) return false;
            if (activeQuickFilter === "best" && (product.rating || 0) < 4.7) return false;
            
            return true;
        });

        // Sorting Logic
        if (sortBy === "price-low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === "rating") {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        return result;
    }, [baseProducts, priceRange, selectedBrands, selectedRatings, activeQuickFilter, sortBy]);

    // Current subset of products to show
    const displayProducts = filteredProducts.slice(0, visibleCount);

    // Infinite Scroll Implementation
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoadingMore && visibleCount < filteredProducts.length) {
                setIsLoadingMore(true);
                setTimeout(() => {
                    setVisibleCount(prev => Math.min(prev + 12, filteredProducts.length));
                    setIsLoadingMore(false);
                }, 800);
            }
        }, { threshold: 0.1 });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [filteredProducts.length, isLoadingMore, visibleCount]);

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
                        maxPrice={maxProductPrice}
                        selectedRatings={selectedRatings}
                        setSelectedRatings={setSelectedRatings}
                    />

                    {/* RIGHT MAIN CONTENT */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5">
                        {/* Category Header & Filters */}
                        <CategoryHeader
                            title={title}
                            productCount={filteredProducts.length}
                            filters={filterOptions}
                            activeFilterId={activeQuickFilter}
                            onFilterSelect={setActiveQuickFilter}
                            breadcrumbItems={breadcrumbItems}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />

                        {/* Visual Sub-categories Section (Optional) */}
                        {showSubCategories && (
                            <div className="mb-8">
                                <SubCategories
                                    sectionTitle={`Shop ${title} by Category`}
                                    mainLink="#"
                                    items={(fetchedSubCategories || []).map((s) => ({
                                        imageUrl: '',
                                        label1: s,
                                        label2: s,
                                        linkUrl: currentCategorySlug ? `/category/${currentCategorySlug}/${slugify(s)}` : '#'
                                    }))}
                                    sectionBgColor="bg-[#0c4a9e]"
                                    showViewAll={false}
                                />
                            </div>
                        )}

                        {/* Product Grid */}
                        <ProductGrid products={displayProducts} />

                        {/* Infinite Scroll Loading State */}
                        {isLoadingMore && (
                            <div className="mt-4">
                                <ProductGridSkeleton count={4} />
                            </div>
                        )}

                        {/* Infinite Scroll Loader Trigger */}
                        {visibleCount < filteredProducts.length && !isLoadingMore && (
                            <div ref={loaderRef} className="py-10 flex justify-center">
                                <div className="w-8 h-8 border-4 border-[#0c4a9e] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {visibleCount >= filteredProducts.length && filteredProducts.length > 0 && !isLoadingMore && (
                            <div className="py-10 text-center text-gray-400 font-medium border-t border-gray-50 mt-4 text-[13px]">
                                You've reached the end of the list.
                            </div>
                        )}

                        {filteredProducts.length === 0 && (
                            <div className="py-20 text-center">
                                <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
                                <p className="text-gray-500 mt-2 font-medium">Try adjusting your filters to find what you're looking for.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
