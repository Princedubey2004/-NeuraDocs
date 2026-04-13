import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Mail, Lock, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { email, password });
            setAuth(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side: Form */}
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-xl shadow-indigo-100">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="mt-8 text-3xl font-black tracking-tight text-gray-900">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium">Log in to continue to your collaborative documents.</p>
                    </div>

                    <div className="mt-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in fade-in zoom-in duration-300">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-11 pr-4 rounded-xl border-gray-100 py-3.5 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 border transition-all placeholder:text-gray-300 bg-gray-50/30"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-11 pr-12 rounded-xl border-gray-100 py-3.5 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 border transition-all placeholder:text-gray-300 bg-gray-50/30"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="relative flex w-full justify-center rounded-xl bg-black py-4 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-gray-200 hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 group"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500 font-medium">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors decoration-2 underline-offset-4 hover:underline">
                                    Create one free
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Visual Branding */}
            <div className="relative hidden w-0 flex-1 lg:block overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-black">
                    {/* Abstract Shapes */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-[96px] animate-bounce [animation-duration:8s]" />
                    
                    <div className="flex h-full flex-col items-center justify-center px-20 text-center relative z-10">
                        <div className="mb-10 rounded-3xl bg-white/5 p-8 backdrop-blur-3xl border border-white/10 shadow-2xl">
                            <Sparkles className="h-12 w-12 text-white mb-6 mx-auto" />
                            <h3 className="text-4xl font-black text-white leading-tight mb-4">The future of collaborative writing is here.</h3>
                            <p className="text-indigo-100 text-lg font-medium opacity-80">Experience real-time sync, AI assistance, and seamless presence in one powerful editor.</p>
                        </div>
                        
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-2 w-2 rounded-full bg-white/20" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
