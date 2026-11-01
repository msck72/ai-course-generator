import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function MCQBlock({ block }) {
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleSelect = (idx) => {
        if (isAnswered) {
            setSelectedIdx(idx);
            setIsAnswered(true);
        }
    };

    const handleReset = () => {
        setSelectedIdx(null);
        setIsAnswered(false);
    };

    const isCorrect = selectedIdx == block.answer;

    return (
        <div className="my-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    <span>Interactive Quiz</span>
                </div>
                {isAnswered && (
                    <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-3 h-3" /> Retry
                    </button>
                )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-5 leading-snug">
                {block.question}
            </h3>
            <div className="space-y-2.5">
                {block.options?.map((option, idx) => {
                    let style =
                        'border-slate-800 bg-slate-950/40 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300';
                    let icon = null;
                    if (isAnswered) {
                        if (idx === block.answer) {
                            style = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-medium';
                            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
                        } else if (idx === selectedIdx) {
                            style = 'border-red-500/80 bg-red-950/40 text-red-200 font-medium';
                            icon = <XCircle className="w-4 h-4 text-red-400 shrink-0" />;
                        } else {
                            style = 'border-slate-800/50 bg-slate-950/20 text-slate-500 opacity-50';
                        }
                    }
                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={isAnswered}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer disabled:cursor-default ${style}`}
                        >
                            <span>{option}</span>
                            {icon}
                        </button>
                    );
                })}
            </div>
            {isAnswered && (
                <div
                    className={`mt-5 p-4 rounded-xl border text-xs sm:text-sm animate-fadeIn ${isCorrect
                        ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                        : 'bg-amber-950/30 border-amber-800/50 text-amber-300'
                        }`}
                >
                    <p className="font-bold mb-1">
                        {isCorrect ? '🎉 Correct!' : '💡 Explanation:'}
                    </p>
                    <p className="text-slate-300 leading-relaxed">{block.explanation}</p>
                </div>
            )}
        </div>
    );
}