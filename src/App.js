import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import JobCardPage from './pages/JobCardPage';
import PayslipPage from './pages/PayslipPage';
import './styles.css';
import AddStyles from "./components/AddStyles";
import AddWorkers from "./components/AddWorkers";
import ModifyRate from "./pages/ModifyRate";
import ShowBillsPage from "./pages/ShowBillsPage";
import ShiftSummaryPage from "./pages/ShiftSummaryPage";

const App = () => (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/job-card" element={<JobCardPage />} />
        <Route path="/modify-rates" element={<ModifyRate />} />
        <Route path="/payslip" element={<PayslipPage />} />
        <Route path="/add-styles" element={<AddStyles />} />
        <Route path="/workers" element={<AddWorkers />} />
        <Route path="/bills" element={<ShowBillsPage />} />
        <Route path="/shift-summary" element={<ShiftSummaryPage />} />
      </Routes>
    </Router>
);
export default App;