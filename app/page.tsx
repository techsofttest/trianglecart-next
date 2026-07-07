import { MapPin } from "lucide-react";
import PromoSlider from "@/components/ui/PromoSlider";
import CategoryGrid, { CategoryItem } from "@/components/product/CategoryGrid";
import SubCategories, { SubCategoryItem } from "@/components/product/SubCategories";
import ProductRow from "@/components/product/ProductRow";
import { Product } from "@/components/product/ProductCard";
import OurBrands, { BrandItem } from "@/components/product/OurBrands";
import TopOffersCarousel, { OfferItem } from "@/components/product/TopOffersCarousel";
import BuyItAgainRow from "@/components/product/BuyItAgainRow";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fetchStorefront } from "@/lib/storefront";
import { toProductCardModel } from "@/lib/product";

export default async function Home() {
  const homeData = await fetchStorefront<{
    products: Array<{
      id: number;
      name: string;
      slug: string;
      featured_image: string | null;
      price: number;
      max_price: number;
      rating: number;
      review_count: number;
      brand: { name: string } | null;
      category: { slug: string } | null;
      variants: Array<{
        id: number;
        sku: string | null;
        size: string | null;
        unit: string | null;
        price: number;
        stock: number;
      }>;
    }>;
    brands: Array<{
      id: number;
      name: string;
      slug: string;
      logo_url: string | null;
      product_image_url: string | null;
      link: string;
    }>;
    home_advertisement: {
      id: number;
      name: string;
      title: string | null;
      banner_url: string | null;
      url: string;
    } | null;
  }>('/api/storefront/home');

  const categoriesData = await fetchStorefront<Array<{
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    icon_url: string | null;
  }>>('/api/storefront/categories');

  const topOffersData = await fetchStorefront<Array<{
    id: number;
    title: string;
    label: string;
    image_url: string | null;
    href: string;
  }>>('/api/storefront/top-offers');

  const bgColors = [
    "bg-red-50/60", "bg-yellow-50/60", "bg-green-50/60", "bg-orange-50/60",
    "bg-pink-50/60", "bg-blue-50/60", "bg-purple-50/60", "bg-gray-50/60",
  ];

  const prominentCategories: CategoryItem[] = categoriesData?.map((cat, index) => ({
    id: cat.id,
    name: cat.name,
    link: `/category/${cat.slug}`,
    bgColor: bgColors[index % bgColors.length],
    imagePath: cat.image_url || undefined,
    fallbackIcon: cat.icon_url ? <img src={cat.icon_url} alt={cat.name} className="w-8 h-8 md:w-10 md:h-10 object-contain" /> : undefined
  })) ?? [];

  const suggestedProducts: Product[] = homeData?.products.map((p) => toProductCardModel(p)) ?? [];

  const featuredBrands: BrandItem[] = homeData?.brands.map((brand) => ({
    id: brand.id,
    name: brand.name,
    logoUrl: brand.logo_url || '/logo/mock-logo.png',
    productImageUrl: brand.product_image_url || '/logo/mock-logo.png',
    bgGradient: 'from-slate-100 to-slate-200/60',
    link: brand.link,
  })) ?? [];

  const topOffers: OfferItem[] = topOffersData?.map((offer) => ({
    id: offer.id,
    categoryName: offer.title,
    discountText: offer.label,
    imageUrl: offer.image_url || '/promo-banner/pr1.jpg',
    link: offer.href,
  })) ?? [];

  const premiumSpicesItems: SubCategoryItem[] = [
    { label1: "Kashmiri Red Chilli", label2: "Vibrant & Fiery", imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/spices/red-chilli" },
    { label1: "Aromatic Cardamom", label2: "Premium Quality", imageUrl: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/spices/cardamom" },
    { label1: "Pure Turmeric Powder", label2: "Earthy & Healthy", imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/spices/turmeric" },
    { label1: "Garam Masala Blend", label2: "Min. 15% Off", imageUrl: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/spices/garam-masala" },
  ];

  const sweetsItems: SubCategoryItem[] = [
    { label1: "Laddu Mix", label2: "Min. 20% Off", imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/sweets/laddu" },
    { label1: "Barfi Packs", label2: "Best Sellers", imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/sweets/barfi" },
    { label1: "Rasgulla Tins", label2: "Special Offer", imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/sweets/rasgulla" },
    { label1: "Halwa Gifting", label2: "Buy 1 Get 1", imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80", linkUrl: "/category/sweets/halwa" },
  ];

  const buyItAgainProducts: Product[] = suggestedProducts.slice(0, 6);
  const homeAdvertisement = homeData?.home_advertisement;

  return (
    <div className="flex flex-col gap-10 md:gap-16 pb-12 pt-2 bg-[#fff]">
      <section className="w-full">
        <PromoSlider />
      </section>

      <section className="w-full">
        <BuyItAgainRow fallbackProducts={buyItAgainProducts} />
      </section>

      {topOffers.length > 0 && (
        <section className="w-full">
          <TopOffersCarousel offers={topOffers} />
        </section>
      )}

      <section className="w-full">
        <CategoryGrid title="Explore Categories" categories={prominentCategories} />
      </section>

      {homeAdvertisement && (
        <section className="w-full px-4 md:px-0">
          <Link
            href={homeAdvertisement.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-3xl border border-gray-100 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="relative min-h-[180px] md:min-h-[220px] bg-gradient-to-r from-[#0c4a9e] via-[#0f65c7] to-[#0f7bd7]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent_40%)]" />
              <div className="grid h-full md:grid-cols-[1.1fr_0.9fr]">
                <div className="flex items-center p-6 md:p-8 lg:p-10">
                  <div className="max-w-xl text-white">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                      <MapPin className="h-4 w-4" />
                      Local Partner Ad
                    </div>
                    <h3 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-black leading-tight">
                      {homeAdvertisement.title || homeAdvertisement.name}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm md:text-base text-white/85">
                      Tap the banner to explore this partner offer in a new tab.
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#0c4a9e] transition-transform group-hover:translate-x-0.5">
                      Open offer
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="relative min-h-[180px] md:min-h-full">
                  {homeAdvertisement.banner_url ? (
                    <img
                      src={homeAdvertisement.banner_url}
                      alt={homeAdvertisement.title || homeAdvertisement.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/10 text-white/80">
                      Banner unavailable
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section className="w-full">
        <ProductRow title="Suggested for you" products={suggestedProducts} viewAllLink="/products" />
      </section>

      <section className="w-full">
        <SubCategories
          sectionTitle="Aromatic Spices & Masalas"
          mainLink="/category/spices"
          items={premiumSpicesItems}
          sectionBgColor="bg-[#bf360c]"
        />
      </section>

      <section className="w-full">
        <ProductRow title="20+ Trending Everyday Deals" products={suggestedProducts.slice(0, 12)} viewAllLink="/products" />
      </section>

      <section className="w-full">
        <OurBrands title="Top Brands" brands={featuredBrands} />
      </section>

      <section className="w-full">
        <SubCategories
          sectionTitle="Festival Sweet Packs"
          mainLink="/category/sweets"
          items={sweetsItems}
          sectionBgColor="bg-green-700"
        />
      </section>

      <section className="w-full">
        <ProductRow title="Top Trending Essentials" products={suggestedProducts.slice(12, 24)} viewAllLink="/products" />
      </section>
    </div>
  );
}
