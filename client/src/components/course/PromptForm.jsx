import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

const SUGGESTIONS = [
    'Python for Beginners',
    'Docker & Containerization Masterclass',
    'System Design Fundamentals',
    'Rust Concurrency & Memory Safety',
];

export default function PromptForm({ onCourseCreated }) {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingStep, setLoadingStep] = useState(0);

    const loadingMessages = [
        'Consulting Gemini curriculum architect...',
        'Structuring modules and lesson outlines...',
        'Calibrating learning objectives...',
        'Saving curriculum to MongoDB...',
    ];

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setError('');
        setIsLoading(true);
        setLoadingStep(0);

        const interval = setInterval(() => {
            setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
        }, 2500);

        try {
            await onCourseCreated(prompt.trim());
            setPrompt('');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Failed to generate course.');
        } finally {
            clearInterval(interval);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full text-center py-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Curriculum Generation
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
                Turn Any Topic into a{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                    Comprehensive Course
                </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
                Type whatever you want to master. Gemini structures modules, lessons, code examples, and interactive quizzes in seconds.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 relative max-w-2xl mx-auto">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                        placeholder="e.g. Master React Server Components or Kubernetes 101..."
                        className="w-full pl-5 pr-36 py-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-slate-100 placeholder-slate-500 shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm sm:text-base disabled:opacity-60"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !prompt.trim()}
                        className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Designing...</span>
                            </>
                        ) : (
                            <>
                                <span>Generate</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
                {isLoading && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-indigo-400 animate-pulse">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{loadingMessages[loadingStep]}</span>
                    </div>
                )}
                {error && (
                    <div className="mt-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs text-left">
                        {error}
                    </div>
                )}
            </form>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Try:</span>
                {SUGGESTIONS.map((sug, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setPrompt(sug)}
                        disabled={isLoading}
                        className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        {sug}
                    </button>
                ))}
            </div>
        </div>
    );
}
