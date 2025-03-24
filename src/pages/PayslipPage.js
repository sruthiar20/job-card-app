import React from 'react';
import {useLocation} from 'react-router-dom';
import Payslip from '../components/Payslip';

const PayslipPage = () => {
    const location = useLocation();
    const {payslip} = location.state || {};

    if (!payslip) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <Payslip styles={payslip.styles}
                     netPay={payslip.netPay}
                     employerName={payslip.workerName}
                     payslip={payslip}
            />
        </div>
    );
};

export default PayslipPage;