// state-city mapping for dropdown selection
export const stateCityMap = {
  TamilNadu: ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"],
  Kerala: ["Kochi", "Trivandrum", "Kozhikode"],
  Karnataka: ["Bangalore", "Mysore", "Mangalore"]
};

// State dropdown options (value maps to stateCityMap keys)
export const stateOptions = [
  { value: "TamilNadu", label: "Tamil Nadu" },
  { value: "Kerala", label: "Kerala" },
  { value: "Karnataka", label: "Karnataka" }
];

// Gender dropdown options
export const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];

// Blood Group dropdown options
export const bloodGroups = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-", "Don't Know"];
