import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddStyles.css";

const AddStyles = () => {
    const navigate = useNavigate();
    const [styleData, setStyleData] = useState({
        styleId: "",
        name: "",
        pattern: "",
        departmentRates: {
            Cutting: 0,
            Singer: 0,
            PowerTable: 0,
            kajaButton: 0,
            Checking: 0,
            Ironing: 0
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStyleData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRateChange = (e) => {
        const { name, value } = e.target;
        setStyleData((prev) => ({
            ...prev,
            departmentRates: {
                ...prev.departmentRates,
                [name]: parseFloat(value) || 0,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/appleUniformm/styles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(styleData),
            });

            if (response.ok) {
                alert("Style added successfully!");
                navigate("/");
            } else {
                alert("Error adding style!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error adding style!");
        }
    };

    return (
        <div className="add-styles-container">
            <h1>Add New Style</h1>
            <form className="add-styles-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Style ID:</label>
                    <input
                        type="text"
                        name="styleId"
                        value={styleData.styleId}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={styleData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Pattern:</label>
                    <input
                        type="text"
                        name="pattern"
                        value={styleData.pattern}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <h3>Department Rates:</h3>
                    <div>
                        <label>Cutting:</label>
                        <input
                            type="number"
                            name="Cutting"
                            value={styleData.departmentRates.Cutting}
                            onChange={handleRateChange}
                        />
                    </div>
                    <div>
                        <label>Singer:</label>
                        <input
                            type="number"
                            name="Singer"
                            value={styleData.departmentRates.Singer}
                            onChange={handleRateChange}
                        />
                    </div>
                    <div>
                        <label>Checking:</label>
                        <input
                            type="number"
                            name="Checking"
                            value={styleData.departmentRates.Checking}
                            onChange={handleRateChange}
                        />
                    </div>
                    <div>
                        <label>PowerTable:</label>
                        <input
                            type="number"
                            name="PowerTable"
                            value={styleData.departmentRates.PowerTable}
                            onChange={handleRateChange}
                        />
                    </div>
                    <div>
                        <label>Ironing:</label>
                        <input
                            type="number"
                            name="Ironing"
                            value={styleData.departmentRates.Ironing}
                            onChange={handleRateChange}
                        />
                    </div>
                    <div>
                        <label>Kaja Button:</label>
                        <input
                            type="number"
                            name="kajaButton"
                            value={styleData.departmentRates.kajaButton}
                            onChange={handleRateChange}
                        />
                    </div>
                </div>
                <div className="button-container">
                    <button className="back-button" onClick={() => navigate('/')}>Back</button>
                    <button type="submit" className="submit-button" onClick={handleSubmit}>Add Style</button>
                </div>
            </form>
        </div>
    );
};

export default AddStyles;