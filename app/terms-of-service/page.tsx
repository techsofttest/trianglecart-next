import React from 'react';

export default function TermsOfServicePage() {
    const sections = [
        { id: "intro", title: "1. Introduction" },
        { id: "accounts", title: "2. User Accounts" },
        { id: "orders", title: "3. Orders & Payments" },
        { id: "shipping", title: "4. Shipping & Delivery" },
        { id: "liability", title: "5. Limitation of Liability" },
    ];

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Sticky Table of Contents (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24 space-y-4">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Contents</h3>
                            <nav className="flex flex-col space-y-3">
                                {sections.map((section) => (
                                    <a 
                                        key={section.id}
                                        href={`#${section.id}`} 
                                        className="text-sm font-medium text-gray-600 hover:text-[#0c4a9e] transition-colors border-l-2 border-transparent hover:border-[#0c4a9e] pl-4 py-1"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="lg:col-span-9 max-w-3xl">
                        
                        {/* Document Header */}
                        <header className="mb-20 border-b border-gray-100 pb-12">
                            <div className="inline-flex items-center px-3 py-1 bg-gray-50 rounded-full text-sm font-bold text-gray-600 uppercase tracking-widest mb-6 border border-gray-100">
                                Legal Document
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Terms of Service</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                <span>Version 1.2</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span>Updated May 14, 2026</span>
                            </div>
                        </header>

                        {/* Sections */}
                        <div className="space-y-20 pb-20">
                            
                            <section id="intro" className="scroll-mt-24 group">
                                <h2 className="text-sm font-bold text-[#0c4a9e] uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                                    01 <span className="h-px bg-gray-100 flex-1" />
                                </h2>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Introduction</h3>
                                <div className="prose prose-gray">
                                    <p className="text-[16px] text-gray-600 leading-[1.8] font-medium">
                                        Welcome to Triangle Cart Pvt Ltd. These Terms of Service ("Terms") govern your access to and use of our website and services. By accessing or using Triangle Cart, you agree to be bound by these Terms and our Privacy Policy. 
                                        Our goal is to provide a seamless and transparent shopping experience for our customers.
                                    </p>
                                </div>
                            </section>

                            <section id="accounts" className="scroll-mt-24 group">
                                <h2 className="text-sm font-bold text-[#0c4a9e] uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                                    02 <span className="h-px bg-gray-100 flex-1" />
                                </h2>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">User Accounts</h3>
                                <div className="prose prose-gray">
                                    <p className="text-[16px] text-gray-600 leading-[1.8] font-medium">
                                        To use certain features of our platform, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. 
                                        You must notify us immediately of any unauthorized use or security breach.
                                    </p>
                                </div>
                            </section>

                            <section id="orders" className="scroll-mt-24 group">
                                <h2 className="text-sm font-bold text-[#0c4a9e] uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                                    03 <span className="h-px bg-gray-100 flex-1" />
                                </h2>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Orders & Payments</h3>
                                <div className="prose prose-gray space-y-6">
                                    <p className="text-[16px] text-gray-600 leading-[1.8] font-medium">
                                        All orders are subject to acceptance and availability. Prices are listed in Australian Dollars (AUD). We reserve the right to refuse or cancel any order for reasons including but not limited to product availability, errors in pricing, or suspected fraudulent activity.
                                    </p>
                                    <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100 border-dashed">
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Payment Policy</p>
                                        <p className="text-sm text-gray-600 font-medium">
                                            We accept major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. All transactions are encrypted and processed through certified third-party payment providers.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section id="shipping" className="scroll-mt-24 group">
                                <h2 className="text-sm font-bold text-[#0c4a9e] uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                                    04 <span className="h-px bg-gray-100 flex-1" />
                                </h2>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Shipping & Delivery</h3>
                                <div className="prose prose-gray">
                                    <p className="text-[16px] text-gray-600 leading-[1.8] font-medium">
                                        Delivery times provided are estimates and are not guaranteed. Triangle Cart is not responsible for delays caused by shipping carriers, severe weather, or customs inspections. 
                                        The risk of loss and title for items purchased pass to you upon delivery of the items to the carrier.
                                    </p>
                                </div>
                            </section>

                            <section id="liability" className="scroll-mt-24 group">
                                <h2 className="text-sm font-bold text-[#0c4a9e] uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                                    05 <span className="h-px bg-gray-100 flex-1" />
                                </h2>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Limitation of Liability</h3>
                                <div className="prose prose-gray">
                                    <p className="text-[16px] text-gray-600 leading-[1.8] font-medium">
                                        Triangle Cart shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services. 
                                        To the maximum extent permitted by law, our total liability shall not exceed the amount paid by you for the specific product or service in question.
                                    </p>
                                </div>
                            </section>

                            {/* Minimalist Footer */}
                            <footer className="pt-20 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <p className="text-sm text-gray-500 font-medium">
                                        Questions? Reach out to <a href="mailto:support@trianglecart.com.au" className="text-[#0c4a9e] hover:underline">support@trianglecart.com.au</a>
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <button className="text-sm font-bold text-gray-500 uppercase tracking-widest hover:text-gray-900 transition-colors">Download PDF</button>
                                        <button className="text-sm font-bold text-gray-500 uppercase tracking-widest hover:text-gray-900 transition-colors">Print Page</button>
                                    </div>
                                </div>
                            </footer>

                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
