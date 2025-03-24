import {useNavigate} from "react-router-dom";
import "./HomePage.css";
const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage-container">
            <div
                className="hero-image"
                style={{
                    backgroundImage: 'url(/bg1.jpg)'
                }}
            ></div>
            <nav className="menu-panel">
                <ul>
                    <li onClick={() => navigate('/workers')}>Add new employee</li>
                    <li onClick={() => navigate('/add-styles')}>Add new styles</li>
                    <li onClick={() => navigate('/job-card')}>Generate JobCards</li>
                    <li onClick={() => navigate('/modify-rates')}>Modify Rates</li>
                    <li onClick={() => navigate('/bills')}>Show Bills</li>
                </ul>
            </nav>

            <div className="main-content">
                <header className="homepage-header">
                    <div className="header-text">
                        <h1>JOBCARD</h1>
                        <p>
                            Its time to generate payslip to the employees of
                            Apple Uniformm
                        </p>
                        <p>Click the button below to get started</p>
                    </div>
                </header>

                <main className="homepage-main">
                    <button
                        className="action-button"
                        onClick={() => navigate('/job-card')}
                    >
                        ADD SALARY SLIP
                    </button>
                </main>
            </div>
        </div>
    );
};

export default HomePage;