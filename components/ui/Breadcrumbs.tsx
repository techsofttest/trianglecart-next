import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center text-[12px] sm:text-sm text-gray-400 mb-2 font-medium">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {item.href ? (
                        <Link href={item.href} className="hover:text-[#0c4a9e] transition">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-semibold">{item.label}</span>
                    )}
                    {index < items.length - 1 && (
                        <ChevronRight className="w-3 h-3 mx-1" />
                    )}
                </div>
            ))}
        </nav>
    );
}
