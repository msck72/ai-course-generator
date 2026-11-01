import React from 'react';
import { BookOpen, Layers, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CourseCard({ course, onSelectCourse }) {
    const moduleCount = course.modules?.length || 0;
    const lessonCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

    return (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group">
            <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1.5 font-medium text-indigo-400">
                        <Layers className="w-3.5 h-3.5" />
                        {moduleCount} {moduleCount === 1 ? 'Module' : 'Modules'}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        {lessonCount} {lessonCount === 1 ? 'Lesson' : 'Lessons'}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {course.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {course.description}
                </p>
                {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                        {course.tags.slice(0, 3).map((tag, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                            >
                                <Tag className="w-2.5 h-2.5 text-slate-500" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                    {new Date(course.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
                <Link
                    to={`/courses/${course._id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all"
                >
                    View Syllabus <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}