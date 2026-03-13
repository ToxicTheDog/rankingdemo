import axios from 'axios';
import { TEST_TOKEN, testUser, testRankingsMe, testDashboardStats, testAffiliates } from './testData';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v2',
    timeout: 8000,
});

let isTestMode = localStorage.getItem('testMode') === 'true';

// Interceptor – automatski ulazi u test mode ako backend nije dostupan
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isNetworkError =
            !error.response ||
            error.code === 'ERR_NETWORK' ||
            error.code === 'ECONNREFUSED' ||
            error.message.includes('Network') ||
            error.message.includes('timeout');

        if (isNetworkError && !isTestMode) {
            console.warn('🚨 Backend nedostupan (VPS bez public IP) → AKTIVIRAN TEST MODE');
            isTestMode = true;
            localStorage.setItem('testMode', 'true');
            localStorage.setItem('token', TEST_TOKEN);
            localStorage.setItem('user', JSON.stringify(testUser));
        }

        return Promise.reject(error);
    }
);

// Glavna funkcija koju ćeš koristiti svuda
export const apiRequest = async (endpoint: string, method: 'get' | 'post' = 'get', data?: any) => {
    try {
        if (isTestMode) {
            return getMockResponse(endpoint);
        }

        const res = await api({ url: endpoint, method, data });
        return res.data;
    } catch {
        // fallback
        isTestMode = true;
        localStorage.setItem('testMode', 'true');
        return getMockResponse(endpoint);
    }
};

const getMockResponse = (endpoint: string) => {
    if (endpoint.includes('/auth/me') || endpoint.includes('/rankings/me')) {
        return { success: true, user: testUser, data: testRankingsMe };
    }
    if (endpoint.includes('/dashboard/stats')) {
        return { success: true, data: testDashboardStats };
    }
    if (endpoint.includes('/mentors') || endpoint.includes('/payouts')) {
        return { success: true, data: [] };
    }
    if (endpoint.includes('/affiliates')) {
        return { success: true, data: testAffiliates };
    }
    return { success: true, data: {} };
};

export default api;
export { isTestMode };