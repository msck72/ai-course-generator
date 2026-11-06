import React from 'react';
import { useAuth } from './AuthProvider';
import { Loader2, Lock, Sparkles } from 'lucide-react';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading, loginWithRedirect, isConfigured } = useAuth();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-sm text-slate-400">Verifying session...</p>
            </div>
        );
    }

    if (isConfigured && !isAuthenticated) {
        return (
            <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-6 shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-100">
                        Sign In Required
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Please sign in to generate AI courses, access the syllabus, and start interactive learning.
                    </p>
                </div>
                <button
                    onClick={() => loginWithRedirect()}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>Log In / Sign Up</span>
                </button>
            </div>
        );
    }
    return children;
}
