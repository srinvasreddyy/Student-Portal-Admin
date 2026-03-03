import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const API_BASE_URL = 'http://localhost:5000';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add access token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Refresh token logic
const refreshAuthLogic = (failedRequest) =>
    axios
        .post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: localStorage.getItem('refreshToken'),
        })
        .then((tokenRefreshResponse) => {
            const { accessToken, refreshToken } = tokenRefreshResponse.data.tokens;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;
            return Promise.resolve();
        })
        .catch((err) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/';
            return Promise.reject(err);
        });

createAuthRefreshInterceptor(api, refreshAuthLogic);

export const authApi = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
    verifyEmail: (data) => api.post('/auth/verify-email', data)
};

export const projectApi = {
    create: (data) => api.post('/projects', data),
    updateMedia: (id, data) => api.patch(`/projects/${id}/media`, data), // ADD THIS LINE
    uploadDocument: (formData) => api.post('/projects/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    downloadDocument: (fileId) => api.get(`/projects/document/${fileId}`, { responseType: 'blob' }),
    getOne: (id) => api.get(`/projects/${id}`),
    acceptStudent: (id, studentRef) => api.post(`/projects/${id}/accept`, { studentRef }),
    removeStudent: (id, studentRef) => api.post(`/projects/${id}/remove`, { studentRef }),
    rejectApplicant: (id, studentRef, reason) => api.post(`/projects/${id}/reject`, { studentRef, reason }),
    completeProject: (id, data = {}) => api.post(`/projects/${id}/complete`, data),
    cancelProject: (id) => api.delete(`/projects/${id}`),
    getMyProjects: () => api.get('/projects/me')
};

export const studentApi = {
    getPublicProfile: (userId) => api.get(`/students/${userId}/public`)
};

export const companyApi = {
    searchUk: (data) => api.post('/api/company/search-uk', data),
    getGlobalList: (q) => api.get('/api/company/global-list', { params: { q } }),
    verifyDomain: (data) => api.post('/api/company/verify-domain', data),
    register: (data) => api.post('/api/company/register', data)
};

export const universityApi = {
    searchUk: () => api.get('/api/university/search-uk'),
    getGlobalList: (q) => api.get('/api/university/global-list', { params: { q } }),
    verifyDomain: (data) => api.post('/api/university/verify-domain', data),
    register: (data) => api.post('/api/university/register', data)
};

export const adminApi = {
    searchPortfolios: (params, page = 1, limit = 12) => api.get('/admin/portfolios/search', { params: { ...params, page, limit } }),
    searchStudents: (params, page = 1, limit = 12) => api.get('/admin/students/search', { params: { ...params, page, limit } }),
    sendRecruitmentEmail: (data) => api.post('/admin/recruitment/send-email', data),
    getStudentProfile: (userId) => api.get(`/students/${userId}/profile`),
    getStudentPortfolio: (userId) => api.get(`/students/${userId}/portfolio`),
};

export const notificationApi = {
    getNotifications: (params) => api.get('/api/notifications', { params }),
    markAsRead: (data) => api.post('/api/notifications/mark-read', data)
};

export default api;