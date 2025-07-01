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


export const fetchFilteredBills = async ({ workerName, departmentName, startDate, endDate }) => {
    const params = {};
    if (workerName) params.workerName = workerName;
    if (departmentName) params.departmentName = departmentName;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axios.get(`${API_BASE_URL}/bills/job-cards`, { params });
    return response.data;
};

export const fetchShiftSummary = async (workerId, startDate, endDate) => {
    const params = {
        workerId,
        startDate,
        endDate
    };

    console.log("Shift summary request params:", params);
    try {
        const response = await axios.get(`${API_BASE_URL}/shifts/summary`, { params });
        console.log("Shift summary API response status:", response.status);
        
        // Log the raw data for debugging
        console.log("Shift summary API raw response:", JSON.stringify(response.data));
        
        // If the response contains nested data, extract the fields
        const data = response.data;
        
        // Return a normalized response that contains the expected fields
        const result = {
            totalShifts: data.totalShifts || 0,
            // Extract advance related fields with fallbacks
            advance: data.advance || 0,
            detectedAdvance: data.detectedAdvance || 0,
            advanceBalance: data.advanceBalance || 0,
            // For finalPay, if available use it, otherwise calculate as total minus detected advance
            finalPay: data.finalPay || (data.totalAmount && data.detectedAdvance ? 
                      data.totalAmount - data.detectedAdvance : data.totalAmount) || 0,
            totalAmount: data.totalAmount || 0,
            dailyShifts: data.dailyShifts || []
        };
        
        console.log("Normalized shift summary response:", result);
        return result;
    } catch (error) {
        console.error("Shift summary API error:", error.message);
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
        }
        throw error;
    }
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
    console.log("Submitting job card data:", JSON.stringify(jobCardData));
    try {
        const response = await axios.post(`${API_BASE_URL}/job-cards`, jobCardData);
        console.log("Job card submission response:", JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error("Job card submission error:", error.message);
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
        }
        throw error;
    }
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