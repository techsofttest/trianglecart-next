'use client';

import Link from 'next/link';
import {
    MapPin,
    HelpCircle,
    RefreshCw,
    Truck,
    Bell,
    Star,
    Percent,
    Store,
    Info,
    Mail
} from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300 border-t border-gray-900 mt-auto">
            {/* Top Features Ribbon: Showcases key client capabilities with neutral, standardized branding */}
            <div className="border-b border-gray-900 bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                        <div className="p-2 bg-gray-900 text-gray-400 rounded-lg">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm">Navigation & Easy Delivery</h4>
                            <p className="text-[12px] text-gray-400 mt-0.5 font-medium">Integrated GPS tracking & optimal dispatch routes.</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                        <div className="p-2 bg-gray-900 text-gray-400 rounded-lg">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm">Product Expiry Notification</h4>
                            <p className="text-[12px] text-gray-400 mt-0.5 font-medium">Always fresh stock with advanced tracking safeguards.</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                        <div className="p-2 bg-gray-900 text-gray-400 rounded-lg">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm">Easy Refund & Return Options</h4>
                            <p className="text-[12px] text-gray-400 mt-0.5 font-medium">Quick refunds and automated online returns support.</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                        <div className="p-2 bg-gray-900 text-gray-400 rounded-lg">
                            <Star className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white text-sm">My Last Purchase & Favorites</h4>
                            <p className="text-[12px] text-gray-400 mt-0.5 font-medium">One-click re-ordering directly from your past buy list.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Links Area (Flipkart Split-Design Inspired with clean neutral structure) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12 border-b border-gray-900">

                    {/* About Column */}
                    <div>
                        <h3 className="text-[12px] font-semibold text-gray-400 tracking-wider uppercase mb-4">About</h3>
                        <ul className="space-y-2 text-[12px]">
                            <li>
                                <Link href="/about" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/advertising" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Local Advertising Options
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help & Support Column */}
                    <div>
                        <h3 className="text-[12px] font-semibold text-gray-400 tracking-wider uppercase mb-4">Help</h3>
                        <ul className="space-y-2 text-[12px]">
                            <li>
                                <Link href="/payments" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Payments & OTP
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Shipping & Dispatch
                                </Link>
                            </li>
                            <li>
                                <Link href="/cancellation-returns" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Cancellation & Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    FAQ / Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Policy Column */}
                    <div>
                        <h3 className="text-[12px] font-semibold text-gray-400 tracking-wider uppercase mb-4">Consumer Policy</h3>
                        <ul className="space-y-2 text-[12px]">
                            <li>
                                <Link href="/policy/terms" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Terms Of Use
                                </Link>
                            </li>
                            <li>
                                <Link href="/policy/security" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Security & Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/policy/refund" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/policy/expiry-rules" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Product Expiry Rules
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Smart Features Column */}
                    <div>
                        <h3 className="text-[12px] font-semibold text-gray-400 tracking-wider uppercase mb-4">E-Cart Features</h3>
                        <ul className="space-y-2 text-[12px]">
                            <li>
                                <Link href="/features/favorites" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Add to Favourites list
                                </Link>
                            </li>
                            <li>
                                <Link href="/features/last-buy" className="hover:text-white hover:underline transition-colors block py-0.5 text-gray-400 font-medium">
                                    Last Buy Quick Cart
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Divider for Registered Addresses (matches Flipkart design for vertical split layout) */}
                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 md:pl-6 md:border-l border-gray-900">
                        {/* Mail Us / Warehouse Column */}
                        <div className="text-[12px] space-y-3">
                            <h3 className="text-[12px] font-semibold text-gray-400 tracking-wider uppercase flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-gray-400" /> Mail Us
                            </h3>
                            <p className="text-gray-400 leading-relaxed font-semibold text-white">
                                Triangle Cart Pvt Ltd
                            </p>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                50 Maltby CCT,<br />
                                Wanniassa, ACT-2903,<br />
                                Australia
                            </p>
                            <p className="text-gray-400 font-medium">
                                <span className="font-semibold text-gray-400">Email:</span> contact@10xminds.dev
                            </p>
                        </div>

                        {/* Registered Office Column */}
                        <div className="text-[12px] space-y-3">
                            <h3 className="text-[12px] font-semibold text-gray-400 tracking-wider uppercase flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-gray-400" /> Registered Office
                            </h3>
                            <p className="text-gray-400 leading-relaxed font-semibold text-white">
                                Triangle Cart Pvt Ltd
                            </p>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                50 Maltby CCT,<br />
                                Wanniassa, ACT-2903,<br />
                                Australia
                            </p>
                            <div className="pt-1.5 space-y-1">
                                <p className="text-gray-400 font-mono text-[12px] font-medium">
                                    <span className="font-semibold text-gray-400">ABN:</span> 88 407 290 295
                                </p>
                                <p className="text-gray-400 font-medium">
                                    <span className="font-semibold text-gray-400">Directors:</span><br />
                                    Sarith Chandran, Shyno Thomas
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Bottom Strip (Icons, Legal links & Payment Badges) */}
                <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-[12px] font-semibold text-gray-400">
                        <Link href="/advertise" className="flex items-center gap-1.5 hover:text-white hover:underline transition text-gray-400">
                            <Percent className="w-4 h-4 text-gray-400" /> Advertise with Us
                        </Link>
                        <Link href="/help" className="flex items-center gap-1.5 hover:text-white hover:underline transition text-gray-400">
                            <HelpCircle className="w-4 h-4 text-gray-400" /> Help Center
                        </Link>
                    </div>

                    {/* Copyright & Team Information */}
                    <div className="text-center lg:text-right">
                        <p className="text-[12px] text-gray-400 leading-relaxed font-medium">
                            &copy; 2007-2026 Triangle Cart Pvt Ltd. All rights reserved.
                        </p>
                        <p className="text-[12px] text-gray-400 mt-0.5 font-medium">
                            Standardized e-commerce system aligned with branding. Designed by Sarith Chandran & Shyno Thomas.
                        </p>
                    </div>

                    {/* Payment Gateways Badges (Clean Neutral Styled) */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <span className="text-[12px] uppercase tracking-wider font-semibold text-gray-500 mr-1 hidden sm:inline">Secured Payments</span>
                        <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[12px] font-semibold text-gray-500 tracking-wider">VISA</div>
                        <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[12px] font-semibold text-gray-500 tracking-wider">MC</div>
                        <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[12px] font-semibold text-gray-500 tracking-wider">AMEX</div>
                        <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[12px] font-semibold text-gray-500 tracking-wider">PAYPAL</div>
                        <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[12px] font-semibold text-gray-500 tracking-wider">STRIPE</div>
                        <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[12px] font-semibold text-gray-500 tracking-wider">OTP SMS</div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
