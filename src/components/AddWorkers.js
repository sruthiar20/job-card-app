import React, { useState, useEffect } from "react";
import "./AddWorkers.css";

const AddWorkers = () => {
    const [workerData, setWorkerData] = useState({
        workerId: "",
        name: "",
        department: "",
    });

    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch("http://localhost:8080/appleUniformm/styles");
                if (response.ok) {
                    const styles = await response.json();
                    const uniqueDepartments = new Set();
                    styles.forEach((style) => {
                        Object.keys(style.departmentRates).forEach((dept) => {
                            uniqueDepartments.add(dept);
                        });
                    });
                    setDepartments(Array.from(uniqueDepartments));
                } else {
                    console.error("Failed to fetch styles");
                }
            } catch (error) {
                console.error("Error fetching styles:", error);
            }
        };

        fetchDepartments();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWorkerData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDepartmentChange = (value) => {
        setWorkerData((prev) => ({
            ...prev,
            department: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/appleUniformm/workers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(workerData),
            });

            if (response.ok) {
                alert("Successfully added your employee!");
                setWorkerData({
                    workerId: "",
                    name: "",
                    department: "",
                });
            } else {
                alert("Error adding employee!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error adding employee!");
        }
    };

    return (
        <div className="add-workers-container">
            <h1>Add New Worker</h1>
            <form className="add-workers-form" onSubmit={handleSubmit}>
                <table className="workers-table">
                    <thead>
                    <tr>
                        <th>Worker ID</th>
                        <th>Name</th>
                        <th>Department</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <input
                                type="text"
                                name="workerId"
                                value={workerData.workerId}
                                onChange={handleInputChange}
                                required
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                name="name"
                                value={workerData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </td>
                        <td>
                            <select
                                id="department"
                                value={workerData.department}
                                onChange={(e) => handleDepartmentChange(e.target.value)}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button type="submit" className="submit-button">Add Worker</button>
            </form>
        </div>
    );
};

export default AddWorkers;