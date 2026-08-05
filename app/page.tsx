import PromoSlider from "@/components/ui/PromoSlider";
import OfferMarquee from "@/components/ui/OfferMarquee";
import CategoryStrip from "@/components/ui/CategoryStrip";
import CategoryGrid, { CategoryItem } from "@/components/product/CategoryGrid";
import SubCategories from "@/components/product/SubCategories";
import ProductRow from "@/components/product/ProductRow";
import { Product } from "@/components/product/ProductCard";
import OurBrands, { BrandItem } from "@/components/product/OurBrands";
import TopOffersCarousel, { OfferItem } from "@/components/product/TopOffersCarousel";
import BuyItAgainRow from "@/components/product/BuyItAgainRow";
import PWAInstallStrip from "@/components/PWAInstallStrip";
import Link from "next/link";
import { fetchStorefront } from "@/lib/storefront";
import { DEFAULT_PRODUCT_IMAGE, StorefrontProduct, resolveProductImageUrl, toProductCardModel } from "@/lib/product";

export default async function Home() {
  const [homeData, categoriesData, topOffersData, latestProductsData] = await Promise.all([
    fetchStorefront<{
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
      featured_categories?: Array<{
        id: number;
        name: string;
        slug: string;
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
      }>;
      banners?: Array<{
        id: number;
        name: string;
        image_url: string | null;
        url: string | null;
      }>;
      announcements?: Array<{
        id: number;
        text: string;
      }>;
    }>('/api/storefront/home'),
    fetchStorefront<Array<{
      id: number;
      name: string;
      slug: string;
      parent_id?: number | null;
      image_url: string | null;
      icon_url: string | null;
    }>>('/api/storefront/categories'),
    fetchStorefront<Array<{
      id: number;
      title: string;
      label: string;
      image_url: string | null;
      href: string;
    }>>('/api/storefront/top-offers'),
    fetchStorefront<{ data: StorefrontProduct[]; meta?: unknown }>(
      '/api/storefront/products?per_page=12&sort=latest&featured=false'
    ),
  ]);

  const bgColors = [
      "bg-red-50/60", "bg-yellow-50/60", "bg-green-50/60", "bg-orange-50/60",
      "bg-pink-50/60", "bg-blue-50/60", "bg-purple-50/60", "bg-gray-50/60",
    ];

    const productImageByCategory = new Map<string, string>();

  (homeData?.products ?? []).forEach((product) => {
    const categorySlug = product.category?.slug;

    if (categorySlug && !productImageByCategory.has(categorySlug) && product.featured_image) {
      productImageByCategory.set(
        categorySlug,
        resolveProductImageUrl(product.featured_image)
      );
    }
    });

  const prominentCategories: CategoryItem[] =
    categoriesData?.map((cat, index) => ({
      id: cat.id,
      name: cat.name,
      link: `/category/${cat.slug}`,
      bgColor: bgColors[index % bgColors.length],
      imagePath: cat.image_url
        ? resolveProductImageUrl(cat.image_url)
        : productImageByCategory.get(cat.slug),
      fallbackIcon: cat.icon_url ? (
        <img
          src={cat.icon_url}
          alt={cat.name}
          className="w-8 h-8 md:w-10 md:h-10 object-contain"
        />
      ) : undefined,
    })) ?? [];

    const suggestedProducts: Product[] = homeData?.products.map((p) => toProductCardModel(p)) ?? [];
    const latestProducts: Product[] = latestProductsData?.data.map((p) => toProductCardModel(p)) ?? [];

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

    const offerMessages: string[] = homeData?.announcements?.length
      ? homeData.announcements.map((announcement) => announcement.text)
      : [
          'Save up to 40% on fresh spices today',
          'Free delivery on orders over $150',
          'New season essentials just landed',
          'Limited-time festival bundles available now',
          'Shop pantry staples with instant offers',
        ];

    const featuredCategories = homeData?.featured_categories || [];

    const categoriesToRender = featuredCategories.length > 0
      ? featuredCategories.map((category, index) => {
          const products: Product[] = category.products.map((p) => toProductCardModel(p));
          return {
            title: category.name,
            link: `/category/${category.slug}`,
            products,
            sectionBgColor: index % 2 === 0 ? "bg-green-700" : "bg-blue-700",
          };
        })
      : [
          {
            title: "Aromatic Spices & Masalas",
            link: "/category/spices",
            products: suggestedProducts.filter(p => p.category === 'spices' || p.category === 'spice').length > 0
              ? suggestedProducts.filter(p => p.category === 'spices' || p.category === 'spice').slice(0, 6)
              : suggestedProducts.slice(0, 6),
            sectionBgColor: "bg-green-700",
          },
          {
            title: "Festival Sweet Packs",
            link: "/category/sweets",
            products: suggestedProducts.filter(p => p.category === 'sweets' || p.category === 'sweet').length > 0
              ? suggestedProducts.filter(p => p.category === 'sweets' || p.category === 'sweet').slice(0, 6)
              : suggestedProducts.slice(6, 12),
            sectionBgColor: "bg-blue-700",
          }
        ];

    const buyItAgainProducts: Product[] = suggestedProducts.slice(0, 6);
    const homeAdvertisement = homeData?.home_advertisement;

    return (
      <div className="flex flex-col gap-4 md:gap-10 pb-12 bg-[#fff]">
        <section className="w-full">
          <PromoSlider banners={homeData?.banners} />
        </section>

        <div className="px-2 sm:px-6 lg:px-8 w-full flex flex-col gap-4 md:gap-6 mx-auto">
          <section className="w-full relative z-10 sm:-mt-[55px] md:-mt-[65px]">
            {
              (() => {
                const mainCategoriesList = (categoriesData || []).filter(c => c.parent_id === null);
                const mainIds = new Set(mainCategoriesList.map(c => c.id));
                const extraFeatured = (featuredCategories || []).filter(fc => !mainIds.has(fc.id)).map(fc => ({
                  id: fc.id,
                  name: fc.name,
                  slug: fc.slug,
                  image_url: (fc as any).image_url ?? null,
                  icon_url: (fc as any).icon_url ?? null,
                }));

                const homepageStripCategories = [...mainCategoriesList, ...extraFeatured];
                return <CategoryStrip categories={homepageStripCategories} />;
              })()
            }
          </section>

          <section className="w-full">
            <OfferMarquee messages={offerMessages} />
          </section>

          <section className="w-full">
            <BuyItAgainRow fallbackProducts={buyItAgainProducts} />
          </section>

          {/*<section className="w-full">
            <CategoryGrid title="Explore Categories" categories={prominentCategories} />
          </section>*/}

          <section className="w-full">
            <ProductRow title="Featured products" products={suggestedProducts} viewAllLink="/products" />
          </section>

          <section className="w-full">
            <ProductRow title="Our latest products" products={latestProducts} viewAllLink="/products" />
          </section>

          <section className="w-full">
            <PWAInstallStrip />
          </section>

          {homeAdvertisement && (
            <section className="w-full">
              <Link
                href={homeAdvertisement.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-3xl border border-gray-100 shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {homeAdvertisement.banner_url ? (
                  <img
                    src={homeAdvertisement.banner_url}
                    alt={homeAdvertisement.title || homeAdvertisement.name}
                    className="w-full h-auto object-cover block"
                  />
                ) : (
                  <div className="relative min-h-[120px] bg-gradient-to-r from-[#0c4a9e] to-[#0f7bd7] flex items-center justify-center p-6 text-center text-white font-bold text-lg md:text-xl">
                    {homeAdvertisement.title || homeAdvertisement.name}
                  </div>
                )}
              </Link>
            </section>
          )}

          {categoriesToRender.map((cat, idx) => (
            <section key={idx} className="w-full">
              <SubCategories
                sectionTitle={cat.title}
                mainLink={cat.link}
                products={cat.products}
                sectionBgColor={cat.sectionBgColor}
              />
            </section>
          ))}

          {false && (
            <section className="w-full">
              <OurBrands title="Top Brands" brands={featuredBrands} />
            </section>
          )}

          <section className="w-full">
            <ProductRow title="Top Trending Essentials" products={suggestedProducts.slice(12, 24)} viewAllLink="/products" />
          </section>
        </div>
      </div>
    );
  }
