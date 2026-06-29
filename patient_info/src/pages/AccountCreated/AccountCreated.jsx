import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";
import VerifiedIcon from "@mui/icons-material/Verified";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import CustomButton from "../../components/CustomButton/CustomButton";
import { useProgress } from "../../context/ProgressContext";
import { useForm } from "../../context/FormProvider";
import logo from "../../assets/logo.png";
import "./AccountCreated.scss";


// ==========================================
// Component: AccountCreated
// Description: Renders the final success page when the account registration is complete
// ==========================================
const AccountCreated = () => {
  const navigate = useNavigate();
  // Progress Context: sets current global progress percentage (starts at 100% complete for this step)
  const { setProgress } = useProgress();
  const { formData, setFormData } = useForm();
  
  // Local state for copy to clipboard notification feedback
  const [copied, setCopied] = useState(false);

  // -------------------------------------------------------------
  // Effect: Sets progress baseline to 100% complete when page loads
  // -------------------------------------------------------------
  useEffect(() => {
    setProgress(100);
  }, [setProgress]);

  // Fallbacks if form context is empty (e.g. direct load)
  const fullId = formData.patientUniqueId || "PAT7N6S93";
  const userEmail = formData.email || "abcd123@gmail.com";

  // Split suffix characters (e.g., PAT7N6S93 -> suffix: 7N6S93)
  const suffix = fullId.startsWith("PAT-")
    ? fullId.substring(4)
    : (fullId.startsWith("PAT") ? fullId.substring(3) : fullId);

  const suffixChars = suffix.split("");

  // Copy unique ID to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(fullId);
    setCopied(true);
    console.log("=== Copied Patient ID: " + fullId + " ===");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewProfile = () => {
    console.log("=== View Profile Clicked ===");
  };

  const handleGoToDashboard = () => {
    console.log("=== Go to Dashboard Clicked ===");
    setFormData({});
    setProgress(0);
    navigate("/personal-information");
  };

  return (
    <Fade in={true} timeout={400}>
      <div className="account-created-container">
        <div className="created-content-wrapper">
          {/* Logo container sitting above the card */}
          <div className="created-logo-wrapper">
            <img src={logo} alt="MediConnect Logo" className="logo-img" />
          </div>

          {/* White Card Frame 1109 */}
          <div className="success-card-frame">
            {/* material-symbols:verified-rounded */}
            <div className="success-badge-wrapper">
              <VerifiedIcon className="success-badge-icon" />
            </div>

            {/* Frame 1000005854 */}
            <div className="success-message-block">
              <h1 className="success-heading-title">Account Created <br /> Successfully!</h1>
              <p className="success-heading-subtitle">
                Your patient account has been created successfully. You can now access your healthcare dashboard and manage your records securely.
              </p>
            </div>

            {/* InputField Unique ID block */}
            <div className="unique-id-input-field">
              <label className="unique-id-label">Unique ID</label>
              <div className="unique-id-badge-box" onClick={handleCopy} title="Click to copy Patient ID">
                <div className="prefix-box-pat">PAT</div>
                <div className="suffix-chars-box">
                  <div className="chars-row">
                    {suffixChars.map((char, index) => (
                      <span key={index} className="suffix-char-item">{char}</span>
                    ))}
                  </div>
                  <div className="copy-icon-btn">
                    <ContentCopyIcon className="copy-icon" style={{ fontSize: "16px", color: copied ? "#096B58" : "#838383" }} />
                  </div>
                </div>
              </div>
              {copied && <span className="copied-toast">Copied!</span>}
              <p className="email-notify-text">
                Your unique ID has also been sent to <br /> <span className="email-highlight">{userEmail}</span>
              </p>
            </div>

            {/* Note Card Frame 1000005849 */}
            <div className="note-card-frame">
              <span className="note-label">Note</span>
              <p className="note-text">
                Use this ID or your registered phone number to securely access your healthcare workspace.
              </p>
            </div>

            {/* Action buttons Frame 1000005847 */}
            <div className="actions-button-row">
              <button type="button" className="btn-view-profile-custom" onClick={handleViewProfile}>
                View Profile
              </button>
              <CustomButton type="button" className="btn-dashboard-custom" onClick={handleGoToDashboard}>
                Go to Dashboard
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default AccountCreated;