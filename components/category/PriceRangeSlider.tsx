'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface PriceRangeSliderProps {
    min: number;
    max: number;
    step: number;
    value: { min: number; max: number };
    onChange: (values: { min: number; max: number }) => void;
}

export default function PriceRangeSlider({ min, max, step, value, onChange }: PriceRangeSliderProps) {
    const [minVal, setMinVal] = useState(value.min);
    const [maxVal, setMaxVal] = useState(value.max);
    const minValRef = useRef(value.min);
    const maxValRef = useRef(value.max);
    const range = useRef<HTMLDivElement>(null);

    // Convert value to percentage for precise track coloring
    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Sync internal slider state when parent values change
    useEffect(() => {
        setMinVal(value.min);
        minValRef.current = value.min;
        setMaxVal(value.max);
        maxValRef.current = value.max;
    }, [value.min, value.max]);

    // Update active track visuals when Min changes
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // Update active track visuals when Max changes
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Pass data up to parent
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    // Formatter for price
    const formatPrice = (value: number) => {
        return `$${value.toLocaleString()}`;
    };

    return (
        <div className="flex flex-col gap-3 py-2 w-full">
            {/* Value Display */}
            <div className="text-sm md:text-base font-bold text-gray-900 tracking-tight">
                {formatPrice(minVal)} — {formatPrice(maxVal)}{maxVal === max ? '+' : ''}
            </div>

            {/* Slider Container - Removed overflow-hidden */}
            <div className="relative w-full h-6 flex items-center">

                {/* 1. Background Track (Gray) */}
                <div className="absolute w-full h-1.5 bg-gray-200 rounded-full z-0" />

                {/* 2. Active Range Track (Brand Blue) */}
                <div ref={range} className="absolute h-1.5 bg-[#0c4a9e] rounded-full z-10" />

                {/* 3. Min Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    step={step}
                    onChange={(event) => {
                        const value = Math.min(Number(event.target.value), maxVal - step);
                        setMinVal(value);
                        minValRef.current = value;
                    }}
                    className="thumb z-20"
                    style={{ zIndex: minVal > max - 100 ? 30 : 20 }}
                />

                {/* 4. Max Input */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    step={step}
                    onChange={(event) => {
                        const value = Math.max(Number(event.target.value), minVal + step);
                        setMaxVal(value);
                        maxValRef.current = value;
                    }}
                    className="thumb z-30"
                />
            </div>

            <style jsx>{`
                /* Make the raw inputs invisible but span the whole width */
                .thumb {
                    position: absolute;
                    width: 100%;
                    height: 0;
                    outline: none;
                    pointer-events: none;
                    -webkit-appearance: none;
                    -webkit-tap-highlight-color: transparent;
                }

                /* Style the actual grabber (thumb) for Webkit (Chrome/Safari) */
                .thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: #ffffff;
                    border: 3px solid #0c4a9e; /* Triangle Cart Blue */
                    border-radius: 50%;
                    cursor: pointer;
                    /* Re-enable pointer events ONLY on the thumb */
                    pointer-events: all; 
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }

                /* Style the actual grabber (thumb) for Mozilla (Firefox) */
                .thumb::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    background: #ffffff;
                    border: 3px solid #0c4a9e;
                    border-radius: 50%;
                    cursor: pointer;
                    pointer-events: all;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }

                /* Optional hover states for better UX */
                .thumb::-webkit-slider-thumb:hover {
                    box-shadow: 0 0 0 4px rgba(12, 74, 158, 0.1);
                }
                .thumb::-moz-range-thumb:hover {
                    box-shadow: 0 0 0 4px rgba(12, 74, 158, 0.1);
                }
            `}</style>
        </div>
    );
}