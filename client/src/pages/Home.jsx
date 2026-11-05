import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptForm from '../components/course/PromptForm';
import CourseCard from '../components/course/CourseCard';
import { createCourse, getCourses, deleteCourse } from '../services/api';
import { BookOpen, User, Globe, Loader2 } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import CourseDetail from './CourseDetail';

export default function Home() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('mine');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();


    const fetchCourses = async (tab = activeTab) => {
        try {
            setIsLoading(true);
            setError('');
            const res = await getCourses(tab);
            setCourses(res.data || []);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Could not connect to the backend server.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(activeTab);
    }, [activeTab, user]);

    const handleCourseCreated = async (prompt) => {
        const res = await createCourse(prompt);
        if (res.data?._id) {
            navigate(`/courses/${res.data._id}`);
        } else {
            await fetchCourses();
        }
    };

    const handleDeleteCourse = async (courseId, courseTitle) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${courseTitle}"?\n\nThis will permanently delete all moudules, lessons, and content associated with this course.`
        );
        if (!confirmed) return;

        try {
            await deleteCourse(courseId);
            setCourses((prev) => prev.filter((c) => c._id !== courseId));
        } catch (err) {
            console.error('Error deleting course: ', err);
            alert(err.response?.data?.error || 'Failed to delete course');
        }
    };

    return (
        <div className="space-y-12">
            <PromptForm onCourseCreated={handleCourseCreated} />
            <section id="courses" className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab('mine')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'mine'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                }`}
                        >
                            <User className="w-4 h-4" />
                            <span>My Courses</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === 'all'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                }`}
                        >
                            <Globe className="w-4 h-4" />
                            <span>Explore Community</span>
                        </button>
                    </div>

                    <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                        {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-3">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <p className="text-xs text-slate-400"> Loading Courses...</p>
                    </div>
                ) : error ? (
                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm">
                        {error}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 space-y-2">
                        <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-slate-300 font-semibold text-sm">
                            {activeTab === 'mine' ? 'No personal courses found' : 'No courses found yet'}
                        </p>
                        <p>
                            {activeTab === 'mine'
                                ? 'Use the prompt bar above to generate a tailored course, or switch to "Explore Community" to see shared courses.'
                                : 'Be the first to generate a course using the prompt bar above!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard
                                key={course._id}
                                course={course}
                                onDelete={handleDeleteCourse}
                            />
                        ))}
                    </div>
                )}

            </section>
        </div>
    );
}