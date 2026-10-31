import React, { useState, useEffect } from 'react';
import { getCourses, createCourse } from './services/api';
import Navbar from './components/common/Navbar';
import PromptForm from './components/course/PromptForm';
import CourseCard from './components/course/CourseCard';
import { BookOpen } from 'lucide-react';

export default function App() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const loadCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data || []);
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCourseCreated = async (prompt) => {
    await createCourse(prompt);
    await loadCourses();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
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
          {courses.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
              <p className="text-slate-400 text-sm">No courses found yet.</p>
              <p className="text-xs text-slate-500 mt-1">Use the prompt bar above to generate your first AI course!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onSelectCourse={(c) => setSelectedCourse(c)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}