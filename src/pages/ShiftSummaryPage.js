import React, { useState, useEffect } from 'react';
import { fetchWorkers, fetchShiftSummary } from '../api';
import './ShiftSummaryPage.css';

const ShiftSummaryPage = () => {
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('');
    const [selectedWeekStart, setSelectedWeekStart] = useState('');
    const [summaryData, setSummaryData] = useState(null);
    const [weeklyDetails, setWeeklyDetails] = useState([]);

    useEffect(() => {
        const loadWorkers = async () => {
            try {
                const workersData = await fetchWorkers();
                const shiftWorkers = workersData.filter(worker => worker.department === 'Shift');
                setWorkers(shiftWorkers);
            } catch (error) {
                console.error('Error loading workers:', error);
            }
        };

        loadWorkers();
    }, []);

    const handleWeekSelection = (e) => {
        setSelectedWeekStart(e.target.value);
    };

    const handleWorkerSelection = (e) => {
        setSelectedWorker(e.target.value);
    };

    const fetchSummary = async () => {
        if (!selectedWorker || !selectedWeekStart) {
            alert('Please select both worker and week start date.');
            return;
        }

        try {
            // Use UTC dates to avoid timezone issues
            const startDate = new Date(selectedWeekStart + 'T00:00:00Z');
            console.log("Start date selected (UTC):", startDate.toISOString(), "Original string:", selectedWeekStart);
            
            const endDate = new Date(startDate);
            endDate.setUTCDate(startDate.getUTCDate() + 6);
            const endDateStr = endDate.toISOString().split('T')[0];
            
            console.log("Date range (UTC):", selectedWeekStart, "to", endDateStr);
            
            // Get worker ID
            const worker = workers.find(w => w.name === selectedWorker);
            if (!worker) {
                console.error("Worker not found:", selectedWorker);
                return;
            }
            console.log("Worker found:", worker);
            
            const summaryResponse = await fetchShiftSummary(worker.workerId, selectedWeekStart, endDateStr);
            console.log("API response:", summaryResponse);
            
            if (summaryResponse) {
                // Generate all days for the week regardless of API response
                const weekDates = getWeekDays(selectedWeekStart);
                console.log("Generated week days:", weekDates);
                
                // Ensure dailyShifts exists in the response
                const dailyShifts = summaryResponse.dailyShifts || [];
                console.log("Daily shifts from API:", dailyShifts);
                
                // Create a map of date strings to shift data for easier lookup
                const shiftsMap = {};
                dailyShifts.forEach(shift => {
                    // Normalize the date format to ensure consistent comparison
                    const normalizedDate = new Date(shift.date + 'T00:00:00Z').toISOString().split('T')[0];
                    shiftsMap[normalizedDate] = shift;
                });
                console.log("Shifts map:", shiftsMap);
                
                // Map each day of the week to the corresponding shift data
                const details = weekDates.map(date => {
                    const dateString = date.dateString;
                    // Find matching shift data or use default values
                    const dayShift = shiftsMap[dateString];
                    
                    console.log(`Processing ${date.day} (${dateString}):`, dayShift || "No data");
                    
                    return {
                        date: dateString,
                        day: date.day,
                        displayDate: date.displayDate,
                        // Always include the day, even with zero values
                        shifts: dayShift ? Number(dayShift.shifts) || 0 : 0,
                        // Get the amount directly from API response to ensure accuracy
                        amount: dayShift ? Number(dayShift.amount) || 0 : 0
                    };
                });
                
                console.log("Final weekly details:", details);
                
                // Extract advance related information
                const advance = Number(summaryResponse.advance) || 0;
                const detectedAdvance = Number(summaryResponse.detectedAdvance) || 0;
                
                // Calculate advanceBalance manually if it's zero in the API response
                // This ensures consistency with the payslip page
                let advanceBalance = Number(summaryResponse.advanceBalance) || 0;
                if (advanceBalance === 0 && advance > 0 && detectedAdvance > 0) {
                    advanceBalance = advance - detectedAdvance;
                    console.log("Manually calculated advance balance:", advanceBalance);
                }
                
                // Use the final pay from the API response for accuracy
                let finalPay = summaryResponse.finalPay || 0;
                const totalAmount = summaryResponse.totalAmount || details.reduce((sum, day) => sum + day.amount, 0);
                
                // If finalPay is missing but we have totalAmount and detectedAdvance, calculate it
                if (finalPay === 0 && totalAmount > 0) {
                    finalPay = totalAmount - detectedAdvance;
                    console.log("Manually calculated final pay:", finalPay);
                }
                
                console.log("Advance information:", { 
                    advance, 
                    detectedAdvance, 
                    advanceBalance, 
                    finalPay,
                    totalAmount
                });
                
                setSummaryData({
                    name: selectedWorker,
                    ratePerShift: worker.rate,
                    totalShifts: details.reduce((sum, day) => sum + day.shifts, 0),
                    advance: advance,
                    detectedAdvance: detectedAdvance,
                    availableBalance: advanceBalance,
                    totalAmountPaid: finalPay
                });
                
                setWeeklyDetails(details);
            }
        } catch (error) {
            console.error('Error fetching shift summary:', error);
        }
    };

    // Helper to generate week days from start date
    const getWeekDays = (startDateStr) => {
        // Use UTC date to avoid timezone issues
        const startDate = new Date(startDateStr + 'T00:00:00Z');
        console.log("Parsing start date (UTC):", startDateStr, "->", startDate.toISOString());
        
        const days = [];
        
        // Generate all 7 days of the week
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setUTCDate(startDate.getUTCDate() + i);
            
            // Format the date string in ISO format (YYYY-MM-DD)
            const dateString = date.toISOString().split('T')[0];
            
            // Get day of week (0 = Sunday, 1 = Monday, etc.)
            const dayOfWeek = date.getUTCDay();
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            
            days.push({
                dateString: dateString,
                day: dayNames[dayOfWeek],
                displayDate: `${date.getUTCDate()}/${date.getUTCMonth() + 1}`
            });
            
            console.log(`Generated day ${i+1} (UTC):`, dayNames[dayOfWeek], dateString);
        }
        
        return days;
    };

    return (
        <div className="shift-summary-container">
            <h2>Shift Summary</h2>
            
            <div className="summary-filters">
                <div className="filter-item">
                    <label>Select Worker</label>
                    <select value={selectedWorker} onChange={handleWorkerSelection}>
                        <option value="">-- Select Worker --</option>
                        {workers.map(worker => (
                            <option key={worker.workerId} value={worker.name}>{worker.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-item">
                    <label>Select Week Start</label>
                    <input 
                        type="date" 
                        value={selectedWeekStart} 
                        onChange={handleWeekSelection}
                    />
                </div>
                
                <button className="fetch-button" onClick={fetchSummary}>
                    Show Summary
                </button>
            </div>
            
            {summaryData && (
                <div className="summary-results">
                    <h3>Worker Summary</h3>
                    <div className="summary-note">Note: 1 shift = 8 hours</div>
                    <table className="summary-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Rate Per Shift</th>
                                <th>Total Shifts</th>
                                <th>Advance</th>
                                <th>Detected Advance</th>
                                <th>Available Balance</th>
                                <th>Total Amount Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{summaryData.name}</td>
                                <td>₹{summaryData.ratePerShift}</td>
                                <td>{summaryData.totalShifts.toFixed(2)}</td>
                                <td>₹{summaryData.advance}</td>
                                <td>₹{summaryData.detectedAdvance}</td>
                                <td>₹{summaryData.availableBalance}</td>
                                <td>₹{summaryData.totalAmountPaid}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    {/* Add explanation if the advance balance was manually calculated */}
                    {summaryData && summaryData.advance > 0 && summaryData.detectedAdvance > 0 && (
                        <div className="calculation-note">
                            Available Balance = Advance (₹{summaryData.advance}) - Detected Advance (₹{summaryData.detectedAdvance}) = ₹{summaryData.availableBalance}
                        </div>
                    )}

                    <h3>Weekly Shift Details</h3>
                    {weeklyDetails.length > 0 ? (
                        <table className="weekly-details-table">
                            <thead>
                                <tr>
                                    {weeklyDetails.map((day, idx) => (
                                        <th key={idx}>{`${day.day}-${day.displayDate}`}</th>
                                    ))}
                                    <th>Total Shifts</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {weeklyDetails.map((day, idx) => (
                                        <td key={idx}>{day.shifts > 0 ? day.shifts.toFixed(2) : "0"}</td>
                                    ))}
                                    <td>{summaryData.totalShifts.toFixed(2)}</td>
                                    <td>₹{summaryData.totalAmountPaid}</td>
                                </tr>
                                <tr>
                                    {weeklyDetails.map((day, idx) => (
                                        <td key={idx}>
                                            {day.amount > 0 ? 
                                                `₹${day.amount}` : 
                                                "-"
                                            }
                                        </td>
                                    ))}
                                    <td colSpan="2" className="api-note">Values from payslip</td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data-message">No weekly data available</div>
                    )}

                    {/* Add explanation if there's a discrepancy */}
                    {weeklyDetails.length > 0 && 
                     Math.abs(weeklyDetails.reduce((sum, day) => sum + day.amount, 0) - summaryData.totalAmountPaid) > 1 && (
                        <div className="calculation-note">
                            Note: The total amount paid is calculated from the payslip and may include 
                            adjustments not reflected in the daily breakdown.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShiftSummaryPage; 