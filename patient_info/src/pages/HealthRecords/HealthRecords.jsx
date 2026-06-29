import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";
import Header from "../../components/Header/Header";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomFileUploader from "../../components/CustomFileUploader/CustomFileUploader";
import { UploadCard } from "../../components/UploadCard/UploadCard";
import { useProgress, calculateRegistrationProgress } from "../../context/ProgressContext";
import { useForm } from "../../context/FormProvider";
import { PillIcon, BeakerIcon, ScanIcon, DocIcon } from "./components/DocumentIcons";
import "./HealthRecords.scss";

// ==========================================
// Component: HealthRecords
// Description: Renders the Health Records page with uploader, supported documents, and navigation actions
// ==========================================
const HealthRecords = () => {
  const navigate = useNavigate();
  const { setProgress } = useProgress();
  const { formData, setFormData } = useForm();

  // Local state for uploaded health record files, initialized from context
  const [files, setFiles] = useState(formData.healthRecords || []);

  // Calculate progress dynamically
  useEffect(() => {
    setProgress(calculateRegistrationProgress(formData, { healthRecords: files }, "HealthRecords"));
  }, [formData, files, setProgress]);

  const handleFileChange = (newFiles) => {
    let updated;
    const filesArray = Array.isArray(newFiles) ? newFiles : (newFiles ? [newFiles] : []);
    
    // Log upload details
    filesArray.forEach((file) => {
      console.log("Name: " + file.name + ", Type: " + file.type + ", Size: " + file.size + " bytes");
    });

    if (Array.isArray(newFiles)) {
      updated = [...files, ...newFiles];
    } else if (newFiles) {
      updated = [...files, newFiles];
    }
    if (updated) {
      setFiles(updated);
      setFormData((prev) => ({
        ...prev,
        healthRecords: updated
      }));
    }
  };

  const handleRemoveFile = (index) => {
    const removedFile = files[index];
    if (removedFile) {
      console.log("[File Removed] Name: " + removedFile.name + ", Type: " + removedFile.type + ", Size: " + removedFile.size + " bytes");
    }

    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    setFormData((prev) => ({
      ...prev,
      healthRecords: updated
    }));
  };

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
          title="Upload Health Records"
          subtitle="Keep all your medical documents in one secure and convenient place."
        />

        <div className="info-form">
          <div className="form-stack">
            <CustomFileUploader
              label="Upload your health records"
              value={null}
              onChange={handleFileChange}
              multiple={true}
              maxSize={20 * 1024 * 1024} // 20MB
              maxSizeLabel="Max. 20MB"
              placeholderText="rag and drop your health records here, or"
              infoText=""
            />

            {files.length > 0 && (
              <div className="upload-cards-container">
                {files.map((file, idx) => (
                  <UploadCard
                    key={idx}
                    file={file}
                    onRemove={() => handleRemoveFile(idx)}
                  />
                ))}
              </div>
            )}

            {/* Supported Documents Section */}
            <div className="supported-docs-section">
              <div className="supported-title">Supported Documents</div>
              <div className="supported-list">
                <div className="supported-item">
                  <PillIcon className="supported-icon" />
                  <span>Prescription</span>
                </div>
                <div className="supported-item">
                  <BeakerIcon className="supported-icon" />
                  <span>Lab reports</span>
                </div>
                <div className="supported-item">
                  <ScanIcon className="supported-icon" />
                  <span>Scan</span>
                </div>
                <div className="supported-item">
                  <DocIcon className="supported-icon" />
                  <span>Discharge summary</span>
                </div>
              </div>
            </div>
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