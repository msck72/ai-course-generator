import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLessonById, getCourseById, enrichLesson } from '../services/api';
import LessonRenderer from '../components/LessonRenderer';
import { ArrowLeft, Sparkles, Target, CheckCircle2, Loader2, ChevronLeft, ChevronRight, Layers, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import HinglishAudioPlayer from '../components/HinglishAudioPlayer';
import PDFExportButton from '../components/PDFExportButton';
import CurriculamSidebar from '../components/course/CurriculamSidebar';

export default function LessonView() {
    const { courseId, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isEnriching, setIsEnriching] = useState(false);
    const [error, setError] = useState('');

    const fetchLessonAndCourse = async () => {
        try {
            setIsLoading(true);
            setError('');

            const [lessonRes, courseRes] = await Promise.all([
                getLessonById(lessonId),
                getCourseById(courseId),
            ]);
            setLesson(lessonRes.data);
            setCourse(courseRes.data);
        } catch (err) {
            console.error('Error fetching lesson: ', err);
            setError('Failed to load lesson details');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (courseId && lessonId) {
            fetchLessonAndCourse();
            window.scrollTo({ top: 0, behaviour: 'smooth' });
        }
    }, [courseId, lessonId]);

    const handleEnrich = async () => {
        try {
            setIsEnriching(true);
            setError('');
            const res = await enrichLesson(lessonId);
            setLesson(res.data);

            const courseRes = await getCourseById(courseId);
            setCourse(courseRes.data);
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

    const allLessons = course?.modules?.flatMap((m) => m.lessons) || [];
    const currentIndex = allLessons.findIndex((l) => (l._id || l) === lessonId);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    const currentModule = course?.modules?.find((m) =>
        m.lessons?.some((l) => (l._id || l) === lessonId)
    );

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
        <div className="flex gap-8 items-start relative">
            <CurriculamSidebar
                course={course}
                currentLessonId={lessonId}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 min-w-0 max-w-3xl mx-auto space-y-8">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
                            title={isSidebarOpen ? 'Collabse syllabus' : 'Expand Syllabus'}
                        >
                            {isSidebarOpen ? (
                                <PanelLeftClose className="w-4 h-4 text-indigo-400" />
                            ) : (
                                <PanelLeftOpen className="w-4 h-4 text-indigo-400" />
                            )}
                            <span className="hidden sm:inline">
                                {isSidebarOpen ? 'Hide Syllabus' : 'Show Syllabus'}
                            </span>
                        </button>

                        <Link
                            to={`/courses/${courseId}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Course Syllabus
                        </Link>
                    </div>

                    {lesson?.isEnriched && (
                        <PDFExportButton targetId="lesson-pdf-content" lessonTitle={lesson.title} />
                    )}
                </div>

                {!lesson.isEnriched ? (
                    <>
                        <div className="space-y-4 pb-6 border-b border-slate-800">
                            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-100 tracking-tight">
                                {lesson.title}
                            </h1>
                        </div>
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
                                    <p className="font-semibold mb-0.5"> Generation Failed</p>
                                    <p className="text-red-400 text-xs">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleEnrich}
                                disabled={isEnriching}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
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
                    </>
                ) : (
                    <div id="lesson-pdf-content" className="space-y-6">
                        <div className="space-y-4 pb-6 border-b border-slate-800">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                {course?.title && (
                                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                                        {course.title}
                                    </span>
                                )}
                                {currentModule?.title && (
                                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                                        {currentModule.title}
                                    </span>
                                )}
                            </div>
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
                        <div className="no-pdf">
                            <HinglishAudioPlayer
                                lessonId={lesson._id || lessonId}
                                title={lesson.title}
                                content={lesson.content}
                            />
                        </div>
                        <LessonRenderer content={lesson.content} />
                    </div>
                )}
                <div className="pt-8 border-t border-slate-800 flex justify-between items-center flex-col sm:flex-row items-center justify-between gap-4">

                    {prevLesson ? (
                        <Link
                            to={`/courses/${courseId}/lessons/${prevLesson._id}`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all group"
                        >
                            <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
                            <span className="truncate max-w-[200px]">Previous: {prevLesson.title}</span>
                        </Link>
                    ) : (
                        <div className="hidden sm:block" />
                    )}

                    <Link
                        to={`/courses/${courseId}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors order-last sm:order-none"
                    >
                        <Layers className="w-3.5 h-3.5" /> Return to Syllabus
                    </Link>

                    {nextLesson ? (
                        <Link
                            to={`/courses/${courseId}/lessons/${nextLesson._id}`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors group"
                        >
                            <span className="truncate max-w-[200px]">Next: {nextLesson.title}</span>
                            <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    ) : (
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                            Course Completed!
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}