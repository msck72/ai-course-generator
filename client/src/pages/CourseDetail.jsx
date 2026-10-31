import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById } from '../services/api';
import { ArrowLeft, BookOpen, Layers, CheckCircle2, Circle, ChevronRight, Tag, Loader2 } from 'lucide-react';

export default function CourseDetail() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setIsLoading(true);
                const res = await getCourseById(courseId);
                setCourse(res.data);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load course details.');
            } finally {
                setIsLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="mt-4 text-sm text-slate-400">Loading course curriculum...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="py-12 text-center">
                <p className="text-red-400">{error || 'Course not found.'}</p>
                <Link to="/" className="inline-flex items-center gap-2 mt-4 text-sm text-indigo-400 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </div>
        );
    }


    const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    const enrichedLessons = course.modules?.reduce(
        (acc, m) => acc + (m.lessons?.filter((l) => l.isEnriched)?.length || 0), 0
    );
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to all courses
                </Link>
            </div>
            <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center gap-2">
                    {course.tags?.map((tag, idx) => (
                        <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-800/50"
                        >
                            <Tag className="w-3 h-3 text-indigo-400" />
                            {tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                    {course.title}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                    {course.description}
                </p>
                <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                    <span className="flex items-center gap-1.5 font-medium text-slate-300">
                        <Layers className="w-4 h-4 text-indigo-400" />
                        {course.modules?.length || 0} Modules
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-300">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        {totalLessons} Total Lessons
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        {enrichedLessons} / {totalLessons} Lessons Ready
                    </span>
                </div>
            </div>
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    Course Curriculum
                </h2>
                <div className="space-y-4">
                    {course.modules?.map((module, mIdx) => (
                        <div
                            key={module._id || mIdx}
                            className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-lg"
                        >
                            <div className="px-6 py-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold flex items-center justify-center">
                                        {mIdx + 1}
                                    </span>
                                    <h3 className="font-semibold text-slate-200 text-sm sm:text-base">
                                        {module.title}
                                    </h3>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">
                                    {module.lessons?.length || 0} lessons
                                </span>
                            </div>
                            <div className="divide-y divide-slate-800/50">
                                {module.lessons?.map((lesson, lIdx) => (
                                    <div
                                        key={lesson._id || lIdx}
                                        className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-800/30 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            {lesson.isEnriched ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            ) : (
                                                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                                            )}
                                            <p className="text-sm font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                                                {lesson.title}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {lesson.isEnriched ? (
                                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Enriched
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                                    Ready to Learn
                                                </span>
                                            )}
                                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}