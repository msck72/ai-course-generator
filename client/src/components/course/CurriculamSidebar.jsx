import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, CheckCircle2, Circle, PanelLeftClose } from 'lucide-react';

export default function CurriculumSidebar({ course, currentLessonId, isOpen, onToggle, onClose }) {
    if (!course) return null;

    return (
        <>
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-30 lg:hidden"
                />
            )}

            <aside
                className={`fixed lg:sticky lg:top-24 top-0 left-0 h-full lg:h-[calc(100vh-8rem)] z-40
                    bg-slate-900/95 lg:bg-slate-900/80 backdrop-blur-md border-r lg:border border-slate-800 lg:rounded-3xl
                    flex flex-col justify-between shrink-0 overflow-hidden shadow-xl
                    transition-all duration-300 ease-in-out
                    ${isOpen
                        ? 'w-72 sm:w-80 p-5 opacity-100 translate-x-0'
                        : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0 p-0 border-none opacity-0 pointer-events-none'
                    }
                `}
            >
                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-6rem)] pr-1">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-indigo-400" />
                            <h3 className="font-bold text-sm text-slate-100 line-clamp-1">
                                {course.title}
                            </h3>
                        </div>

                        <button
                            onClick={onToggle}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
                            title="Collapse Syllabus sidebar"
                        >
                            <PanelLeftClose className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {course.modules?.map((module, mIdx) => (
                            <div key={module._id || mIdx} className="space-y-2">
                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                    Module {mIdx + 1}: {module.title}
                                </span>
                                <div className="space-y-1">
                                    {module.lessons?.map((item, lIdx) => {
                                        const isActive = item._id === currentLessonId;
                                        return (
                                            <Link
                                                key={item._id || lIdx}
                                                to={`/courses/${course._id}/lessons/${item._id}`}
                                                onClick={onClose}
                                                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${isActive
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 line-clamp-1">
                                                    {item.isEnriched ? (
                                                        <CheckCircle2
                                                            className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'
                                                                }`}
                                                        />
                                                    ) : (
                                                        <Circle
                                                            className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white/70' : 'text-slate-600'
                                                                }`}
                                                        />
                                                    )}
                                                    <span className="truncate">{item.title}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800/80">
                    <Link
                        to={`/courses/${course._id}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors block text-center"
                    >
                        View Full Course Syllabus →
                    </Link>
                </div>
            </aside>
        </>
    );
}
