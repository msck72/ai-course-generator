import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLessonById, enrichLesson } from '../services/api';
import LessonRenderer from '../components/LessonRenderer';
import { ArrowLeft, Sparkles, Target, CheckCircle2, Loader2 } from 'lucide-react';

export default function LessonView() {
    const { courseId, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnriching, setIsEnriching] = useState(false);
    const [error, setError] = useState('');

    const fetchLesson = async () => {
        try {
            setIsLoading(true);
            const res = await getLessonById(lessonId);
            setLesson(res.data);
        } catch (err) {
            console.error('Error fetching lesson: ', err);
            setError('Failed to load lesson details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (lessonId) {
            fetchLesson();
        }
    }, [lessonId]);

    const handleEnrich = async () => {
        try {
            setIsEnriching(true);
            setError('');
            const res = await enrichLesson(lessonId);
            setLesson(res.data);
        } catch (err) {
            console.error('Error enriching lesson:', err);
            const errMsg = err.response?.data?.error || err.message;
            if (errMsg.includes('429') || errMsg.includes('exhausted') || errMsg.includes('Quota')) {
                setError('Gemini API free quota exceeded. Please wait 1 minute for the rate limit to reset, or provide a new API key.');
            } else {
                setError(errMsg || 'Failed to enrich lesson.');
            }
        } finally {
            setIsEnriching(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="mt-4 text-sm text-slate-400">Loading lesson...</p>
            </div>
        );
    }
    if (error && !lesson) {
        return (
            <div className="py-12 text-center">
                <p className="text-red-400">{error}</p>
                <Link
                    to={`/courses/${courseId}`}
                    className="inline-flex items-center gap-2 mt-4 text-sm text-indigo-400 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Syllabus
                </Link>
            </div>
        );
    }
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <Link
                    to={`/courses/${courseId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Course Syllabus
                </Link>
            </div>
            <div className="space-y-4 pb-6 border-b border-slate-800">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                    {lesson.title}
                </h1>
                {lesson.objectives && lesson.objectives.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <Target className="w-3.5 h-3.5" /> Learning Objectives
                        </span>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                            {lesson.objectives.map((obj, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{obj}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {!lesson.isEnriched ? (
                <div className="text-center py-12 px-6 rounded-3xl bg-slate-900/60 border border-dashed border-slate-800 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-100">Ready to Generate Content</h3>
                        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                            This lesson outline is ready. Click below to have Gemini generate comprehensive explanations, syntax-highlighted code, and interactive quizzes!
                        </p>
                    </div>

                    {error && (
                        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs sm:text-sm max-w-md mx-auto text-left">
                            <p className="font-semibold mb-0.5">⚠️ Generation Failed</p>
                            <p className="text-red-400 text-xs">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleEnrich}
                        disabled={isEnriching}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {isEnriching ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Generating Lesson Content...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Generate Rich Lesson Content</span>
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <LessonRenderer content={lesson.content} />
                </div>
            )}
            <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
                <Link
                    to={`/courses/${courseId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Return to Syllabus
                </Link>
            </div>
        </div>
    );
}