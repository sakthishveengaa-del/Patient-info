import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";

import CustomButton from "../../components/CustomButton/CustomButton";
import { useProgress } from "../../context/ProgressContext";
import { useForm } from "../../context/FormProvider";
import "./ReviewComplete.scss";

// ==========================================
// Component: ReviewComplete
// Description: Renders the sixth step of registration (full details summary for review before submit)
// ==========================================
const ReviewComplete = () => {
  // Navigation hook to redirect between pages
  const navigate = useNavigate();

  // Progress Context: sets current global progress percentage (starts at 80% baseline for this step)
  const { setProgress } = useProgress();

  // Form Context: stores global registration data across all steps
  const { formData } = useForm();

  // -------------------------------------------------------------
  // Effect: Sets progress baseline to 80% when page loads
  // -------------------------------------------------------------
  useEffect(() => {
    setProgress(80);
  }, [setProgress]);

  // -------------------------------------------------------------
  // Handler: Final submit callback. Sets progress to 100% and proceeds to success screen
  // -------------------------------------------------------------
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setProgress(100);
    console.log("=== Final Form Submission ===");
    console.log("Full Form Data Object:", formData);
    console.log("=============================");
    navigate("/account-created");
  };

  // -------------------------------------------------------------
  // Handler: Go back navigation
  // -------------------------------------------------------------
  const handleBack = () => {
    navigate("/health-records");
  };

  return (
    <Fade in={true} timeout={400}>
      <div className="review-complete-page">
        <header className="page-header">
          <div className="header-text">
            <h1 className="header-title">Review & Complete</h1>
          </div>
        </header>

        <form onSubmit={handleFinalSubmit} className="info-form">
          {/* Action Buttons */}
          <div className="form-actions" style={{ borderTop: "none", marginTop: "0" }}>
            <button type="button" className="btn-back" onClick={handleBack}>
              Go Back
            </button>
            <CustomButton type="submit">
              Create Profile
            </CustomButton>
          </div>
        </form>
      </div>
    </Fade>
  );
};

export default ReviewComplete;