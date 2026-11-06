import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function MCQBlock({ block }) {
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleSelect = (idx) => {
        if (!isAnswered) {
            setSelectedIdx(idx);
            setIsAnswered(true);
        }
    };

    const handleReset = () => {
        setSelectedIdx(null);
        setIsAnswered(false);
    };

    const correctAnswerIdx = Number(block.answer);
    const isCorrect = selectedIdx !== null && selectedIdx === correctAnswerIdx;

    return (
        <div className="my-8 rounded-2xl bg-slate-900/60 border border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    <span>Quick Quiz</span>
                </div>
                {isAnswered && (
                    <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" /> Retry
                    </button>
                )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-5 leading-snug">
                {block.question}
            </h3>
            <div className="space-y-2.5">
                {block.options?.map((option, idx) => {
                    let optionStyle =
                        'border-slate-800 bg-slate-900/80 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200';
                    let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';
                    let icon = null;

                    if (isAnswered) {
                        if (idx === correctAnswerIdx) {
                            optionStyle = 'border-emerald-500/80 bg-emerald-950/40 text-emerald-200 font-medium';
                            badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
                        } else if (idx === selectedIdx) {
                            optionStyle = 'border-rose-500/80 bg-rose-950/40 text-rose-200 font-medium';
                            badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                            icon = <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
                        } else {
                            optionStyle = 'border-slate-800/40 bg-slate-950/30 text-slate-500 opacity-40';
                            badgeStyle = 'bg-slate-900 text-slate-600 border-slate-800';
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={isAnswered}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm cursor-pointer disabled:cursor-default ${optionStyle}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-mono font-semibold shrink-0 ${badgeStyle}`}>
                                    {OPTION_LABELS[idx] || idx + 1}
                                </span>
                                <span>{option}</span>
                            </div>
                            {icon}
                        </button>
                    );
                })}
            </div>
            {isAnswered && (
                <div
                    className={`mt-5 p-4 rounded-xl border text-xs sm:text-sm transition-all ${
                        isCorrect
                            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                >
                    <p className={`font-semibold mb-1 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {isCorrect ? 'Correct! Great job.' : 'Not quite right.'}
                    </p>
                    <p className="text-slate-300 leading-relaxed">{block.explanation}</p>
                </div>
            )}
        </div>
    );
}