// Helper: Computes the validation error message for any field on the Additional Information page.
// Returns an empty string if the field is valid.
export const calculateAdditionalInfoError = (name, value, currentForm) => {
  let errorMsg = "";

  // 1. Required fields check (Emergency Contact details)
  if (name === "emergencyRelationship" || name === "emergencyNumber") {
    if (value === undefined || value === null || value.toString().trim() === "") {
      return name === "emergencyRelationship" 
        ? "Please select your relationship with emergency contact." 
        : "Error";
    }
  } else {
    // Optional fields: if empty, they are considered valid
    if (value === undefined || value === null || value.toString().trim() === "") {
      return "";
    }
  }

  // 2. Height range validation (cm vs ft)
  if (name === "height") {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      errorMsg = "Must be a valid positive number";
    } else if (currentForm.heightUnit === "cm") {
      if (numValue < 50 || numValue > 250) {
        errorMsg = "Height should be between 50 cm and 250 cm.";
      }
    } else if (currentForm.heightUnit === "ft") {
      if (numValue < 1.6 || numValue > 8.2) {
        errorMsg = "Height should be between 1.6 ft and 8.2 ft.";
      }
    }
  }

  // 3. Weight range validation (kg vs lb)
  if (name === "weight") {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      errorMsg = "Must be a valid positive number";
    } else if (currentForm.weightUnit === "kg") {
      if (numValue < 2 || numValue > 500) {
        errorMsg = "Weight should be between 2 kg and 500 kg.";
      }
    } else if (currentForm.weightUnit === "lb" || currentForm.weightUnit === "lbs") {
      if (numValue < 4.4 || numValue > 1102) {
        errorMsg = "Weight should be between 4.4 lb and 1102 lb.";
      }
    }
  }

  // 4. Blood Sugar validation (non-negative check)
  if (name === "bloodSugar") {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      errorMsg = "Blood sugar cannot be negative.";
    }
  }

  // 5. Blood Pressure validation (format check)
  if (name === "bloodPressure") {
    // Validates pattern systolic/diastolic, e.g. 120/80
    if (!/^\d{2,3}\/\d{2,3}$/.test(value)) {
      errorMsg = "Enter blood pressure in the format: 120/80 mmHg.";
    }
  }

  // 6. Emergency Contact Number validation
  if (name === "emergencyNumber") {
    if (value.length < 10) {
      errorMsg = "Emergency contact must be exactly 10 digits";
    }
  }

  return errorMsg;
};
