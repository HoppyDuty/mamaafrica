import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light px-4 relative overflow-hidden">
            <Head title="Login" />
            
            {/* Background design accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-gold/10 blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-brown/10 blur-3xl"></div>

            <div className="w-full max-w-md z-10">
                {/* Brand Logo Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="font-serif font-bold text-4xl text-brand-brown tracking-wide hover:opacity-90 transition">
                        Mama Africa
                    </Link>
                    <p className="text-gray-500 mt-2 font-medium">Beauty, Fashion & Premium Care</p>
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 md:p-10">
                    <h2 className="text-2xl font-serif font-bold text-brand-dark mb-2 text-center">Welcome Back</h2>
                    <p className="text-sm text-gray-500 text-center mb-6">Sign in to manage bookings or orders</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Address */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                            <input 
                                type="email" 
                                value={data.email} 
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="name@domain.com"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full px-4 py-3 pr-11 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-brand-brown"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                                <input 
                                    type="checkbox" 
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-brand-gold focus:ring-brand-gold focus:ring-opacity-50"
                                />
                                Remember me
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-brand-brown hover:bg-brand-dark text-white font-bold py-3.5 px-4 rounded-xl text-sm transition focus:outline-none focus:ring-4 focus:ring-brand-brown/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            {processing ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="mx-4 text-xs font-semibold text-gray-400">New to Mama Africa?</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="text-center">
                        <Link href="/register" className="inline-block w-full border border-brand-brown hover:bg-brand-brown/5 text-brand-brown font-bold py-3 px-4 rounded-xl text-sm transition focus:outline-none">
                            Create a Free Account
                        </Link>
                    </div>
                </div>

                {/* Back Link */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-brand-brown hover:text-brand-gold font-semibold text-sm transition flex items-center justify-center gap-1">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
