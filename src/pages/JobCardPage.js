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

    const [startTime, setStartTime] = useState('');
    const [startMeridian, setStartMeridian] = useState('AM');
    const [endTime, setEndTime] = useState('');
    const [endMeridian, setEndMeridian] = useState('PM');
    const [totalHours, setTotalHours] = useState(0);
    const [shiftRate, setShiftRate] = useState(0);

    const [advance, setAdvance] = useState('');
    const [detectedAdvance, setDetectedAdvance] = useState(0);
    const [advanceBalance, setAdvanceBalance] = useState(0);
    const [finalPay, setFinalPay] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const [weeklyShiftData, setWeeklyShiftData] = useState([]);
    const [selectedWeekStart, setSelectedWeekStart] = useState('');
    const handleWeekStartChange = (e) => {
        const start = new Date(e.target.value);
        setSelectedWeekStart(e.target.value);

        const week = [...Array(7)].map((_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return {
                date: date.toISOString().split('T')[0],
                startTime: '',
                endTime: ''
            };
        });

        setWeeklyShiftData(week);
    };

    const updateShiftTime = (index, field, value) => {
        const updated = [...weeklyShiftData];
        updated[index][field] = value;
        setWeeklyShiftData(updated);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setDepartments(await fetchDepartments());
            setStyles(await fetchStyles());
            setWorkers(await fetchWorkers());
            setSchools(await fetchSchools());
        };

        fetchInitialData();
    }, []);
    useEffect(() => {
        if (selectedDepartment === 'Shift') {
            calculateShiftRate();
        }
    }, [startTime, startMeridian, endTime, endMeridian, selectedDepartment]);

    const computeHours = (startTime, endTime) => {
        if (!startTime || !endTime) return 0;

        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);

        let startMinutes = startH * 60 + startM;
        let endMinutes = endH * 60 + endM;

        let duration = endMinutes - startMinutes;
        if (duration < 0) duration += 24 * 60; // handle overnight shift

        return (duration / 60).toFixed(2);
    };

    const handleDepartmentChange = async (department) => {
        setSelectedDepartment(department);
        setNames(await fetchNamesByDepartment(department));
    };

    const calculateShiftRate = () => {
        if (!startTime || !endTime) return;

        const parseTimeToDecimal = (timeStr) => {
            const [hourStr, minuteStr] = timeStr.split(':');
            const hour = parseInt(hourStr, 10);
            const minute = parseInt(minuteStr, 10);
            return hour + minute / 60;
        };

        const start = parseTimeToDecimal(startTime);
        const end = parseTimeToDecimal(endTime);

        let hours = end - start;
        if (hours < 0) hours += 24;

        const ratePerShift = 300;
        const rate = (hours / 8) * ratePerShift;

        setTotalHours(hours.toFixed(2));
        setShiftRate(rate.toFixed(2));
    };
    const handleSubmit = async () => {
        const worker = workers.find(worker => worker.name === selectedName);
        const workerId = worker ? worker.workerId : '';
        const workerRate = worker ? worker.rate : 0;

        let jobCardData = [];

        if (selectedDepartment === 'Shift') {
            const worker = workers.find(w => w.name === selectedName);
            const workerId = worker?.workerId;
            const workerRate = parseFloat(worker?.rate || 0);

            const shiftCards = weeklyShiftData.map(day => {
                const totalHours = computeHours(day.startTime, day.endTime);
                const calculatedRate = parseFloat(((totalHours / 8) * workerRate).toFixed(2));

                return {
                    workerId,
                    department: 'Shift',
                    startTime: day.startTime,
                    endTime: day.endTime,
                    date: day.date,
                    rate: workerRate,
                    totalHours,
                    calculatedRate,
                    total: calculatedRate,
                    advance: Number(advance),
                    detectedAdvance: Number(detectedAdvance),
                    advanceBalance: Number(advance) - Number(detectedAdvance),
                    finalPay: calculatedRate - Number(detectedAdvance)
                };
            });

            jobCardData = shiftCards;
        }
        else {
            jobCardData = styleEntries.map(style => {
                const adv = Number(advance);
                const selectedStyle = styles.find(s => s.styleId === style.styleId);
                const rate = selectedStyle ? Number(selectedStyle.rate) : 0;
                const total = rate * style.quantity;

                return {
                    workerId,
                    styleId: style.styleId,
                    department: selectedDepartment,
                    schoolId: style.schoolId,
                    quantity: Number(style.quantity),
                    standard: style.standard,
                    advance: adv,
                    detectedAdvance: Number(detectedAdvance),
                    advanceBalance: adv - Number(detectedAdvance),
                    finalPay: total - Number(detectedAdvance)
                };
            });
        }

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
                netPay,
                advance: Number(advance),
                detectedAdvance: Number(detectedAdvance),
                advanceBalance: Number(advance) - Number(detectedAdvance),
                finalPay: netPay - Number(detectedAdvance)
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
            {selectedDepartment === 'Shift' && (
                <div className="weekly-shift-container">
                    <div className="input-container">
                        <label>Select Week Start Date</label>
                        <input
                            type="date"
                            value={selectedWeekStart}
                            onChange={handleWeekStartChange}
                        />
                    </div>

                    <div className="weekly-shift-table">
                        <div className="shift-entry-header">
                            <div>Date</div>
                            <div>Start Time</div>
                            <div>End Time</div>
                        </div>

                        {weeklyShiftData.map((day, index) => (
                            <div key={index} className="shift-entry-row">
                                <div>{day.date}</div>
                                <div>
                                    <input
                                        type="time"
                                        value={day.startTime}
                                        onChange={(e) => updateShiftTime(index, 'startTime', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="time"
                                        value={day.endTime}
                                        onChange={(e) => updateShiftTime(index, 'endTime', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}


            {selectedDepartment !== 'Shift' && styleEntries.map((entry, index) => (
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

            <div className="advance-row">
                <div className="input-container">
                    <label>Advance (₹)</label>
                    <input
                        type="number"
                        value={advance}
                        onChange={(e) => {
                            setAdvance(e.target.value);
                            setAdvanceBalance(Number(e.target.value) - Number(detectedAdvance));
                        }}
                        placeholder="Enter advance"
                    />
                </div>
                <div className="input-container">
                    <label>Detected Advance (₹)</label>
                    <input
                        type="number"
                        value={detectedAdvance}
                        onChange={(e) => {
                            setDetectedAdvance(e.target.value);
                            setAdvanceBalance(Number(advance) - Number(e.target.value));
                        }}
                        placeholder="Enter detected advance"
                    />
                </div>
                <div className="input-container">
                    <label>Available Balance (₹)</label>
                    <input
                        type="number"
                        value={advanceBalance}
                        readOnly
                        placeholder="Available balance"
                    />
                </div>
            </div>


            <div className="button-container">
                <button className="back-button" onClick={() => navigate('/')}>Back</button>
                {selectedDepartment !== 'Shift' && (
                    <button
                        className="add-style-button"
                        onClick={() =>
                            setStyleEntries([...styleEntries, {pattern: '', styleId: '', quantity: ''}])
                        }
                    >
                        + Add Style
                    </button>
                )}


                <button className="generate-slip-button" onClick={handleSubmit}>
                    Generate Payslip
                </button>
            </div>
        </div>
    );
};

export default JobCardPage;

