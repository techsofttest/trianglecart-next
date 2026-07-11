'use client';

import React, { useState } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Contact Us' }
    ];

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const validate = () => {
        const tempErrors: Record<string, string> = {};
        if (!formData.name.trim()) tempErrors.name = 'Full name is required';
        if (!formData.email.trim()) {
            tempErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email address is invalid';
        }
        if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
        if (!formData.message.trim()) tempErrors.message = 'Message content is required';
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                
                {/* Breadcrumbs */}
                <Breadcrumbs items={breadcrumbItems} />

                {/* Header Section */}
                <div className="mt-6 mb-12 border-b border-gray-100 pb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">Contact Us</h1>
                    <p className="text-[16px] text-gray-500 font-medium max-w-xl leading-relaxed">
                        Have a question, feedback, or need help with an order? Get in touch with our support team.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* Contact Details (col-span-5) */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Get in Touch</h2>
                            <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                Fill out the form or reach out via our direct communication channels. We aim to respond to all inquiries within 24 hours.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Email */}
                            <div className="flex gap-4">
                                <div className="p-3 bg-blue-50/50 text-[#0c4a9e] rounded-xl h-fit border border-blue-50">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Us</p>
                                    <a href="mailto:contact@10xminds.dev" className="text-sm font-semibold text-gray-900 hover:text-[#0c4a9e] hover:underline">
                                        contact@10xminds.dev
                                    </a>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex gap-4">
                                <div className="p-3 bg-blue-50/50 text-[#0c4a9e] rounded-xl h-fit border border-blue-50">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Call Support</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        +61 2 9876 5432
                                    </p>
                                    <p className="text-[12px] text-gray-400 font-medium">Mon - Sat: 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>

                            {/* Registered Office */}
                            <div className="flex gap-4">
                                <div className="p-3 bg-blue-50/50 text-[#0c4a9e] rounded-xl h-fit border border-blue-50">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Registered Office</p>
                                    <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                                        Triangle Cart Pvt Ltd
                                    </p>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                        50 Maltby CCT,<br />
                                        Wanniassa, ACT-2903,<br />
                                        Australia
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form (col-span-7) */}
                    <div className="lg:col-span-7">
                        <div className="bg-gray-50/40 p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
                            
                            {submitSuccess ? (
                                <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="inline-flex p-3 bg-green-50 text-green-600 rounded-full border border-green-100 mb-2">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-950">Thank You!</h3>
                                    <p className="text-sm text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
                                        Your message has been sent successfully. One of our support representatives will contact you shortly.
                                    </p>
                                    <div className="pt-4">
                                        <button 
                                            type="button" 
                                            onClick={() => setSubmitSuccess(false)}
                                            className="px-5 py-2 bg-white border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-gray-950">Send Us a Message</h3>
                                        <p className="text-xs text-gray-400 font-medium">Fields marked with * are required.</p>
                                    </div>

                                    {/* Name & Email Group */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="block text-[13px] font-bold text-gray-700">Full Name *</label>
                                            <input 
                                                type="text" 
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-[#0c4a9e]'}`}
                                            />
                                            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="block text-[13px] font-bold text-gray-700">Email Address *</label>
                                            <input 
                                                type="email" 
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-[#0c4a9e]'}`}
                                            />
                                            {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="block text-[13px] font-bold text-gray-700">Subject *</label>
                                        <input 
                                            type="text" 
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="e.g. Order Tracking, Delivery Issue"
                                            className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition ${errors.subject ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-[#0c4a9e]'}`}
                                        />
                                        {errors.subject && <p className="text-xs text-red-500 font-medium">{errors.subject}</p>}
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="block text-[13px] font-bold text-gray-700">Message *</label>
                                        <textarea 
                                            id="message"
                                            name="message"
                                            rows={5}
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Describe your issue or inquiry in detail..."
                                            className={`w-full px-4 py-2.5 text-sm bg-white border rounded-xl outline-none transition resize-none ${errors.message ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-[#0c4a9e]'}`}
                                        />
                                        {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message}</p>}
                                    </div>

                                    {/* Submit Button */}
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0c4a9e] text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 shadow-sm hover:shadow transition disabled:opacity-75 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Submit Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
