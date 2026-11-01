import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptForm from '../components/course/PromptForm';
import CourseCard from '../components/course/CourseCard';
import { createCourse, getCourses } from '../services/api';
import { BookOpen } from 'lucide-react';

export default function Home() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const res = await getCourses();
            setCourses(res.data || []);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Could not connect to the backend server.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCourseCreated = async (prompt) => {
        const res = await createCourse(prompt);
        if (res.data?._id) {
            navigate(`/courses/${res.data._id}`);
        } else {
            await fetchCourses();
        }
    };

    return (
        <div className="space-y-12">
            <PromptForm onCourseCreated={handleCourseCreated} />
            <section id="courses" className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-xl font-bold text-slate-100">All Generated Courses</h2>
                    </div>
                    <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                        {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
                    </span>
                </div>
                {error ? (
                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm">
                        {error}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
                        <p className="text-slate-400 text-sm">No courses found yet.</p>
                        <p className="text-xs text-slate-500 mt-1">Use the prompt bar above to generate your first AI course!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}