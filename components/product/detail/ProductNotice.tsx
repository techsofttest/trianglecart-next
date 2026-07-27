'use client';

import React from 'react';

export default function ProductNotice() {
    return (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">
                Actual product packaging and materials may contain more and different information than what is shown on our website. We recommend that you do not rely solely on the information presented and that you always read labels, warnings and directions before using or consuming a product
            </p>
        </div>
    );
}
