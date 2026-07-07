import { ReactNode, useRef, useState, MouseEvent } from 'react';

export interface FilterOption {
    id: string;
    label: string;
    icon?: ReactNode;
}

interface SubCategoryFilterProps {
    filters: FilterOption[];
    activeFilterId: string;
    onSelect: (id: string) => void;
}

export default function SubCategoryFilter({ filters, activeFilterId, onSelect }: SubCategoryFilterProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e: MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 cursor-grab active:cursor-grabbing select-none`}
        >
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => {
                        // Prevent click if we were dragging
                        if (!isDragging) onSelect(filter.id);
                    }}
                    onMouseUp={(e) => {
                        // Only trigger select if movement was minimal
                        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
                        if (Math.abs(x - startX) < 5) {
                            onSelect(filter.id);
                        }
                    }}
                    className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border-2 
                        ${activeFilterId === filter.id
                            ? 'bg-[#0c4a9e] text-white border-[#0c4a9e]'
                            : 'bg-white text-gray-700 border-gray-100 hover:border-[#0c4a9e] hover:text-[#0c4a9e]'
                        }`}
                >
                    {filter.icon && <span className="flex-shrink-0 w-4 h-4">{filter.icon}</span>}
                    {filter.label}
                </button>
            ))}
        </div>
    );
}
