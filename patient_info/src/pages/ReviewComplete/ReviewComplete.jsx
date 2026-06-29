import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import RefreshIcon from "@mui/icons-material/Refresh";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

import Header from "../../components/Header/Header";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomInput from "../../components/CustomInput/CustomInput";
import { useProgress, calculateRegistrationProgress } from "../../context/ProgressContext";
import { useForm } from "../../context/FormProvider";
import "./ReviewComplete.scss";

// Mock list of already taken patient unique IDs
const TAKEN_IDS = ["PAT123456", "PATABC123", "PATXYZ789", "PAT7GH381", "PATAAA111", "PAT7G3H81"];

// ==========================================
// Component: ReviewComplete
// Description: Renders the sixth step of registration with Unique ID creation and password set
// ==========================================
const ReviewComplete = () => {
  const navigate = useNavigate();
  const { setProgress } = useProgress();
  const { formData, setFormData } = useForm();

  // Helper to generate a random 6-character suffix with exactly 3 letters and 3 numbers in a shuffled order
  const generateRandomSuffix = () => {
    const lettersStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digitsStr = "0123456789";
    
    // Choose 3 random letters
    const chosenLetters = [
      lettersStr.charAt(Math.floor(Math.random() * 26)),
      lettersStr.charAt(Math.floor(Math.random() * 26)),
      lettersStr.charAt(Math.floor(Math.random() * 26))
    ];
    
    // Choose 3 random digits
    const chosenDigits = [
      digitsStr.charAt(Math.floor(Math.random() * 10)),
      digitsStr.charAt(Math.floor(Math.random() * 10)),
      digitsStr.charAt(Math.floor(Math.random() * 10))
    ];
    
    // Combine
    const combined = [...chosenLetters, ...chosenDigits];
    
    // Shuffle (Fisher-Yates)
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    
    return combined;
  };

  // -------------------------------------------------------------
  // States: Patient Unique ID
  // -------------------------------------------------------------
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [idError, setIdError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // 6 input refs for auto-focus navigation
  const digitRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  // -------------------------------------------------------------
  // States: Passwords
  // -------------------------------------------------------------
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // -------------------------------------------------------------
  // Effects & Lifecycles
  // -------------------------------------------------------------
  useEffect(() => {
    const localForm = { digits, password, confirmPassword };
    setProgress(calculateRegistrationProgress(formData, localForm, "ReviewComplete"));
  }, [formData, digits, password, confirmPassword, setProgress]);

  // Suggestions generator starting with "PAT" followed by 3 letters + 3 numbers in random order
  // Suggestions are based on the user's partially entered pattern
  const generateSuggestions = (currentDigits) => {
    const lettersStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digitsStr = "0123456789";
    const list = new Set();
    
    const filledDigits = (currentDigits || []).filter(d => d !== "");
    if (filledDigits.length === 0) {
      return [];
    }

    const currentId = ("PAT" + currentDigits.join("")).toUpperCase();
    
    // Extract letters and numbers entered by the user
    const typedLetters = filledDigits.filter(c => /[A-Za-z]/.test(c)).map(c => c.toUpperCase());
    const typedNumbers = filledDigits.filter(c => /\d/.test(c));

    // Pad letters pool to 3 characters
    const lettersPool = [...typedLetters];
    while (lettersPool.length < 3) {
      lettersPool.push(lettersStr.charAt(Math.floor(Math.random() * 26)));
    }
    const finalLetters = lettersPool.slice(0, 3);

    // Pad numbers pool to 3 characters
    const numbersPool = [...typedNumbers];
    while (numbersPool.length < 3) {
      numbersPool.push(digitsStr.charAt(Math.floor(Math.random() * 10)));
    }
    const finalNumbers = numbersPool.slice(0, 3);

    // Pool containing exactly 3 letters and 3 numbers
    const characterPool = [...finalLetters, ...finalNumbers];

    let attempts = 0;
    while (list.size < 7 && attempts < 500) {
      attempts++;
      
      // Shuffle characterPool to get a valid permutation
      const shuffled = [...characterPool];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      const candidate = "PAT" + shuffled.join("");
      if (!TAKEN_IDS.includes(candidate) && candidate !== currentId) {
        list.add(candidate);
      }
    }
    
    return Array.from(list);
  };

  // Update suggestions whenever digits change (pattern-based permutations)
  useEffect(() => {
    const hasInput = digits.some(d => d !== "");
    if (!hasInput) {
      setSuggestions([]);
    } else {
      setSuggestions(generateSuggestions(digits));
    }
  }, [digits]);

  // Validate entered Unique ID against format rules and taken list
  useEffect(() => {
    const fullSuffix = digits.join("");
    if (digits.some(d => d === "")) {
      setIdError(""); // incomplete ID, don't show validation error yet
      return;
    }

    // Count letters and numbers in the suffix
    const lettersCount = (fullSuffix.match(/[A-Z]/gi) || []).length;
    const numbersCount = (fullSuffix.match(/\d/g) || []).length;

    if (lettersCount !== 3 || numbersCount !== 3) {
      setIdError("ID must contain exactly 3 letters and 3 numbers.");
      return;
    }

    const fullId = "PAT" + fullSuffix.toUpperCase();
    if (TAKEN_IDS.includes(fullId)) {
      setIdError("This ID is already taken.");
    } else {
      setIdError("");
    }
  }, [digits]);

  // -------------------------------------------------------------
  // Handlers: Unique ID
  // -------------------------------------------------------------
  const handleDigitChange = (index, e) => {
    // Allow any letter or number (uppercase)
    let val = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

    if (val.length === 0) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      return;
    }

    const char = val.charAt(val.length - 1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-focus next input box
    if (index < 5) {
      digitRefs[index + 1].current?.focus();
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index]) {
      // Focus previous input on backspace
      if (index > 0) {
        digitRefs[index - 1].current?.focus();
      }
    }
  };

  const handleRefreshSuggestions = () => {
    if (digits.some(d => d !== "")) {
      setSuggestions(generateSuggestions(digits));
    }
  };

  const handleSelectSuggestion = (sug) => {
    // sug is like "PATXYZ456", suffix starts at index 3
    const suffixChars = sug.substring(3).split("");
    setDigits(suffixChars);
  };

  // -------------------------------------------------------------
  // Handlers: Password Strength & Rules
  // -------------------------------------------------------------
  const passwordRules = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numberOrSymbol: /[\d\W_]/.test(password)
  };

  const isPasswordDirty = password.length > 0;
  const metRulesCount = Object.values(passwordRules).filter(Boolean).length;

  let strengthLabel = "Weak";
  let strengthClass = "weak";
  if (metRulesCount >= 4) {
    strengthLabel = "Very Good";
    strengthClass = "strong";
  } else if (metRulesCount === 3) {
    strengthLabel = "Medium";
    strengthClass = "medium";
  }

  const confirmPasswordError = (password && confirmPassword !== password)
    ? "Confirm password should be same as entered password!"
    : "";

  const isFormInvalid =
    digits.some(d => d === "") ||
    !!idError ||
    metRulesCount < 4 ||
    password !== confirmPassword;

  // -------------------------------------------------------------
  // Handlers: Form Submission
  // -------------------------------------------------------------
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (isFormInvalid) return;

    setProgress(100);

    const finalId = ("PAT" + digits.join("")).toUpperCase();
    
    // Save credentials to form context
    setFormData((prev) => ({
      ...prev,
      patientUniqueId: finalId,
      password: password
    }));

    console.log("=== Final Form Submission ===");
    console.log("Full Name: " + (formData.name || "N/A"));
    console.log("Patient Unique ID: " + finalId);
    console.log("Date of Birth: " + (formData.dob || "N/A"));
    console.log("Phone Number: " + (formData.mobile || "N/A"));
    console.log("Email Address: " + (formData.email || "N/A"));
    console.log("Gender: " + (formData.gender || "N/A"));
    console.log("Blood Group: " + (formData.bloodGroup || "N/A"));
    console.log("State: " + (formData.state || "N/A"));
    console.log("City: " + (formData.city || "N/A"));
    console.log("Height: " + (formData.height ? (formData.height + " " + formData.heightUnit) : "N/A"));
    console.log("Weight: " + (formData.weight ? (formData.weight + " " + formData.weightUnit) : "N/A"));
    console.log("Blood Pressure: " + (formData.bloodPressure || "N/A"));
    console.log("Blood Sugar: " + (formData.bloodSugar || "N/A"));
    console.log("Emergency Relationship: " + (formData.emergencyRelationship || "N/A"));
    console.log("Emergency Number: " + (formData.emergencyNumber || "N/A"));
    console.log("Allergies: " + (formData.allergies || "None"));
    console.log("Current Medications: " + (formData.currentMedications || "None"));
    console.log("Existing Conditions: " + (formData.existingConditions || "None"));
    console.log("Previous Surgeries: " + (formData.previousSurgeries || "None"));
    console.log("Insurance Provider: " + (formData.insuranceProvider || "N/A"));
    console.log("Policy Number: " + (formData.policyNumber || "N/A"));
    console.log("Insurance Card: " + (formData.insuranceCard && formData.insuranceCard.length > 0 ? formData.insuranceCard.map(c => c.name).join(", ") : "N/A"));
    console.log("Health Records: " + (formData.healthRecords && formData.healthRecords.length > 0 ? formData.healthRecords.map(r => r.name).join(", ") : "N/A"));
    console.log("=========================================");

    navigate("/account-created");
  };

  const handleBack = () => {
    navigate("/health-records");
  };

  const renderRule = (label, isMet) => {
    if (!isPasswordDirty) {
      return (
        <div className="rule-item default">
          <CheckCircleIcon className="rule-icon default-icon" />
          <span className="rule-text">{label}</span>
        </div>
      );
    }
    if (isMet) {
      return (
        <div className="rule-item satisfied">
          <CheckCircleIcon className="rule-icon satisfied-icon" />
          <span className="rule-text">{label}</span>
        </div>
      );
    } else {
      return (
        <div className="rule-item unsatisfied">
          <CloseIcon className="rule-icon unsatisfied-icon" />
          <span className="rule-text">{label}</span>
        </div>
      );
    }
  };

  return (
    <Fade in={true} timeout={400}>
      <div className="review-complete-page">
        <Header
          title="Review & Complete"
          subtitle="Configure your login credentials to securely manage your healthcare information."
        />

        <form onSubmit={handleFinalSubmit} className="info-form">
          {/* ========================================== */}
          {/* Section: Create Your Unique Patient ID */}
          {/* ========================================== */}
          <div className="form-section-container">
            <div className="id-heading-block">
              <h2 className="section-title">Create Your Unique Patient ID</h2>
              <p className="section-subtitle">
                Your MediConnect ID is a unique username that lets you securely sign in and access appointments, reports, prescriptions, and healthcare services.
              </p>
            </div>

            <div className="id-fields-container">
              <div className="id-input-section">
                <label className="id-input-label">MediConnect ID</label>
                
                <div className="id-input-row">
                  <div className={`id-input-group ${idError ? "has-error" : ""}`}>
                    <div className="id-prefix-box-fixed">PAT</div>
                    <div className="id-digits-container">
                      {digits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={digitRefs[idx]}
                          type="text"
                          className="id-digit-box"
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e)}
                          onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                          placeholder=""
                          maxLength={1}
                        />
                      ))}
                    </div>
                  </div>

                  {idError ? (
                    <div className="id-status-message error">
                      <span>✕ {idError}</span>
                    </div>
                  ) : (
                    digits.every(d => d !== "") && (
                      <div className="id-status-message success">
                        <span>✓ PAT (MediConnect ID) is available</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Suggestions Block (displayed conditionally based on user input presence) */}
              {digits.some((d) => d !== "") && (
                <div className="suggestions-section fade-in">
                  <div className="suggestions-header">
                    <span className="suggestions-title">Suggestions</span>
                    <button
                      type="button"
                      className="btn-refresh"
                      onClick={handleRefreshSuggestions}
                    >
                      <RefreshIcon className="refresh-icon" />
                      Refresh
                    </button>
                  </div>

                  <div className="suggestions-list">
                    {suggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        className="suggestion-badge"
                        onClick={() => handleSelectSuggestion(sug)}
                      >
                        {sug.substring(0, 3)}-{sug.substring(3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* Section: Create a strong password */}
          {/* ========================================== */}
          <div className="form-section-container password-section">
            <div className="id-heading-block">
              <h2 className="section-title">Create a strong password</h2>
              <p className="section-subtitle">
                Create a strong password with a mix of letters, numbers and symbols
              </p>
            </div>

            <div className="form-grid">
              <div className="form-grid-item">
                <CustomInput
                  label="Create New Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  icon={LockIcon}
                  suffix=" "
                  suffixIcon={showPassword ? VisibilityIcon : VisibilityOffIcon}
                  onSuffixClick={() => setShowPassword(!showPassword)}
                />
              </div>

              <div className="form-grid-item">
                <CustomInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password again"
                  icon={LockIcon}
                  suffix=" "
                  suffixIcon={showConfirmPassword ? VisibilityIcon : VisibilityOffIcon}
                  onSuffixClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  error={confirmPasswordError}
                />
              </div>

              {/* Checklist Block (Frame 1000005864) */}
              <div className="checklist-block">
                {/* Password Strength Bar */}
                {password && (
                  <div className="password-strength-container fade-in">
                    <div className="strength-bar-track">
                      <div className={`strength-bar-fill ${strengthClass}`} />
                    </div>
                    <span className={`strength-label ${strengthClass}`}>{strengthLabel}</span>
                  </div>
                )}

                {/* Checklist of rules */}
                <div className="rules-checklist">
                  <h3 className="checklist-title">Should Contain:</h3>
                  <div className="rules-stack">
                    {renderRule("At least 8 Characters", passwordRules.length)}
                    {renderRule("At least one small letter", passwordRules.lowercase)}
                    {renderRule("At least one capital letter", passwordRules.uppercase)}
                    {renderRule("At least one number or symbol", passwordRules.numberOrSymbol)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="btn-back" onClick={handleBack}>
              Go Back
            </button>
            <CustomButton type="submit" disabled={isFormInvalid}>
              Create Profile
            </CustomButton>
          </div>
        </form>
      </div>
    </Fade>
  );
};

export default ReviewComplete;