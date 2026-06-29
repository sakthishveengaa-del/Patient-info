import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";

import Header from "../../components/Header/Header";
import CustomTextArea from "../../components/CustomTextArea/CustomTextArea";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useProgress, calculateRegistrationProgress } from "../../context/ProgressContext";
import { useForm } from "../../context/FormProvider";
import "./MedicalHistory.scss";



// ==========================================
// Component: MedicalHistory
// Description: Renders the third step of registration (allergies, medications, conditions, surgeries)
// ==========================================
const MedicalHistory = () => {
  // Navigation hook to redirect between pages
  const navigate = useNavigate();

  // Progress Context: sets the current global progress percentage (starts at 30% baseline for this step)
  const { setProgress } = useProgress();

  // Form Context: stores global registration data across all steps
  const { formData, setFormData } = useForm();

  // Local State: tracks values entered in input fields of this page (pre-filled from context if present)
  const [form, setForm] = useState({
    allergies: formData.allergies || "",
    currentMedications: formData.currentMedications || "",
    existingConditions: formData.existingConditions || "",
    previousSurgeries: formData.previousSurgeries || ""
  });

  // -------------------------------------------------------------
  // Effect: Calculate progress
  // -------------------------------------------------------------
  useEffect(() => {
    setProgress(calculateRegistrationProgress(formData, form, "MedicalHistory"));
  }, [formData, form, setProgress]);

  // -------------------------------------------------------------
  // Handler: Runs whenever any textarea changes
  // -------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Log user input change
    console.log("[Form Input Change] Field: " + name + ", Value: " + value);
  };

  // -------------------------------------------------------------
  // Handler: Form Submission
  // -------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { ...formData, ...form };
    setFormData(updatedData);

    console.log("=== Medical History Form Submission ===");
    console.log("Allergies: " + (form.allergies || "None"));
    console.log("Current Medications: " + (form.currentMedications || "None"));
    console.log("Existing Conditions: " + (form.existingConditions || "None"));
    console.log("Previous Surgeries: " + (form.previousSurgeries || "None"));
    console.log("======================================");

    navigate("/insurance-information");
  };

  // -------------------------------------------------------------
  // Handler: Skip step navigation
  // -------------------------------------------------------------
  const handleSkip = () => {
    const updatedData = { ...formData, ...form };
    setFormData(updatedData);
    navigate("/insurance-information");
  };

  // -------------------------------------------------------------
  // Handler: Go back navigation
  // -------------------------------------------------------------
  const handleBack = () => {
    const updatedData = { ...formData, ...form };
    setFormData(updatedData);
    navigate("/additional-information");
  };

  return (
    <Fade in={true} timeout={400}>
      <div className="medical-history-page">
        <Header
          title="Medical History"
          subtitle="Add information about your past treatments, medications, and health conditions."
        />

        <form onSubmit={handleSubmit} className="info-form">

          <div className="form-stack">
            <CustomTextArea
              label="Allergies"
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              placeholder="List any allergies you have (If any)"
            />

            <CustomTextArea
              label="Current Medications"
              name="currentMedications"
              value={form.currentMedications}
              onChange={handleChange}
              placeholder="List your current medications with dosage"
              showCounter={true}
              maxLength={500}
            />

            <CustomTextArea
              label="Existing Conditions"
              name="existingConditions"
              value={form.existingConditions}
              onChange={handleChange}
              placeholder="Enter any Conditions (e.g., diabetes, hypertension, asthma, etc.)"
            />

            <CustomTextArea
              label="Previous Surgeries"
              name="previousSurgeries"
              value={form.previousSurgeries}
              onChange={handleChange}
              placeholder="Enter details of any past surgeries (If any)"
              showCounter={true}
              maxLength={500}
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="btn-skip" onClick={handleSkip}>
              Skip for now
            </button>
            
            <div className="right-actions">
              <button type="button" className="btn-back" onClick={handleBack}>
                Go Back
              </button>
              <CustomButton type="submit">
                Add Insurance Information
              </CustomButton>
            </div>
          </div>
        </form>
      </div>
    </Fade>
  );
};

export default MedicalHistory;