'use client';

import { useParams } from 'next/navigation';
import ProductListingTemplate from '../../../../components/product/ProductListingTemplate';
import { BreadcrumbItem } from '@/components/ui/Breadcrumbs';

export default function SubCategoryPage() {
    const params = useParams();
    const categorySlug = params?.slug as string;
    const subCategorySlug = params?.subCategorySlug as string;

    // Format titles: 'red-chilli' -> 'Red Chilli'
    const categoryTitle = categorySlug
        ? categorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'Category';

    const subCategoryTitle = subCategorySlug
        ? subCategorySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'Sub Category';

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: categoryTitle, href: `/category/${categorySlug}` },
        { label: subCategoryTitle }
    ];

    return (
        <ProductListingTemplate
            title={subCategoryTitle}
            breadcrumbItems={breadcrumbItems}
            showSubCategories={false}
            currentCategorySlug={categorySlug}
            subCategorySlug={subCategorySlug}
        />
    );
}
