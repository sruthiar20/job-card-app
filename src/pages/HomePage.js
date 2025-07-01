import {useNavigate} from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();

    const featureCards = [
        {
            title: "Job Cards",
            description: "Generate job cards and create payslips for employees",
            icon: "job-card-icon",
            route: "/job-card",
            color: "primary"
        },
        {
            title: "Workers",
            description: "Add and manage employee information",
            icon: "worker-icon",
            route: "/workers",
            color: "success"
        },
        {
            title: "Styles",
            description: "Manage uniform styles and patterns",
            icon: "style-icon",
            route: "/add-styles",
            color: "info"
        },
        {
            title: "Rates",
            description: "Update and modify payment rates",
            icon: "rate-icon",
            route: "/modify-rates",
            color: "accent"
        },
        {
            title: "Bills",
            description: "View and manage all bills and transactions",
            icon: "bill-icon",
            route: "/bills",
            color: "warning"
        },
        {
            title: "Shift Summary",
            description: "View weekly shift reports and summaries",
            icon: "shift-icon",
            route: "/shift-summary",
            color: "secondary"
        }
    ];

    return (
        <div className="homepage-container">
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Apple Uniformm</h1>
                    <h2 className="hero-subtitle">Staff Salary Management System</h2>
                    <p className="hero-description">
                        Efficiently manage employee payslips, job cards, and salary information
                        for your uniform manufacturing business.
                    </p>
                    <button
                        className="hero-button"
                        onClick={() => navigate('/job-card')}
                    >
                        Create Job Card
                    </button>
                </div>
            </div>

            <div className="dashboard-section">
                <div className="container">
                    <h2 className="section-title">Quick Access</h2>
                    
                    <div className="feature-grid">
                        {featureCards.map((card, index) => (
                            <div 
                                className={`feature-card ${card.color}`} 
                                key={index}
                                onClick={() => navigate(card.route)}
                            >
                                <div className={`card-icon ${card.icon}`}></div>
                                <h3 className="card-title">{card.title}</h3>
                                <p className="card-description">{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="stats-section">
                <div className="container">
                    <h2 className="section-title">System Overview</h2>
                    
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-icon worker-stat"></div>
                            <div className="stat-content">
                                <h3 className="stat-title">Workers</h3>
                                <p className="stat-value">Management Made Easy</p>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon style-stat"></div>
                            <div className="stat-content">
                                <h3 className="stat-title">Styles</h3>
                                <p className="stat-value">Catalog Organization</p>
                            </div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="stat-icon salary-stat"></div>
                            <div className="stat-content">
                                <h3 className="stat-title">Payslips</h3>
                                <p className="stat-value">Automated Generation</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer className="homepage-footer">
                <div className="container">
                    <p>Apple Uniformm Staff Portal &copy; {new Date().getFullYear()}</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;