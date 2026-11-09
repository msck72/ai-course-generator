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
            <div className="min-h-[65vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md p-8 sm-p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-6 shadow-xl">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                        <Lock className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-medium tracking-[-0.035em] text-slate-100 leading-tight">
                            Sign in to Text-to-Learn
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                            Turn any topic into structured courses with interactive quizzes, YouTube tutorials, and audio narration.
                        </p>
                    </div>
                    <button
                        onClick={() => loginWithRedirect()}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer shadow-sm"
                    >
                        <span>Continue to Log In / Sign Up</span>
                    </button>
                </div>
            </div>
        );
    }
    return children;
}
