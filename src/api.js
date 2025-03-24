import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/appleUniformm';

export const fetchDepartments = async () => {
    const response = await axios.get(`${API_BASE_URL}/workers`);
    const departments = [...new Set(response.data.map((worker) => worker.department))];
    return departments;
};

export const fetchNamesByDepartment = async (department) => {
    const response = await axios.get(`${API_BASE_URL}/workers`);
    return response.data.filter((worker) => worker.department === department);
};

export const fetchStyles = async () => {
    const response = await axios.get(`${API_BASE_URL}/styles`);
    return response.data;
};
export const fetchWorkers = async () => {
    const response = await axios.get(`${API_BASE_URL}/workers`);
    return response.data;
};
export const fetchSchools = async () => {
        const response = await axios.get(`${API_BASE_URL}/schools`);
        return response.data;
};

export const fetchBills = async (workerId) => {
    const response = await axios.get(`${API_BASE_URL}/bills/${workerId}`);
    return response.data;
};

export const addWorkers = async () => {
    const response = await axios.post(`${API_BASE_URL}/workers`);
    return response.data;
};

export const addStyles = async () => {
    const response = await axios.post(`${API_BASE_URL}/styles`);
    return response.data;
};
export const submitJobCard = async (jobCardData) => {
    const response = await axios.post(`${API_BASE_URL}/job-cards`, jobCardData);
    return response.data;
};
export const updateRates = async (modifiedRates) => {
    const response = await fetch(`${API_BASE_URL}/styles/modify-rates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedRates),
    });
    if (!response.ok) {
        throw new Error('Failed to update rates');
    }
};

export const notifyDirectors = async (modifiedRates) => {
    const response = await fetch(`${API_BASE_URL}/styles/notify-directors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedRates),
    });
    if (!response.ok) {
        throw new Error('Failed to notify directors');
    }
};