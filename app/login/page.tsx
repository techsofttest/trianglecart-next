import { Suspense } from 'react';
import AuthCard from '@/components/auth/AuthCard';

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center py-10 px-4">
            {/* The Reusable Component */}
            <Suspense fallback={<div className="text-sm text-gray-500">Loading...</div>}>
                <AuthCard />
            </Suspense>
        </div>
    );
}