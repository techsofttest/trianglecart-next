import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import SubCategoryFilter, { FilterOption } from './SubCategoryFilter';
import Breadcrumbs, { BreadcrumbItem } from '@/components/ui/Breadcrumbs';

interface CategoryHeaderProps {
    title: string;
    productCount: number;
    filters: FilterOption[];
    activeFilterId: string;
    onFilterSelect: (id: string) => void;
    breadcrumbItems: BreadcrumbItem[];
    sortBy: string;
    onSortChange: (sort: string) => void;
}

export default function CategoryHeader({ 
    title, 
    productCount, 
    filters, 
    activeFilterId, 
    onFilterSelect,
    breadcrumbItems,
    sortBy,
    onSortChange
}: CategoryHeaderProps) {
    return (
        <div className="mb-8">
            {/* Breadcrumbs integrated into header */}
            <div className="mb-2">
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-[#0c4a9e] capitalize">{title}</h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Showing {productCount} products</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="lg:hidden flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm transition-colors flex-1">
                        <SlidersHorizontal className="w-4 h-4" /> Filter
                    </button>
                    <div className="relative flex-1 md:flex-none">
                        <select 
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 font-semibold py-2 pl-4 pr-10 rounded-lg text-sm outline-none focus:border-[#0c4a9e] cursor-pointer"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            <SubCategoryFilter 
                filters={filters} 
                activeFilterId={activeFilterId} 
                onSelect={onFilterSelect} 
            />
        </div>
    );
}
