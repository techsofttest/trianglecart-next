import Link from 'next/link';

// 1. Define the TypeScript structure for what a "Category" looks like
export interface CategoryItem {
    id: string | number;
    name: string;
    imagePath?: string;      // Used when you have actual images
    fallbackIcon?: React.ReactNode; // Used before images are ready
    link: string;
    bgColor?: string;        // E.g., 'bg-red-50' for that Flipkart/Instamart vibe
}

// 2. Define the props the Grid component will accept
interface CategoryGridProps {
    title?: string;         // Optional section title (e.g., "Shop by Category")
    categories: CategoryItem[];
}

export default function CategoryGrid({ title, categories }: CategoryGridProps) {
    return (
        <section className="w-full">
            {/* Conditionally render the title if it's provided */}
            {title && (
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">{title}</h2>
                </div>
            )}

            {/* Horizontal scroll on mobile, Grid Layout on desktop */}
            <div className="flex overflow-x-auto gap-3 pb-3 scrollbar-thin px-1 sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 sm:gap-4 sm:overflow-x-visible sm:pb-0">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={category.link}
                        className="flex flex-col items-center group cursor-pointer shrink-0 w-[24%] sm:w-auto"
                    >
                        {/* Card / Image Container */}
                        <div className={`w-full aspect-square rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 transition-transform duration-300 group-hover:-translate-y-1 overflow-hidden relative ${category.bgColor || 'bg-white'}`}>

                            {/* Image/Icon Implementation — loads directly from admin storage */}
                            {category.imagePath ? (
                                <img
                                    src={category.imagePath}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                />
                            ) : (
                                <div className="text-gray-400 group-hover:text-[#0c4a9e] transition-colors">
                                    {category.fallbackIcon || <span className="text-2xl">📦</span>}
                                </div>
                            )}
                        </div>

                        {/* Category Title */}
                        <h3 className="text-[12px] sm:text-xs md:text-sm font-bold text-gray-800 text-center leading-tight group-hover:text-[#0c4a9e] transition-colors line-clamp-2">
                            {category.name}
                        </h3>
                    </Link>
                ))}
            </div>
        </section>
    );
}