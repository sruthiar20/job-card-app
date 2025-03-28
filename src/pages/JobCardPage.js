import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDepartments, fetchNamesByDepartment, fetchStyles, fetchWorkers, fetchSchools, submitJobCard } from '../api';
import './JobCardPage.css';

const JobCardPage = () => {
    const [departments, setDepartments] = useState([]);
    const [names, setNames] = useState([]);
    const [styles, setStyles] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [schools, setSchools] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedName, setSelectedName] = useState('');
    const [styleEntries, setStyleEntries] = useState([{ pattern: '', styleId: '', quantity: 0, schoolId: '' }]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            setDepartments(await fetchDepartments());
            setStyles(await fetchStyles());
            setWorkers(await fetchWorkers());
            setSchools(await fetchSchools());
        };

        fetchInitialData();
    }, []);

    const handleDepartmentChange = async (department) => {
        setSelectedDepartment(department);
        setNames(await fetchNamesByDepartment(department));
    };

    const handleSubmit = async () => {
        const worker = workers.find(worker => worker.name === selectedName);
        const workerId = worker ? worker.workerId : '';

        const jobCardData = styleEntries.map(style => ({
            workerId,
            styleId: style.styleId,
            department: selectedDepartment,
            schoolId: style.schoolId,
            quantity: Number(style.quantity),
            standard: style.standard
        }));

        try {
            const payslip = await submitJobCard(jobCardData);
            const netPay = payslip.reduce((total, card) => total + card.total, 0);

            const formattedPayslip = {
                workerName: payslip[0].workerName,
                department: payslip[0].department,
                date: payslip[0].date,
                styles: payslip.map(card => ({
                    styleName: card.styleName,
                    quantity: card.quantity,
                    total: card.total,
                    schoolName: card.schoolName,
                    standard: card.standard,
                    rate: card.rate
                })),
                netPay
            };

            navigate('/payslip', { state: { payslip: formattedPayslip } });
        } catch (error) {
            console.error('Error submitting job card:', error);
        }
    };

    return (
        <div className="job-card-container">
            <h2>Enter Job Card Details of an Employee</h2>

            <div className="table-layout">
                <div className="input-container">
                    <label htmlFor="department">Select Department</label>
                    <select id="department" onChange={(e) => handleDepartmentChange(e.target.value)}>
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
                <div className="input-container">
                    <label htmlFor="name">Select Name</label>
                    <select id="name" onChange={(e) => setSelectedName(e.target.value)}>
                        <option value="">Select Name</option>
                        {names.map((worker) => (
                            <option key={worker.workerId} value={worker.name}>{worker.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {styleEntries.map((entry, index) => (
                <div key={index} className="style-entry-row">
                    <div className="input-container">
                        <label htmlFor={`pattern-${index}`}>Select Pattern</label>
                        <select
                            id={`pattern-${index}`}
                            onChange={(e) => {
                                const updatedEntries = [...styleEntries];
                                updatedEntries[index].pattern = e.target.value;
                                setStyleEntries(updatedEntries);
                            }}
                        >
                            <option value="">Select Pattern</option>
                            {Array.from(new Set(styles.map(style => style.pattern))).map((pattern) => (
                                <option key={pattern} value={pattern}>{pattern}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container">
                        <label htmlFor={`style-${index}`}>Select Style</label>
                        <select
                            id={`style-${index}`}
                            onChange={(e) => {
                                const updatedEntries = [...styleEntries];
                                updatedEntries[index].styleId = e.target.value;
                                setStyleEntries(updatedEntries);
                            }}
                        >
                            <option value="">Select Style</option>
                            {styles
                                .filter((style) => style.pattern === entry.pattern)
                                .map((style) => (
                                    <option key={style.styleId} value={style.styleId}>{style.name}</option>
                                ))}
                        </select>
                    </div>
                    <div className="input-container">
                        <label htmlFor={`school-${index}`}>Select School</label>
                        <select
                            id={`school-${index}`}
                            value={entry.schoolId}
                            onChange={(e) => {
                                const updatedEntries = [...styleEntries];
                                updatedEntries[index].schoolId = e.target.value;
                                setStyleEntries(updatedEntries);
                            }}
                        >
                            <option value="">Select School</option>
                            {schools.map((school) => (
                                <option key={school.schoolId} value={school.schoolId}>
                                    {school.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container">
                        <label htmlFor={`standard-${index}`}>Select Standard</label>
                        <select
                            id={`standard-${index}`}
                            value={entry.standard}
                            onChange={(e) => {
                                const updatedEntries = [...styleEntries];
                                updatedEntries[index].standard = e.target.value;
                                setStyleEntries(updatedEntries);
                            }}
                        >
                            <option value="">Select Standard</option>
                            {["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII",
                                "I to V",
                                "VI to VIII",
                                "IX and X",
                                "XI and XII",
                                "VI to X",
                                "VI to XII",
                                "I to III",
                                "IV to V",
                                "I and II",
                                "III to V",
                                "KG"].map((std) => (
                                <option key={std} value={std}>{std}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container quantity-field">
                        <label htmlFor={`quantity-${index}`}>Quantity</label>
                        <input
                            type="text"
                            id={`quantity-${index}`}
                            placeholder="Enter"
                            value={entry.quantity}
                            onChange={(e) => {
                                const updatedEntries = [...styleEntries];
                                const quantity = e.target.value.trim() === "" ? "" : Number(e.target.value);
                                updatedEntries[index].quantity = quantity;
                                setStyleEntries(updatedEntries);
                            }}
                        />
                    </div>
                </div>
            ))}

            <div className="button-container">
                <button className="back-button" onClick={() => navigate('/')}>Back</button>
                <button
                    className="add-style-button"
                    onClick={() => setStyleEntries([...styleEntries, {pattern: '', styleId: '', quantity: ''}])}
                >
                    + Add Style
                </button>

                <button className="generate-slip-button" onClick={handleSubmit}>
                    Generate Payslip
                </button>
            </div>
        </div>
    );
};

export default JobCardPage;

