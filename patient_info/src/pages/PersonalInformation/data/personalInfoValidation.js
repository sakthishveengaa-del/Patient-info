// Helper: Computes the validation error message for any field on the Personal Information page.
// Returns an empty string if the field is valid.
export const calculatePersonalInfoError = (name, value) => {
  let errorMsg = "";

  // 1. Required fields check
  const requiredFields = ["name", "dob", "gender", "bloodGroup", "state", "city"];
  if (requiredFields.includes(name)) {
    if (!value || value.trim() === "") {
      const readableNames = {
        name: "Full Name",
        dob: "Date of Birth",
        gender: "Gender",
        bloodGroup: "Blood Group",
        state: "State",
        city: "Current City"
      };
      const displayName = readableNames[name] || name;
      errorMsg = `${displayName} is required`;
    }
  }

  // 2. Full Name minimum length validation
  if (name === "name" && value && value.trim().length < 3) {
    errorMsg = "Full Name must be at least 3 characters";
  }

  // 3. Email address format validation
  if (name === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
    errorMsg = "Please enter a valid email address";
  }

  // 4. Phone number length validation
  if (name === "mobile" && value && value.trim() !== "") {
    if (value.length < 10) {
      errorMsg = "Mobile number must be exactly 10 digits";
    }
  }

  return errorMsg;
};
