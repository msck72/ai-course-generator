import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                { }
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                            Text-to-Learn
                        </span>
                        <span className="hidden sm:inline-block text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                            AI Course Gen
                        </span>
                    </div>
                </div>
                { }
                <nav className="flex items-center gap-2 sm:gap-3">
                    <a
                        href="/"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Generate</span>
                    </a>
                    <a
                        href="#courses"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>My Courses</span>
                    </a>
                </nav>
            </div>
        </header>
    );
}