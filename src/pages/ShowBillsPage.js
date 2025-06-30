import React, { useState, useEffect } from 'react';
import { fetchFilteredBills, fetchWorkers, fetchDepartments } from '../api';
import './ShowBillsPage.css';

const ShowBillsPage = () => {
    const [bills, setBills] = useState([]);
    const [workerName, setWorkerName] = useState('');
    const [department, setDepartment] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [workerList, setWorkerList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);

    useEffect(() => {
        const fetchInitials = async () => {
            try {
                const workers = await fetchWorkers();
                setWorkerList(workers);

                const departments = await fetchDepartments();
                setDepartmentList(departments);
            } catch (error) {
                console.error('Error loading dropdown data:', error);
            }
        };

        fetchInitials();
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const filters = { workerName, departmentName: department, startDate, endDate };
            const data = await fetchFilteredBills(filters);
            setBills(data);
        } catch (error) {
            console.error('Error fetching bills:', error);
        }
    };

    return (
        <div className="show-bills-container">
            <h2>Filter Payslips</h2>

            <div className="filters">
                <select value={workerName} onChange={(e) => setWorkerName(e.target.value)}>
                    <option value="">Select Worker</option>
                    {workerList.map(worker => (
                        <option key={worker.workerId} value={worker.name}>{worker.name}</option>
                    ))}
                </select>

                <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="">Select Department</option>
                    {departmentList.map((dept, idx) => (
                        <option key={idx} value={dept}>{dept}</option>
                    ))}
                </select>

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <button onClick={fetchBills}>Apply Filters</button>
            </div>

            <table className="bills-table">
                <thead>
                <tr>
                    <th>Worker</th>
                    <th>Department</th>
                    <th>Style</th>
                    <th>Pattern</th>
                    <th>School</th>
                    <th>Standard</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Total</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {bills.length === 0 ? (
                    <tr>
                        <td colSpan="10">No bills found for given filters</td>
                    </tr>
                ) : (
                    bills.map((bill, index) => (
                        <tr key={index}>
                            <td>{bill.workerName}</td>
                            <td>{bill.department}</td>
                            <td>{bill.styleName}</td>
                            <td>{bill.patternName}</td>
                            <td>{bill.schoolName}</td>
                            <td>{bill.standard}</td>
                            <td>{bill.quantity}</td>
                            <td>{bill.rate}</td>
                            <td>{bill.total}</td>
                            <td>{bill.date}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ShowBillsPage;
