import { useEffect } from "react";
import Fade from "@mui/material/Fade";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import CustomButton from "../../components/CustomButton/CustomButton";
import { useProgress } from "../../context/ProgressContext";
import "./AccountCreated.scss";

// ==========================================
// Component: AccountCreated
// Description: Renders the final success page when the account registration is complete
// ==========================================
const AccountCreated = () => {
  // Progress Context: sets current global progress percentage (starts at 100% complete for this step)
  const { setProgress } = useProgress();

  // -------------------------------------------------------------
  // Effect: Sets progress baseline to 100% complete when page loads
  // -------------------------------------------------------------
  useEffect(() => {
    setProgress(100);
  }, [setProgress]);

  const handleViewProfile = () => {
    console.log("=== View Profile Clicked ===");
  };

  const handleGoToDashboard = () => {
    console.log("=== Go to Dashboard Clicked ===");
  };

  return (
    <Fade in={true} timeout={400}>
      <div className="account-created-page">
        <div className="success-card">
          <div className="success-icon-wrapper">
            <CheckCircleIcon className="success-icon" />
          </div>

          <h1 className="success-title">Account created successfully</h1>
          <p className="success-subtitle">
            Your registration is complete. Your digital health record is now active and secure.
          </p>

          <div className="success-actions">
            <CustomButton type="button" className="btn-view-profile" onClick={handleViewProfile}>
              View Profile
            </CustomButton>
            <button type="button" className="btn-dashboard" onClick={handleGoToDashboard}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default AccountCreated;