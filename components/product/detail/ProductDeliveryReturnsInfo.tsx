'use client';

import React from 'react';
import { Truck, BadgeDollarSign } from "lucide-react";

export default function ProductDeliveryReturnsInfo() {
    return (
        <div className="space-y-3 border-t border-gray-200 pt-4">
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
                    <BadgeDollarSign className="h-5 w-5 text-green-700" />
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
    );
}
