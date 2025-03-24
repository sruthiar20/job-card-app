import React, {useState, useEffect} from 'react';
import {fetchStyles, updateRates, notifyDirectors} from '../api';
import './ModifyRate.css';
import {useNavigate} from "react-router-dom";

const ModifyRate = () => {
    const [styles, setStyles] = useState([]);
    const [selectedPattern, setSelectedPattern] = useState('');
    const [filteredStyles, setFilteredStyles] = useState([]);
    const [modifiedRates, setModifiedRates] = useState({});
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            const fetchedStyles = await fetchStyles();
            setStyles(fetchedStyles);
        };
        fetchInitialData();
    }, []);

    const handlePatternChange = (pattern) => {
        setSelectedPattern(pattern);
        setFilteredStyles(styles.filter((style) => style.pattern === pattern));
    };

    const handleRateChange = (styleId, department, rate) => {
        setModifiedRates((prevRates) => ({
            ...prevRates,
            [styleId]: {
                ...(prevRates[styleId] || {}),
                [department]: rate,
            },
        }));
    };

    const handleSubmit = async () => {
        try {
            await updateRates(modifiedRates);
            setIsPopupVisible(true);
        } catch (error) {
            console.error("Failed to update rates:", error);
            alert("Error updating rates. Please try again.");
        }
    };

    const handleProceed = async () => {
        try {
            await notifyDirectors(modifiedRates);
            alert("Information sent to the Managing Directors.");
            setIsPopupVisible(false);
        } catch (error) {
            console.error("Failed to notify directors:", error);
            alert("Error notifying directors. Please try again.");
        }
    };

    return (
        <div className="modify-rate-container">
            <h2>Modify Department Rates</h2>

            <div className="filter-container">
                <label htmlFor="pattern">Click the dropdown to select pattern</label>
                <select id="pattern" onChange={(e) => handlePatternChange(e.target.value)}>
                    <option value="">Choose pattern</option>
                    {Array.from(new Set(styles.map((style) => style.pattern))).map((pattern) => (
                        <option key={pattern} value={pattern}>{pattern}</option>
                    ))}
                </select>
            </div>

            {filteredStyles.length > 0 && (
                <table className="rate-table">
                    <thead>
                    <tr>
                        <th>Style Name</th>
                        {Object.keys(filteredStyles[0].departmentRates).map((department) => (
                            <th key={department}>{department}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredStyles.map((style) => (
                        <tr key={style.styleId}>
                            <td>{style.name}</td>
                            {Object.keys(style.departmentRates).map((department) => (
                                <td key={department}>
                                    <input
                                        type="number"
                                        value={
                                            modifiedRates[style.styleId]?.[department] ?? style.departmentRates[department]
                                        }
                                        onChange={(e) =>
                                            handleRateChange(style.styleId, department, parseFloat(e.target.value) || 0)
                                        }
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="button-container">
                <button className="back-button" onClick={() => navigate('/')}>Back</button>
                <button className="submit-button" onClick={handleSubmit}>Submit Changes</button>
            </div>
            {isPopupVisible && (
                <div className="popup">
                    <p>
                        "This is a modified and confirmed rate. Information will be sent to the Managing Directors of
                        Apple Uniformm."
                    </p>
                    <button className="proceed-button" onClick={handleProceed}>Proceed</button>
                </div>
            )}
        </div>
    );
};

export default ModifyRate;