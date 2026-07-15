'use client';

import { X } from 'lucide-react';
import PriceRangeSlider from './PriceRangeSlider';

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    brands: string[];
    selectedBrands: string[];
    setSelectedBrands: (brands: string[]) => void;
    priceRange: { min: number; max: number };
    setPriceRange: (range: { min: number; max: number }) => void;
}

export default function FilterDrawer({
    isOpen,
    onClose,
    brands,
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
}: FilterDrawerProps) {
    const toggleBrand = (brand: string) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-200"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6">
                    {/* Price Filter */}
                    <div>
                        <h3 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Price Range
                        </h3>
                        <PriceRangeSlider
                            min={0}
                            max={100}
                            step={1}
                            onChange={setPriceRange}
                        />
                    </div>

                    {/* Brand Filter */}
                    <div>
                        <h3 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Brand
                        </h3>
                        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {brands.length > 0 ? (
                                brands.map((brand, idx) => (
                                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => toggleBrand(brand)}
                                            className="w-4 h-4 text-[#0c4a9e] border-gray-300 rounded focus:ring-[#0c4a9e] cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                                            {brand}
                                        </span>
                                    </label>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">No brands available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer with Apply/Close button */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                    <button
                        onClick={onClose}
                        className="w-full bg-[#0c4a9e] hover:bg-[#0a3a7e] text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
}
