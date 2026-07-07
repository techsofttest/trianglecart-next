import { Filter } from 'lucide-react';
import PriceRangeSlider from './PriceRangeSlider';

interface CategorySidebarProps {
    brands: string[];
    selectedBrands: string[];
    setSelectedBrands: (brands: string[]) => void;
    priceRange: { min: number; max: number };
    setPriceRange: (range: { min: number; max: number }) => void;
    selectedRatings: number[];
    setSelectedRatings: (ratings: number[]) => void;
}

export default function CategorySidebar({
    brands,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    selectedRatings,
    setSelectedRatings
}: CategorySidebarProps) {

    const toggleBrand = (brand: string) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    const toggleRating = (rating: number) => {
        if (selectedRatings.includes(rating)) {
            setSelectedRatings(selectedRatings.filter(r => r !== rating));
        } else {
            setSelectedRatings([...selectedRatings, rating]);
        }
    };

    return (
        <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <Filter className="w-5 h-5 text-gray-400" />
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                    <h4 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Price Range</h4>
                    <PriceRangeSlider
                        min={0}
                        max={100}
                        step={1}
                        onChange={setPriceRange}
                    />
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                    <h4 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Brand</h4>
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {brands.map((brand, idx) => (
                            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                    className="w-4 h-4 text-[#0c4a9e] border-gray-300 rounded focus:ring-[#0c4a9e] cursor-pointer"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">{brand}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Customer Ratings Filter - Hidden for now */}
                {false && (
                    <div className="mb-6">
                        <h4 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Ratings</h4>
                        <div className="flex flex-col gap-2">
                            {[4, 3, 2, 1].map((rating) => (
                                <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selectedRatings.includes(rating)}
                                        onChange={() => toggleRating(rating)}
                                        className="w-4 h-4 text-[#0c4a9e] border-gray-300 rounded focus:ring-[#0c4a9e] cursor-pointer"
                                    />
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                                        <span>{rating}</span>
                                        <span className="text-amber-400">★</span>
                                        <span>& above</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
