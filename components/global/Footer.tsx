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
                                    FAQ
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
                            
                            <p className="text-gray-400 font-medium">
                                <span className="font-semibold text-gray-400">Email:</span> shop@trianglecart.com.au
                            </p>
                        </div>
                        
                    </div>

                </div>

                {/* Footer Bottom Strip (Icons, Legal links & Payment Badges) */}
                <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
                    

                    {/* Copyright & Team Information */}
                    <div className="text-center lg:text-right">
                        <p className="text-[12px] text-gray-400 leading-relaxed font-medium">
                            &copy; 2026 Triangle Cart Pvt Ltd. All rights reserved
                        </p>
                    </div>

                    {/* Payment Gateways Badges (Clean Neutral Styled) */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <span className="text-[12px] uppercase tracking-wider font-semibold text-gray-500 mr-1 hidden sm:inline">Secure Payments</span>
                        <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[12px] font-semibold text-gray-500 tracking-wider">Apple Pay</div>
                        <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[12px] font-semibold text-gray-500 tracking-wider">Google Pay</div>
                        <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[12px] font-semibold text-gray-500 tracking-wider">Credit Card</div>
                        <div className="px-2 py-1 bg-gray-900 border border-gray-800 rounded text-[12px] font-semibold text-gray-500 tracking-wider">Debit Card</div>
                    </div>
                </div>

            </div>


        </footer>
    );
}
