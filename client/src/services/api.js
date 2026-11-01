import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createCourse = async (prompt) => {
    const response = await api.post('/courses/generate', { prompt });
    return response.data;
};

export const getCourses = async () => {
    const response = await api.get('/courses');
    return response.data;
};

export const getCourseById = async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
};

export const enrichLesson = async (lessonId) => {
    const response = await api.post(`/courses/lessons/${lessonId}/enrich`);
    return response.data;
};

export const getLessonById = async (lessonId) => {
    const response = await api.get(`/courses/lessons/${lessonId}`);
    return response.data;
}

export const searchYoutube = async (query) => {
    const response = await api.get(`/media/youtube?q=${encodeURIComponent(query)}`);
    return response.data;
}

export default api;

