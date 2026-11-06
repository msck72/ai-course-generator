import React from 'react';
import { Sparkles, BookOpen, LogIn, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider';

export default function Navbar() {

    const { isAuthenticated, isLoading, user, loginWithRedirect, logout, isConfigured } = useAuth();

    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="font-bold text-lg text-slate-100 tracking-tight">
                            Text-to-Learn
                        </span>
                        <span className="hidden sm:inline-block text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                            AI Course Gen
                        </span>
                    </div>
                </Link>
                <nav className="flex items-center gap-2 sm:gap-3">
                    <Link
                        to="/#generate"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <Sparkles className="w-4 h-4 text-slate-400" />
                        <span>Generate</span>
                    </Link>
                    <Link
                        to="/#courses"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>My Courses</span>
                    </Link>

                    <div className="h-5 w-[1px] bg-slate-800 mx-1 hidden sm:block" />
                    {isLoading ? (
                        <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse" />
                    ) : isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700">
                                {user?.picture ? (
                                    <img
                                        src={user.picture}
                                        alt={user.name || 'User'}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-indigo-600/40 text-indigo-300 flex items-center justify-center text-xs">
                                        <User className="w-3.5 h-3.5" />
                                    </div>
                                )}
                                <span className="text-xs font-medium text-slate-200 hidden md:inline-block max-w-[120px] truncate">
                                    {user?.name || user?.email}
                                </span>
                            </div>
                            <button
                                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-900/40 transition-all cursor-pointer"
                                title="Log Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => loginWithRedirect()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-sm"
                        >
                            <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Log In</span>
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}