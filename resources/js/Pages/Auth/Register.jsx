import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light px-4 relative overflow-hidden">
            <Head title="Sign Up" />
            
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
                    <h2 className="text-2xl font-serif font-bold text-brand-dark mb-2 text-center">Join the Family</h2>
                    <p className="text-sm text-gray-500 text-center mb-6">Create a free account to log orders and bookings</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Full Name</label>
                            <input 
                                type="text" 
                                value={data.name} 
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Abena Mensah"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                value={data.email} 
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="name@domain.com"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                value={data.password} 
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                            <input 
                                type="password" 
                                value={data.password_confirmation} 
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold transition border-gray-300`}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-brand-brown hover:bg-brand-dark text-white font-bold py-3.5 px-4 rounded-xl text-sm transition focus:outline-none focus:ring-4 focus:ring-brand-brown/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-6"
                        >
                            {processing ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="mx-4 text-xs text-gray-400 font-bold uppercase tracking-wider">Already have an account?</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="text-center">
                        <Link href="/login" className="inline-block w-full border border-brand-brown hover:bg-brand-brown/5 text-brand-brown font-bold py-3 px-4 rounded-xl text-sm transition focus:outline-none">
                            Sign In Instead
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
