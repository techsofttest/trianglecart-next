'use client';

import React from 'react';

import { Truck, RotateCcw } from "lucide-react";

interface ProductInfoProps {
    brand: string;
    title: string;
    rating: number;
    reviews: number;
    price: number;
    originalPrice: number;
    discount: string;
}

export default function ProductInfo({ brand, title, rating, reviews, price, originalPrice, discount }: ProductInfoProps) {
    return (
        <div className="space-y-4">
            <div>
                <span className="text-[13px] font-semibold text-[#0c4a9e] uppercase tracking-[0.15em] mb-1.5 block">
                  Brand : {brand}
                </span>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight tracking-tight mb-1">
                    {title}
                </h3>

                <div className="flex items-center flex-wrap gap-3">
                    <span className="text-2xl font-semibold text-gray-900 tracking-tight">$ {price}</span>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                        In Stock
                    </span>
                </div>



                <div className="mt-4 space-y-4 border-t border-gray-200 pt-5">

                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50">
                            <Truck className="h-5 w-5 text-[#0c4a9e]" />
                        </div>

                        <div>
                           
                            <p className="mt-1 text-sm leading-4 text-gray-600">
                                <b>Free same day delivery :</b> In Canberra provided the selected
                                delivery slot is available. Regional and interstate orders
                                are delivered via courier. Questions? Simply ask.
                            </p>
                            
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50">
                            <RotateCcw className="h-5 w-5 text-green-700" />
                        </div>

                        <div>
                           
                            <p className="mt-1 text-sm leading-4 text-gray-600">
                                <b>Free Returns :</b>You may return most new, unopened items within 10 days of
                                delivery for a full refund. We'll also cover the return
                                shipping costs if the return is due to our error, such as
                                receiving an incorrect or defective item.
                            </p>

                        </div>
                    </div>

                </div>



            </div>
        </div>
    );
}
