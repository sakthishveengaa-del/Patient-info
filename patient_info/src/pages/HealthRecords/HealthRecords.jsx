import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";
import Header from "../../components/Header/Header";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useProgress } from "../../context/ProgressContext";
import "./HealthRecords.scss";

// ==========================================
// Component: HealthRecords
// Description: Renders the Health Records page with only the title and navigation actions
// ==========================================
const HealthRecords = () => {
  const navigate = useNavigate();
  const { setProgress } = useProgress();

  // Keep progress baseline to 60% for this step
  useEffect(() => {
    setProgress(60);
  }, [setProgress]);

  const handleSkip = () => {
    navigate("/review-complete");
  };

  const handleBack = () => {
    navigate("/insurance-information");
  };

  const handleNext = () => {
    navigate("/review-complete");
  };

  return (
    <Fade in={true} timeout={400}>
      <div className="health-records-page">
        <Header
          title="Health Records"
          subtitle="Upload and manage your medical records, prescriptions, and lab reports for a complete digital health history."
        />

        <div className="info-form" style={{ marginTop: "40px" }}>
          {/* Action Buttons */}
          <div className="form-actions" style={{ borderTop: "none", marginTop: "0" }}>
            <button type="button" className="btn-skip" onClick={handleSkip}>
              Skip for now
            </button>
            
            <div className="right-actions">
              <button type="button" className="btn-back" onClick={handleBack}>
                Go Back
              </button>
              <CustomButton type="button" onClick={handleNext}>
                Create Unique ID
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default HealthRecords;