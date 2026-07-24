import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import ProductCard from '@/components/product/ProductCard';
import { fetchStorefront } from '@/lib/storefront';
import { StorefrontProduct, hasInStockVariant, toProductCardModel } from '@/lib/product';
import { slugify } from '@/utils/slugify';

type CategoryResponse = {
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

async function loadSubCategoriesFromApi(categorySlug: string, categoriesList: any[] | null | undefined, productsPayload: any) {
    // Try to read subcategories from the categories API object (common shapes)
    const categoryObj = categoriesList?.find((c: any) => c.slug === categorySlug || slugify(c.name) === categorySlug) || null;

    const possible = categoryObj ? (
        (categoryObj.sub_categories || categoryObj.children || categoryObj.subcategories || categoryObj.sub_categories_list || null)
    ) : null;

    if (Array.isArray(possible) && possible.length > 0) {
        return possible.map((s: any) => (typeof s === 'string' ? s : s.name || s.title || s.label || s.slug || ''))
            .filter(Boolean);
    }

    // Try a dedicated subcategories endpoint if present
    try {
        const remote = await fetchStorefront<any>(`/api/storefront/subcategories?category=${categorySlug}`);
        if (Array.isArray(remote) && remote.length > 0) {
            return remote.map((s: any) => (typeof s === 'string' ? s : s.name || s.title || s.label || s.slug || '')).filter(Boolean);
        }
    } catch (e) {
        // ignore and try deriving from products
    }

    // Fallback: derive subcategories from returned products payload
    const derived = new Set<string>();
    const products = productsPayload?.data || [];
    products.forEach((p: any) => {
        const candidates = [p.subCategory, p.sub_category, p.subcategory, p.sub_category_slug, p.sub_category_name, p.sub_category_label];
        for (const c of candidates) {
            if (typeof c === 'string' && c.trim()) {
                derived.add(c.trim());
                break;
            }
        }

        // also check nested category object
        if (p.category && typeof p.category === 'object') {
            const nested = p.category.sub_categories || p.category.subcategories || p.category.children || p.category.sub_category;
            if (Array.isArray(nested)) {
                nested.forEach((n: any) => {
                    if (typeof n === 'string' && n.trim()) derived.add(n.trim());
                    else if (n && (n.name || n.title)) derived.add((n.name || n.title).toString());
                });
            }
        }
    });

    return Array.from(derived);
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [categories, productsPayload] = await Promise.all([
        fetchStorefront<CategoryResponse[]>('/api/storefront/categories'),
        fetchStorefront<{ data: StorefrontProduct[]; meta?: unknown }>(`/api/storefront/products?category=${slug}&per_page=48`),
    ]);

    const category = categories?.find((item) => item.slug === slug);
    const categoryTitle = category?.name || titleFromSlug(slug);
    const subCategories = await loadSubCategoriesFromApi(slug, categories, productsPayload) || [];
    const products = (productsPayload?.data ?? [])
        .filter((item) => hasInStockVariant(item))
        .map((item) => toProductCardModel(item));

    const totalProductsCount = (productsPayload as any)?.meta?.total ?? products.length;

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: categoryTitle },
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="w-full py-6">
                <div className="pb-4">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>

                <div className="flex items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{categoryTitle}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {totalProductsCount} products found in this category
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

                {subCategories.length > 0 && (
                    <div className="overflow-x-auto pb-2 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6">
                        <div className="flex gap-2 min-w-max">
                            <Link
                                href={`/category/${slug}`}
                                className="whitespace-nowrap rounded-xl border border-[#0c4a9e] bg-[#0c4a9e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                            >
                                All
                            </Link>
                            {subCategories.map((subCategory) => (
                                <Link
                                    key={subCategory}
                                    href={`/category/${slug}/${slugify(subCategory)}`}
                                    className="whitespace-nowrap rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-[#0c4a9e] hover:text-[#0c4a9e]"
                                >
                                    {subCategory}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

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
                            We could not find any products in this category right now.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
