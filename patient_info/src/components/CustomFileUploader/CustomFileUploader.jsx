import { useState, useRef } from "react";
import "./CustomFileUploader.scss";

// Cloud Upload Icon matching design
const CloudUploadIcon = (props) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="upload-cloud-icon" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// Circular Info Icon
const InfoIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// File PDF/Image Icon
const FileIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// Close (Trash/Remove) Icon
const TrashIcon = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);


// ==========================================
// Component: CustomFileUploader
// Description: Drag and Drop file uploader with extension and file size validation
// ==========================================
const CustomFileUploader = ({
  label,
  value,
  onChange,
  accept = ".jpg,.jpeg,.png,.pdf",
  maxSize = 5 * 1024 * 1024, // 5MB in bytes
  infoText = "Make sure the card is clear and all details are visible",
  className = "",
  multiple = false,
  placeholderText = "Drag and drop your health records here, or",
  maxSizeLabel = "Max. 5MB"
}) => {
  // Local State: tracks whether a file is currently being dragged over the uploader area
  const [dragActive, setDragActive] = useState(false);
  
  // Local State: stores any file validation error messages
  const [error, setError] = useState("");
  
  // Reference: HTML input element reference to trigger clicks programmatically
  const inputRef = useRef(null);

  // -------------------------------------------------------------
  // Handler: Handles drag events (enter, over, leave) to highlight the dropzone
  // -------------------------------------------------------------
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // -------------------------------------------------------------
  // Helper: Validates and processes a list of files
  // -------------------------------------------------------------
  const processFiles = (fileList) => {
    setError("");
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);
    const validFiles = [];

    for (const file of filesArray) {
      // 1. Check if file exceeds maximum size limit (5MB)
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds 5MB limit.`);
        return;
      }

      // 2. Extract extension and verify if it's in the accepted list
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      const acceptedExtensions = accept.split(",").map((ext) => ext.trim().toLowerCase());
      
      if (!acceptedExtensions.includes(fileExtension)) {
        setError(`File "${file.name}" format is not allowed.`);
        return;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      if (multiple) {
        onChange(validFiles);
      } else {
        onChange(validFiles[0]);
      }
    }
  };

  // -------------------------------------------------------------
  // Handler: Handles dropping files into the dropzone
  // -------------------------------------------------------------
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // -------------------------------------------------------------
  // Handler: Handles file selection via browser file dialog
  // -------------------------------------------------------------
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // -------------------------------------------------------------
  // Helper: Triggers browser file selection dialog programmatically
  // -------------------------------------------------------------
  const triggerInput = () => {
    inputRef.current.click();
  };

  // -------------------------------------------------------------
  // Handler: Clears the current selected file
  // -------------------------------------------------------------
  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    setError("");
    // Clear HTML input value so the same file can be re-uploaded if needed
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // -------------------------------------------------------------
  // Helper: Formats raw bytes to human readable sizes (e.g. 1.25 MB)
  // -------------------------------------------------------------
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const roundedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return roundedSize + " " + sizes[i];
  };

  return (
    <div className={`custom-uploader-group ${className}`}>
      {label && <label className="custom-uploader-label">{label}</label>}

      <div
        className={`uploader-container ${dragActive ? "drag-active" : ""} ${value ? "has-file" : ""} ${error ? "has-error" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={!value ? triggerInput : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden-file-input"
          accept={accept}
          onChange={handleFileChange}
          multiple={multiple}
        />

        {!value ? (
          // Empty state: Drag and Drop interface
          <div className="uploader-content">
            <div className="upload-icon-wrapper">
              <CloudUploadIcon />
            </div>
            <div className="upload-text-row">
              {placeholderText}
              <br />
              <span className="browse-link" onClick={(e) => { e.stopPropagation(); triggerInput(); }}>
                browse
              </span>
            </div>
            <div className="upload-subtext">JPG, PNG or PDF ({maxSizeLabel})</div>
          </div>
        ) : (
          // File uploaded state
          <div className="uploaded-file-details">
            <div className="file-info-box">
              <div className="file-icon-wrapper">
                <FileIcon />
              </div>
              <div className="file-meta">
                <div className="file-name" title={value.name}>
                  {value.name}
                </div>
                <div className="file-size">{formatFileSize(value.size)}</div>
              </div>
            </div>
            <button type="button" className="btn-remove-file" onClick={handleRemove} title="Remove File">
              <TrashIcon />
            </button>
          </div>
        )}
      </div>

      {/* Embedded info banner outside the container */}
      {infoText && (
        <div className="info-banner">
          <InfoIcon className="info-banner-icon" />
          <span className="info-banner-text">{infoText}</span>
        </div>
      )}

      {error && <span className="uploader-error-message">{error}</span>}
    </div>
  );
};

export default CustomFileUploader;
