import "./CustomTextArea.scss";


// ==========================================
// Component: CustomTextArea
// Description: Custom multi-line textarea input component that supports character limits and real-time counter indicators
// ==========================================
const CustomTextArea = ({
  label,
  name,
  value = "",
  onChange,
  placeholder,
  required,
  error,
  maxLength,
  showCounter,
  rows = 4,
  className = "",
  textareaRef,
  ...props
}) => {
  return (
    <div className={`custom-textarea-group ${error ? "has-error" : ""} ${className}`}>
      {label && (
        <label className="custom-textarea-label">
          {label}
          {required && <span className="required-asterisk"> *</span>}
        </label>
      )}
      <div className="textarea-container">
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className="textarea-field"
          {...props}
        />
        {showCounter && maxLength && (
          <div className="textarea-counter">
            {value.length}/{maxLength} Characters left
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default CustomTextArea;
