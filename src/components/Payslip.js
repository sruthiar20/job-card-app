import React from 'react';
import './Payslip.css';
import html2pdf from 'html2pdf.js';

const Payslip = ({ styles, netPay, payslip, employerName }) => {
    if (!styles || styles.length === 0) {
        return <p>No payslip data available.</p>;
    }

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const element = document.getElementById('payslip-container');
        html2pdf().from(element).save('payslip.pdf');
    };

    return (
        <div id="payslip-container" className="payslip-container">
            <header className="payslip-header">
                <h1 className="header-title">Employee Payslip Report</h1>
            </header>

            <div className="payslip-info">
                <p><strong>Employer Name:</strong> {employerName}</p>
                <p><strong>Department:</strong> {payslip.department}</p>
                <p><strong>Issue Date:</strong> {payslip.date}</p>

            </div>

            <table className="table">
                <thead>
                <tr>
                    <th>Style Name</th>
                    <th>School Name</th>
                    <th>Standard</th>
                    <th>Rate</th>
                    <th>Quantity</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                {styles.map((style, index) => (
                    <tr key={index}>
                        <td>{style.styleName}</td>
                        <td>{style.schoolName}</td>
                        <td>{style.standard}</td>
                        <td>{style.rate}</td>
                        <td>{style.quantity}</td>
                        <td>{style.total}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <table className="net-pay-table">
                <tbody>
                <tr>
                    <td><strong>Net Pay:</strong></td>
                    <td>{netPay}</td>
                </tr>
                </tbody>
            </table>

            <div className="action-buttons">
                <button className="btn" onClick={handlePrint}>Print</button>
                <button className="btn" onClick={handleDownload}>Download PDF</button>
            </div>
        </div>
    );
};

export default Payslip;