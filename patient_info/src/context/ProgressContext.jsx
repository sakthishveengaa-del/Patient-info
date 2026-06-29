/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);

  return (
    <ProgressContext.Provider value={{ progress, setProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);

export const calculateRegistrationProgress = (formData, localForm = {}, currentPage = "") => {
  // Helper to get field value (either from localForm if we are on the page, or from formData)
  const getVal = (fieldName, pageName) => {
    if (currentPage === pageName && localForm && fieldName in localForm) {
      return localForm[fieldName];
    }
    return formData[fieldName];
  };

  // 1. Personal Information (allocated: 10%)
  // 6 required fields: name, dob, gender, bloodGroup, state, city
  let page1Count = 0;
  const nameVal = getVal("name", "PersonalInformation");
  if (nameVal && nameVal.trim().length >= 3) page1Count++;
  const dobVal = getVal("dob", "PersonalInformation");
  if (dobVal && dobVal !== "") page1Count++;
  const genderVal = getVal("gender", "PersonalInformation");
  if (genderVal && genderVal !== "") page1Count++;
  const bloodGroupVal = getVal("bloodGroup", "PersonalInformation");
  if (bloodGroupVal && bloodGroupVal !== "") page1Count++;
  const stateVal = getVal("state", "PersonalInformation");
  if (stateVal && stateVal !== "") page1Count++;
  const cityVal = getVal("city", "PersonalInformation");
  if (cityVal && cityVal !== "") page1Count++;
  const page1Progress = (page1Count / 6) * 10;

  // 2. Additional Information (allocated: 20%)
  // 2 required fields: emergencyRelationship, emergencyNumber
  let page2Count = 0;
  const emergencyRelationshipVal = getVal("emergencyRelationship", "AdditionalInformation");
  if (emergencyRelationshipVal && emergencyRelationshipVal.trim() !== "") page2Count++;
  const emergencyNumberVal = getVal("emergencyNumber", "AdditionalInformation");
  if (emergencyNumberVal && emergencyNumberVal.replace(/\D/g, "").length === 10) page2Count++;
  const page2Progress = (page2Count / 2) * 20;

  // 3. Medical History (allocated: 10%)
  // 4 optional fields: allergies, currentMedications, existingConditions, previousSurgeries
  let page3Count = 0;
  const allergiesVal = getVal("allergies", "MedicalHistory");
  if (allergiesVal && allergiesVal.trim() !== "") page3Count++;
  const currentMedicationsVal = getVal("currentMedications", "MedicalHistory");
  if (currentMedicationsVal && currentMedicationsVal.trim() !== "") page3Count++;
  const existingConditionsVal = getVal("existingConditions", "MedicalHistory");
  if (existingConditionsVal && existingConditionsVal.trim() !== "") page3Count++;
  const previousSurgeriesVal = getVal("previousSurgeries", "MedicalHistory");
  if (previousSurgeriesVal && previousSurgeriesVal.trim() !== "") page3Count++;
  const page3Progress = (page3Count / 4) * 10;

  // 4. Insurance Details (allocated: 20%)
  // 3 optional fields: insuranceProvider, policyNumber, insuranceCard
  let page4Count = 0;
  const insuranceProviderVal = getVal("insuranceProvider", "InsuranceInformation");
  if (insuranceProviderVal && insuranceProviderVal.trim() !== "") page4Count++;
  const policyNumberVal = getVal("policyNumber", "InsuranceInformation");
  if (policyNumberVal && policyNumberVal.trim() !== "") page4Count++;
  const insuranceCardVal = getVal("insuranceCard", "InsuranceInformation") || [];
  if (insuranceCardVal && insuranceCardVal.length > 0) page4Count++;
  const page4Progress = (page4Count / 3) * 20;

  // 5. Upload Health Records (allocated: 15%)
  // 1 optional field: healthRecords array
  let page5Count = 0;
  const healthRecordsVal = getVal("healthRecords", "HealthRecords") || [];
  if (healthRecordsVal && healthRecordsVal.length > 0) page5Count++;
  const page5Progress = page5Count * 15;

  // 6. Review & Complete (allocated: 15% -> brings it to 90%)
  // 2 required fields: patientUniqueId, password
  let page6Count = 0;
  
  // Patient ID check
  if (currentPage === "ReviewComplete") {
    const digits = localForm.digits || [];
    if (digits.every(d => d !== "")) {
      const fullSuffix = digits.join("");
      const lettersCount = (fullSuffix.match(/[A-Z]/gi) || []).length;
      const numbersCount = (fullSuffix.match(/\d/g) || []).length;
      const fullId = "PAT" + fullSuffix.toUpperCase();
      const TAKEN_IDS = ["PAT123456", "PATABC123", "PATXYZ789", "PAT7GH381", "PATAAA111", "PAT7G3H81"];
      if (lettersCount === 3 && numbersCount === 3 && !TAKEN_IDS.includes(fullId)) {
        page6Count++;
      }
    }
  } else {
    const idVal = formData.patientUniqueId;
    if (idVal) {
      const suffix = idVal.startsWith("PAT-")
        ? idVal.substring(4)
        : (idVal.startsWith("PAT") ? idVal.substring(3) : idVal);
      const lettersCount = (suffix.match(/[A-Z]/gi) || []).length;
      const numbersCount = (suffix.match(/\d/g) || []).length;
      const TAKEN_IDS = ["PAT123456", "PATABC123", "PATXYZ789", "PAT7GH381", "PATAAA111", "PAT7G3H81"];
      if (suffix.length === 6 && lettersCount === 3 && numbersCount === 3 && !TAKEN_IDS.includes(idVal)) {
        page6Count++;
      }
    }
  }

  // Password check
  if (currentPage === "ReviewComplete") {
    const pass = localForm.password || "";
    const confirm = localForm.confirmPassword || "";
    const rules = {
      length: pass.length >= 8,
      lowercase: /[a-z]/.test(pass),
      uppercase: /[A-Z]/.test(pass),
      numberOrSymbol: /[\d\W_]/.test(pass)
    };
    const isStrengthValid = Object.values(rules).every(Boolean);
    if (isStrengthValid && pass === confirm) {
      page6Count++;
    }
  } else {
    const passVal = formData.password;
    if (passVal) {
      const rules = {
        length: passVal.length >= 8,
        lowercase: /[a-z]/.test(passVal),
        uppercase: /[A-Z]/.test(passVal),
        numberOrSymbol: /[\d\W_]/.test(passVal)
      };
      const isStrengthValid = Object.values(rules).every(Boolean);
      if (isStrengthValid) {
        page6Count++;
      }
    }
  }
  const page6Progress = (page6Count / 2) * 15;

  let progress;

  if (currentPage === "PersonalInformation") {
    progress = page1Progress;
  } else if (currentPage === "AdditionalInformation") {
    progress = 10 + page2Progress;
  } else if (currentPage === "MedicalHistory") {
    progress = 10 + 20 + page3Progress;
  } else if (currentPage === "InsuranceInformation") {
    progress = 10 + 20 + 10 + page4Progress;
  } else if (currentPage === "HealthRecords") {
    progress = 10 + 20 + 10 + 20 + page5Progress;
  } else if (currentPage === "ReviewComplete") {
    progress = 10 + 20 + 10 + 20 + 15 + page6Progress;
  } else if (currentPage === "AccountCreated") {
    progress = 100;
  } else {
    progress = page1Progress + page2Progress + page3Progress + page4Progress + page5Progress + page6Progress;
  }

  return Math.round(progress);
};