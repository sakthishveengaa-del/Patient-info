/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";

import Header from "../../components/Header/Header";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useProgress } from "../../context/ProgressContext";
import { useForm } from "../../context/FormProvider";
import { LeftColumn } from "./components/LeftColumn";
import { RightColumn } from "./components/RightColumn";
import "./PersonalInformation.scss";

import { stateCityMap } from "./data/personalInfoConstants";
import { calculatePersonalInfoError } from "./data/personalInfoValidation";



// ==========================================
// Component: PersonalInformation
// Description: Renders the first step of registration (basic details, state, city)
// ==========================================
const PersonalInformation = () => {
  // Navigation hook to redirect between pages
  const navigate = useNavigate();
  
  // Progress Context: used to set the current global progress percentage (0 - 100)
  const { setProgress } = useProgress();
  
  // Form Context: stores global registration data across all steps
  const { formData, setFormData } = useForm();

  // Local State: tracks values entered in input fields of this page
  const [form, setForm] = useState({
    name: formData.name || "",
    dob: formData.dob || "",
    mobile: formData.mobile || "", // Pre-filled or empty input
    email: formData.email || "",
    gender: formData.gender || "",
    bloodGroup: formData.bloodGroup || "",
    state: formData.state || "",
    city: formData.city || ""
  });

  // Local State: stores validation error messages for each field
  const [errors, setErrors] = useState({});
  
  // Local State: stores list of cities to display in the dropdown (based on selected state)
  const [cities, setCities] = useState([]);
  
  // Local State: tracks if a field has been visited (focused and blurred) by the user
  const [touched, setTouched] = useState({});

  // -------------------------------------------------------------
  // Effect: Calculate completion progress for this step (up to 10% maximum)
  // -------------------------------------------------------------
  useEffect(() => {
    // List of user-editable fields for this page
    const progressFields = ["name", "dob", "email", "gender", "bloodGroup", "state", "city"];
    
    // Count how many fields are not empty
    const filledCount = progressFields.filter(field => {
      const fieldValue = form[field];
      return fieldValue && fieldValue.trim() !== "";
    }).length;
    
    // Convert count to percentage (0% to 10% for this page)
    const calculatedProgress = Math.round((filledCount / progressFields.length) * 10);
    setProgress(calculatedProgress);
  }, [form, setProgress]);

  // -------------------------------------------------------------
  // Effect: Dynamically update city options when the selected state changes
  // -------------------------------------------------------------
  useEffect(() => {
    if (form.state) {
      // Find cities from map or default to empty list
      const matchedCities = stateCityMap[form.state] || [];
      setCities(matchedCities);
      
      // Reset the city value only if the state was changed after initial load
      if (touched.state) {
        setForm((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setCities([]);
    }
  }, [form.state]);

  // -------------------------------------------------------------
  // Handler: Runs whenever any input or dropdown changes
  // -------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    
    // Special formatting for mobile number (only numbers, max 10 digits)
    if (name === "mobile") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }
    
    // Update local state with the new value
    setForm((prev) => ({ ...prev, [name]: finalValue }));
    
    // Mark this field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Clear validation error message for this field since the user changed it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // -------------------------------------------------------------
  // Handler: Runs when user clicks out of a field (blur event)
  // -------------------------------------------------------------
  const handleBlur = (name) => {
    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Run validation checks for this field
    validateField(name);
  };

  // -------------------------------------------------------------
  // Helper: Validates a single form field by name
  // -------------------------------------------------------------
  const validateField = (name) => {
    const errorMsg = calculatePersonalInfoError(name, form[name]);
    
    // Update validation error state
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    
    // Return true if there is no error message
    return !errorMsg;
  };

  // -------------------------------------------------------------
  // Helper: Validates all fields when user submits form
  // -------------------------------------------------------------
  const validateForm = () => {
    const fieldsToValidate = ["name", "dob", "gender", "bloodGroup", "state", "city", "email", "mobile"];
    let isAllValid = true;
    
    fieldsToValidate.forEach((field) => {
      const isValid = validateField(field);
      if (!isValid) {
        isAllValid = false;
      }
    });

    return isAllValid;
  };

  // -------------------------------------------------------------
  // Helper: Checks if the submit button should be enabled
  // -------------------------------------------------------------
  const isRequiredFieldsFilled = () => {
    return (
      form.name.trim().length >= 3 &&
      form.dob !== "" &&
      form.gender !== "" &&
      form.bloodGroup !== "" &&
      form.state !== "" &&
      form.city !== ""
    );
  };

  // -------------------------------------------------------------
  // Handler: Runs on form submission (Next button click)
  // -------------------------------------------------------------
  const handleNext = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Save local form state to the global context state
      setFormData((prev) => ({ ...prev, ...form }));
      
      // Log submission values for debugging/tracking
      console.log("=== Personal Information Form Submission ===");
      console.log("Full Name:", form.name);
      console.log("Date of Birth:", form.dob);
      console.log("Phone Number:", form.mobile);
      console.log("Email Address:", form.email || "N/A (Optional)");
      console.log("Gender:", form.gender);
      console.log("Blood Group:", form.bloodGroup);
      console.log("State:", form.state);
      console.log("City:", form.city);
      console.log("=========================================");
      console.log("Form Object Data:", form);
      
      // Navigate to the next registration step page
      navigate("/additional-information");
    }
  };

  return (
    <Fade in={true} timeout={400}>
      <div className="personal-info-page">
        <Header
          title="Personal Information"
          subtitle="Add your basic information to complete your profile and personalize your healthcare journey."
        />

        <form onSubmit={handleNext} className="info-form">
          <div className="form-grid">
            {/* Left Column */}
            <LeftColumn
              form={form}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />

            {/* Right Column */}
            <RightColumn
              form={form}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              cities={cities}
            />
          </div>

          {/* Warning Required Fields Banner */}
          <div className="banner-row">
            <div className="required-fields-banner">
              <span className="asterisk">*</span>
              <span className="banner-text">These fields are required!</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <CustomButton type="submit" disabled={!isRequiredFieldsFilled()}>
              Add Additional Information
            </CustomButton>
          </div>
        </form>
      </div>
    </Fade>
  );
};

export default PersonalInformation;