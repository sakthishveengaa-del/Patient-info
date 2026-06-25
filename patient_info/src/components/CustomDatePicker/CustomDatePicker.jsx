/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CakeIcon from "@mui/icons-material/Cake";
import CustomInput from "../CustomInput/CustomInput";


// ==========================================
// Component: CustomDatePicker
// Description: Wrapper over CustomInput that displays a text placeholder (with cake/calendar icon)
//              and dynamically turns into a native date picker when clicked, focused, or containing a value
// ==========================================
const CustomDatePicker = ({ placeholder, onFocus, onBlur, value, ...props }) => {
  // Local State: tracks whether the input element has focus
  const [isFocused, setIsFocused] = useState(false);
  
  // Local State: switches the native html input type between 'date' and 'text'
  const [inputType, setInputType] = useState(value ? "date" : "text");

  // -------------------------------------------------------------
  // Effect: Synchronize the input type whenever focus or value changes
  // -------------------------------------------------------------
  useEffect(() => {
    if (value) {
      // If there is a selected value, we MUST use 'date' type so the date is readable
      setInputType("date");
    } else if (!isFocused) {
      // If there is no value and user clicked away, show 'text' type to display the placeholder
      setInputType("text");
    }
  }, [value, isFocused]);

  return (
    <CustomInput
      type={inputType}
      value={value}
      // Show placeholder only when in text mode
      placeholder={inputType === "text" ? placeholder : ""}
      // Toggle decorative icon: show CakeIcon if date selected, else CalendarTodayIcon
      icon={value ? CakeIcon : CalendarTodayIcon}
      onFocus={(e) => {
        setIsFocused(true);
        setInputType("date"); // switch immediately to date picker on focus
        if (onFocus) onFocus(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        // If the user did not select/enter any date, switch back to text type to show placeholder
        if (!e.target.value) {
          setInputType("text");
        }
        if (onBlur) onBlur(e);
      }}
      {...props}
    />
  );
};

export default CustomDatePicker;

