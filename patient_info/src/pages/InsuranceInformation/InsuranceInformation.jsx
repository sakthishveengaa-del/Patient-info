import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";
import BusinessIcon from "@mui/icons-material/Business";
import CreditCardIcon from "@mui/icons-material/CreditCard";

import Header from "../../components/Header/Header";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import CustomFileUploader from "../../components/CustomFileUploader/CustomFileUploader";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useProgress, calculateRegistrationProgress } from "../../context/ProgressContext";
import { useForm } from "../../context/FormProvider";
import { UploadCard } from "../../components/UploadCard/UploadCard";
import "./InsuranceInformation.scss";


const insuranceProviders = [
  "Star Health Insurance",
  "HDFC Ergo General Insurance",
  "ICICI Lombard General Insurance",
  "Niva Bupa Health Insurance",
  "Care Health Insurance",
  "Aditya Birla Health Insurance",
  "SBI General Insurance",
  "Other"
];


// ==========================================
// Component: InsuranceInformation
// Description: Renders the fourth step of registration (insurance details & upload)
// ==========================================
const InsuranceInformation = () => {
  // Navigation hook to redirect between pages
  const navigate = useNavigate();

  // Progress Context: sets current global progress percentage (starts at 50% baseline for this step)
  const { setProgress } = useProgress();

  // Form Context: stores global registration data across all steps
  const { formData, setFormData } = useForm();

  // Local State: tracks values entered in input fields of this page (pre-filled from context if present)
  const [form, setForm] = useState({
    insuranceProvider: formData.insuranceProvider || "",
    policyNumber: formData.policyNumber || "",
    insuranceCard: formData.insuranceCard ? (Array.isArray(formData.insuranceCard) ? formData.insuranceCard : [formData.insuranceCard]) : []
  });

  // -------------------------------------------------------------
  // Effect: Calculate progress
  // -------------------------------------------------------------
  useEffect(() => {
    setProgress(calculateRegistrationProgress(formData, form, "InsuranceInformation"));
  }, [formData, form, setProgress]);

  // -------------------------------------------------------------
  // Handler: Runs whenever any dropdown or text input changes
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
  // Handler: Runs when a file is successfully uploaded using the custom uploader component
  // -------------------------------------------------------------
  const handleFileChange = (files) => {
    if (files) {
      const filesArray = Array.isArray(files) ? files : [files];
      setForm((prev) => ({
        ...prev,
        insuranceCard: [...(prev.insuranceCard || []), ...filesArray]
      }));

      // Log upload details
      filesArray.forEach((file) => {
        console.log("[File Uploaded] Name: " + file.name + ", Type: " + file.type + ", Size: " + file.size + " bytes");
      });
    }
  };

  // -------------------------------------------------------------
  // Handler: Form Submission
  // -------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = { ...formData, ...form };
    setFormData(updatedData);

    console.log("=== Insurance Details Form Submission ===");
    console.log("Insurance Provider: " + (form.insuranceProvider || "N/A"));
    console.log("Policy Number: " + (form.policyNumber || "N/A"));
    console.log("Insurance Card: " + (form.insuranceCard && form.insuranceCard.length > 0 ? form.insuranceCard.map(c => c.name).join(", ") : "N/A"));
    console.log("========================================");

    navigate("/health-records");
  };

  // -------------------------------------------------------------
  // Handler: Skip step navigation
  // -------------------------------------------------------------
  const handleSkip = () => {
    const updatedData = { ...formData, ...form };
    setFormData(updatedData);
    navigate("/health-records");
  };

  // -------------------------------------------------------------
  // Handler: Go back navigation
  // -------------------------------------------------------------
  const handleBack = () => {
    const updatedData = { ...formData, ...form };
    setFormData(updatedData);
    navigate("/medical-history");
  };

  return (
    <Fade in={true} timeout={400}>
      <div className="insurance-info-page">
        <Header
          title="Insurance Details"
          subtitle="Add your insurance information for seamless coverage and claims processing."
        />

        <form onSubmit={handleSubmit} className="info-form">
          <div className="form-stack">
            <CustomSelect
              label="Insurance Provider"
              name="insuranceProvider"
              value={form.insuranceProvider}
              onChange={handleChange}
              placeholder="Select insurance provider (Optional)"
              options={insuranceProviders}
              icon={BusinessIcon}
            />

            <CustomInput
              label="Customer ID / Policy Number"
              name="policyNumber"
              value={form.policyNumber}
              onChange={handleChange}
              placeholder="Enter Customer ID or Policy Number (Optional)"
              icon={CreditCardIcon}
            />

            <CustomFileUploader
              label="Upload Insurance Card (Optional)"
              value={null}
              onChange={handleFileChange}
              infoText="Make sure the card is clear and all details are visible"
              multiple={true}
            />

            {form.insuranceCard && form.insuranceCard.length > 0 && (
              <div className="upload-cards-container">
                {form.insuranceCard.map((cardFile, idx) => (
                  <UploadCard
                    key={idx}
                    file={cardFile}
                    onRemove={() => {
                      const removedFile = form.insuranceCard[idx];
                      if (removedFile) {
                        console.log("[File Removed] Name: " + removedFile.name + ", Type: " + removedFile.type + ", Size: " + removedFile.size + " bytes");
                      }
                      setForm((prev) => {
                        const updated = prev.insuranceCard.filter((_, i) => i !== idx);
                        return {
                          ...prev,
                          insuranceCard: updated
                        };
                      });
                    }}
                  />
                ))}
              </div>
            )}
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
                Upload Health Records
              </CustomButton>
            </div>
          </div>
        </form>
      </div>
    </Fade>
  );
};

export default InsuranceInformation;