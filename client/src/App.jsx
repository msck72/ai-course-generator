import React, { useState, useEffect } from 'react';
import { getCourses, createCourse } from './services/api';

export default function App() {
  const [courses, setCourses] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCourses = async () => {
    try {
      setError('');
      const res = await getCourses();
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to backend server');
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    try {
      setLoading(true);
      setError('');

      await createCourse(prompt.trim());
      setPrompt('');

      await loadCourses();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1> Text-to-Learn: Course Generator</h1>
      { }
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a topic (e.g. Learn Python for Beginners)"
          disabled={loading}
          style={{ width: '70%', padding: '0.6rem', fontSize: '1rem', marginRight: '0.5rem' }}
        />
        <button type="submit" disabled={loading || !prompt.trim()} style={{ padding: '0.6rem 1.2rem', fontSize: '1rem' }}>
          {loading ? 'Generating with Gemini...' : 'Generate Course'}
        </button>
      </form>
      { }
      {loading && <p style={{ color: 'blue' }}>⏳ Please wait... Gemini is structuring modules and lessons...</p>}
      {error && <p style={{ color: 'red' }}> {error}</p>}
      { }
      <h2>Generated Courses ({courses.length})</h2>
      {courses.length === 0 ? (
        <p>No courses yet. Type a topic above to generate one!</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course._id} style={{ marginBottom: '1.5rem' }}>
              <strong>{course.title}</strong>
              <p style={{ color: '#555', margin: '0.3rem 0' }}>{course.description}</p>
              <small>Modules: {course.modules?.length || 0}</small>
              <ul>
                {course.modules?.map((mod, idx) => (
                  <li key={mod._id || idx}>
                    {mod.title} ({mod.lessons?.length || 0} lessons)
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}