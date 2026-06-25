import { useState, useEffect, useRef } from "react";
import "./CustomInput.scss";


// ==========================================
// Component: CustomInput
// Description: Custom text input field with support for left icons, validation errors, and unit suffixes (dropdown or static)
// ==========================================
const CustomInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required,
  error,
  type = "text",
  className = "",
  inputRef,
  suffix,
  suffixIcon: SuffixIcon,
  onSuffixClick,
  suffixOptions,
  suffixValue,
  onSuffixChange,
  suffixName,
  ...props
}) => {
  // Local State: tracks if the suffix unit dropdown (e.g. cm/ft, kg/lb) is open
  const [isSuffixOpen, setIsSuffixOpen] = useState(false);
  
  // Reference: used to check if mouse clicks happen outside the suffix dropdown
  const suffixRef = useRef(null);

  // -------------------------------------------------------------
  // Effect: Close suffix dropdown if user clicks anywhere outside of it
  // -------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If suffix dropdown exists and click target is NOT inside the dropdown ref
      if (suffixRef.current && !suffixRef.current.contains(event.target)) {
        setIsSuffixOpen(false);
      }
    };
    
    // Register event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // -------------------------------------------------------------
  // Handler: Toggles suffix dropdown or triggers click callback
  // -------------------------------------------------------------
  const handleSuffixTrigger = () => {
    if (onSuffixClick) {
      onSuffixClick();
    } else if (suffixOptions) {
      setIsSuffixOpen(!isSuffixOpen);
    }
  };

  // -------------------------------------------------------------
  // Handler: Runs when user selects a unit option from suffix dropdown menu
  // -------------------------------------------------------------
  const handleSelectSuffixOption = (opt) => {
    // Call the parent component's callback to update unit state (e.g. heightUnit = 'ft')
    onSuffixChange({
      target: {
        name: suffixName || `${name}Unit`,
        value: opt
      }
    });
    
    // Close the dropdown menu
    setIsSuffixOpen(false);
  };

  return (
    <div className={`custom-input-group ${error ? "has-error" : ""} ${isSuffixOpen ? "has-open-dropdown" : ""} ${className}`}>
      {label && (
        <label className="custom-input-label">
          {label}
          {required && <span className="required-asterisk"> *</span>}
        </label>
      )}
      <div className="input-container">
        {Icon && (
          <div className="input-icon-left">
            <Icon className="icon" />
          </div>
        )}
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field ${Icon ? "with-icon" : ""} ${suffix ? "with-suffix" : ""}`}
          {...props}
        />
        {suffix && (
          <div
            ref={suffixRef}
            className={`input-suffix ${onSuffixClick || suffixOptions ? "clickable" : ""} ${isSuffixOpen ? "is-active" : ""}`}
            onClick={handleSuffixTrigger}
          >
            {SuffixIcon && <SuffixIcon className={`suffix-icon ${isSuffixOpen ? "rotated" : ""}`} />}
            {suffixOptions ? (
              <>
                <span className="suffix-text">{suffixValue}</span>
                {isSuffixOpen && (
                  <div className="suffix-dropdown-menu">
                    {suffixOptions.map((opt) => {
                      const isSelected = opt === suffixValue;
                      return (
                        <div
                          key={opt}
                          className={`suffix-dropdown-item ${isSelected ? "selected" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSuffixOption(opt);
                          }}
                        >
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <span className="suffix-text">{suffix}</span>
            )}
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default CustomInput;
