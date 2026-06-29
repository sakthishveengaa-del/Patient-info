import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";

import Header from "../../components/Header/Header";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useProgress, calculateRegistrationProgress } from "../../context/ProgressContext";
import { useForm } from "../../context/FormProvider";
import { LeftColumn } from "./components/LeftColumn";
import { RightColumn } from "./components/RightColumn";
import { calculateAdditionalInfoError } from "./data/additionalInfoValidation";
import "./AdditionalInformation.scss";

// ==========================================
// Component: AdditionalInformation
// Description: Renders the second step of registration (vitals, habits, emergency contact)
// ==========================================
const AdditionalInformation = () => {
  const navigate = useNavigate();
  const { setProgress } = useProgress();
  const { formData, setFormData } = useForm();

  // Local State: tracks values entered in input fields
  const [form, setForm] = useState({
    height: formData.height || "",
    heightUnit: formData.heightUnit || "cm",
    weight: formData.weight || "",
    weightUnit: formData.weightUnit || "kg",
    bloodPressure: formData.bloodPressure || "",
    bloodSugar: formData.bloodSugar || "",
    activityLevel: formData.activityLevel || "",
    dietaryPreference: formData.dietaryPreference || "",
    smokingStatus: formData.smokingStatus || "",
    alcoholConsumption: formData.alcoholConsumption || "",
    emergencyRelationship: formData.emergencyRelationship || "",
    emergencyNumber: formData.emergencyNumber || ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Effect: Calculate progress
  useEffect(() => {
    setProgress(calculateRegistrationProgress(formData, form, "AdditionalInformation"));
  }, [formData, form, setProgress]);

  // Handler: Runs whenever any input or dropdown value changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "emergencyNumber") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: finalValue };
      if (name === "heightUnit") validateField("height", updatedForm);
      if (name === "weightUnit") validateField("weight", updatedForm);
      return updatedForm;
    });

    // Log user input change
    console.log("[Form Input Change] Field: " + name + ", Value: " + finalValue);

    setTouched((prev) => {
      const updatedTouched = { ...prev, [name]: true };
      if (name === "heightUnit") updatedTouched.height = true;
      if (name === "weightUnit") updatedTouched.weight = true;
      return updatedTouched;
    });

    if (name !== "heightUnit" && name !== "weightUnit" && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handler: Runs when user clicks out of a field
  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name);
  };

  // Helper: Validates a single form field by name
  const validateField = (name, currentForm = form) => {
    const value = currentForm[name];
    const errorMsg = calculateAdditionalInfoError(name, value, currentForm);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return !errorMsg;
  };

  // Helper: Validates all fields when submitting
  const validateForm = () => {
    const fieldsToValidate = [
      "height", "weight", "bloodPressure", "bloodSugar",
      "emergencyRelationship", "emergencyNumber"
    ];
    let isAllValid = true;
    fieldsToValidate.forEach((field) => {
      if (!validateField(field)) isAllValid = false;
    });
    return isAllValid;
  };

  // Helper: Enables submit button if emergency details are complete and error-free
  const isFormValid = () => {
    const hasErrors = Object.values(errors).some((err) => err && err !== "");
    const isRequiredFilled = 
      form.emergencyRelationship && form.emergencyRelationship.trim() !== "" &&
      form.emergencyNumber && form.emergencyNumber.trim().length === 10;
    return !hasErrors && isRequiredFilled;
  };

  // Handler: Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedData = { ...formData, ...form };
      setFormData(updatedData);
      
      console.log("=== Additional Information Form Submission ===");
      console.log("Height: " + form.height + " " + form.heightUnit);
      console.log("Weight: " + form.weight + " " + form.weightUnit);
      console.log("Blood Pressure: " + (form.bloodPressure || "N/A"));
      console.log("Blood Sugar: " + (form.bloodSugar || "N/A"));
      console.log("Activity Level: " + (form.activityLevel || "N/A"));
      console.log("Dietary Preference: " + (form.dietaryPreference || "N/A"));
      console.log("Smoking Status: " + (form.smokingStatus || "N/A"));
      console.log("Alcohol Consumption: " + (form.alcoholConsumption || "N/A"));
      console.log("Emergency Relationship: " + form.emergencyRelationship);
      console.log("Emergency Number: " + form.emergencyNumber);
      console.log("===========================================");
      
      navigate("/medical-history");
    }
  };

  const handleSkip = () => {
    const updatedData = { ...formData, ...form };
    setFormData(updatedData);
    navigate("/medical-history");
  };

  const handleBack = () => {
    const updatedData = { ...formData, ...form };
    setFormData(updatedData);
    navigate("/personal-information");
  };

  return (
    <Fade in={true} timeout={400}>
      <div className="additional-info-page">
        <Header
          title="Additional Information"
          subtitle="Enhance your profile with optional details for a more personalized healthcare journey."
        />

        <form onSubmit={handleSubmit} className="info-form">
          <div className="form-grid">
            <LeftColumn
              form={form}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />

            <RightColumn
              form={form}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-skip" onClick={handleSkip}>
              Skip for now
            </button>
            
            <div className="right-actions">
              <button type="button" className="btn-back" onClick={handleBack}>
                Go Back
              </button>
              <CustomButton type="submit" disabled={!isFormValid()}>
                Add Medical History
              </CustomButton>
            </div>
          </div>
        </form>
      </div>
    </Fade>
  );
};

export default AdditionalInformation;