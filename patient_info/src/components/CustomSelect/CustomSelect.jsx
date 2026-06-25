import { useState, useEffect, useRef } from "react";
import { KeyboardArrowDown } from "@mui/icons-material";
import "./CustomSelect.scss";


// ==========================================
// Component: CustomSelect
// Description: Custom select component designed to replace native dropdowns with accessible, search-free custom dropdown lists
// ==========================================
const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  icon: Icon,
  required,
  error,
  className = "",
  disabled,
  ...props
}) => {
  // Local State: tracks whether the select dropdown menu is open or closed
  const [isOpen, setIsOpen] = useState(false);
  
  // Reference: used to check if mouse clicks happen outside this component container
  const selectRef = useRef(null);

  // -------------------------------------------------------------
  // Effect: Close select menu if user clicks outside of it, and fire blur callback
  // -------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If select container exists and click target is NOT inside the component
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        if (isOpen) {
          setIsOpen(false);
          
          // Trigger field validation check (e.g. onBlur) if the dropdown was open
          if (props.onBlur) {
            props.onBlur();
          }
        }
      }
    };
    
    // Register mouse click listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup click listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, props]);

  // -------------------------------------------------------------
  // Handler: Toggles dropdown open/close state
  // -------------------------------------------------------------
  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  // -------------------------------------------------------------
  // Handler: Updates parent state with the selected option's value
  // -------------------------------------------------------------
  const handleSelectOption = (optValue) => {
    if (disabled) return;
    
    // Build a mock event object for parent onChange handler
    onChange({
      target: {
        name,
        value: optValue
      }
    });
    
    // Close dropdown
    setIsOpen(false);
  };

  // -------------------------------------------------------------
  // Helper: Finds the readable label of the currently selected value
  // -------------------------------------------------------------
  const getSelectedLabel = () => {
    // If no value selected, show placeholder text
    if (value === undefined || value === null || value === "") {
      return placeholder || "Select";
    }
    
    // Search options array for matching value (supports both strings and objects {value, label})
    const found = options.find((opt) => {
      const isObject = typeof opt === "object" && opt !== null;
      const optionValue = isObject ? opt.value : opt;
      return optionValue === value;
    });
    
    if (found) {
      const isObject = typeof found === "object" && found !== null;
      return isObject ? found.label : found;
    }
    
    return value;
  };

  return (
    <div
      ref={selectRef}
      className={`custom-select-group ${error ? "has-error" : ""} ${isOpen ? "has-open-dropdown" : ""} ${className}`}
    >
      {label && (
        <label className="custom-select-label">
          {label}
          {required && <span className="required-asterisk"> *</span>}
        </label>
      )}
      <div className="select-container">
        <div
          className={`select-trigger ${Icon ? "with-icon" : ""} ${!value ? "is-placeholder" : ""} ${isOpen ? "is-active" : ""} ${disabled ? "disabled" : ""}`}
          onClick={handleToggle}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            } else if (e.key === "Escape") {
              setIsOpen(false);
            }
          }}
        >
          {Icon && (
            <div className="select-icon-left">
              <Icon className="icon" />
            </div>
          )}
          <span className="selected-value-text">{getSelectedLabel()}</span>
          <div className="select-chevron-right">
            <KeyboardArrowDown className={`chevron ${isOpen ? "rotated" : ""}`} />
          </div>
        </div>

        {isOpen && (
          <div className="select-dropdown-menu">
            {options.map((opt) => {
              const isObject = typeof opt === "object" && opt !== null;
              const optionValue = isObject ? opt.value : opt;
              const optionLabel = isObject ? opt.label : opt;
              const isSelected = optionValue === value;

              return (
                <div
                  key={optionValue}
                  className={`select-dropdown-item ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelectOption(optionValue)}
                >
                  <span className="item-text">{optionLabel}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default CustomSelect;
