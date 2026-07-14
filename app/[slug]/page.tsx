import { notFound } from 'next/navigation';
import { apiUrl } from '@/lib/api';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

// Valid CMS slugs — static routes only, no catch-all
const CMS_SLUGS = [
    'about-us',
    'payments-otp',
    'shipping-dispatch',
    'cancellation-returns',
    'terms-of-use',
    'security-privacy',
    'refund-policy',
    'product-expiry-rules',
];

export async function generateStaticParams() {
    return CMS_SLUGS.map((slug) => ({ slug }));
}

async function getCmsPage(slug: string) {
    try {
        const res = await fetch(apiUrl(`/api/cms/${slug}`), {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getCmsPage(slug);
    if (!page) return { title: 'Page Not Found' };

    return {
        title: page.meta_title || page.title,
        description: page.meta_description || undefined,
    };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    if (!CMS_SLUGS.includes(slug)) {
        notFound();
    }

    const page = await getCmsPage(slug);

    if (!page) {
        notFound();
    }

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: page.title },
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

                {/* Breadcrumbs */}
                <Breadcrumbs items={breadcrumbItems} />

                {/* Header Section */}
                <div className="mt-6 mb-16 border-b border-gray-100 pb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
                        {page.title}
                    </h1>
                </div>

                {/* Image (if available) */}
                {page.image && (
                    <div className="mb-12">
                        <img
                            src={page.image}
                            alt={page.title}
                            className="w-full max-h-[400px] object-cover rounded-2xl"
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className="prose prose-gray max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-medium prose-a:text-[#0c4a9e] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />

            </div>
        </div>
    );
}
