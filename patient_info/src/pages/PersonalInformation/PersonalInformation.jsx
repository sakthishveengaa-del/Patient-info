
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";

import Header from "../../components/Header/Header";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useProgress, calculateRegistrationProgress } from "../../context/ProgressContext";
import { useForm } from "../../context/FormProvider";
import { LeftColumn } from "./components/LeftColumn";
import { RightColumn } from "./components/RightColumn";
import "./PersonalInformation.scss";

import { stateCityMap } from "./data/personalInfoConstants";
import { calculatePersonalInfoError } from "./data/personalInfoValidation";



const PersonalInformation = () => {
  const navigate = useNavigate();
  
  const { setProgress } = useProgress();
  
  const { formData, setFormData } = useForm();

  const [form, setForm] = useState({
    name: formData.name || "",
    dob: formData.dob || "",
    mobile: formData.mobile || "", 
    email: formData.email || "",
    gender: formData.gender || "",
    bloodGroup: formData.bloodGroup || "",
    state: formData.state || "",
    city: formData.city || ""
  });

  const [errors, setErrors] = useState({});
  
  const [cities, setCities] = useState([]);
  
  const [touched, setTouched] = useState({});


  useEffect(() => {
    setProgress(calculateRegistrationProgress(formData, form, "PersonalInformation"));
  }, [formData, form, setProgress]);

  useEffect(() => {
    if (form.state) {
      const matchedCities = stateCityMap[form.state] || [];
      setCities(matchedCities);
      
      if (touched.state) {
        setForm((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setCities([]);
    }
  }, [form.state]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    
    if (name === "mobile") {
      finalValue = value.replace(/\D/g, "").slice(0, 10);
    }
    
    setForm((prev) => ({ ...prev, [name]: finalValue }));
    
    console.log("[Form Input Change] Field: " + name + ", Value: " + finalValue);
    
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    validateField(name);
  };

  const validateField = (name) => {
    const errorMsg = calculatePersonalInfoError(name, form[name]);
    
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    
    return !errorMsg;
  };
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

  const handleNext = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setFormData((prev) => ({ ...prev, ...form }));
      
      console.log("=== Personal Information Form Submission ===");
      console.log("Full Name: " + form.name);
      console.log("Date of Birth: " + form.dob);
      console.log("Phone Number: " + form.mobile);
      console.log("Email Address: " + (form.email || "N/A (Optional)"));
      console.log("Gender: " + form.gender);
      console.log("Blood Group: " + form.bloodGroup);
      console.log("State: " + form.state);
      console.log("City: " + form.city);
      console.log("=========================================");
      
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