/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplayIcon from "@mui/icons-material/Replay";
import insurancePreviewImg from "../../assets/insurance_preview.png";

// ==========================================
// Component: UploadCard
// Description: Renders the beautiful document card with simulated uploading states
// ==========================================
export const UploadCard = ({ file, onRemove, previewImage, defaultTitle }) => {
  const [status, setStatus] = useState("queued"); // queued, uploading, uploaded, error
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("Document");
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Set up preview URL if file is an image, otherwise use default preview image
  useEffect(() => {
    if (file && file instanceof Blob && file.type && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  // Set initial title based on prop or file name
  useEffect(() => {
    if (defaultTitle) {
      setTitle(defaultTitle);
    } else if (file && file.name) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      setTitle(nameWithoutExt);
    }
  }, [file, defaultTitle]);

  // Simulate upload progress
  useEffect(() => {
    let timer;
    if (status === "queued") {
      timer = setTimeout(() => {
        setStatus("uploading");
        setProgress(0);
      }, 1000);
    } else if (status === "uploading") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus("uploaded");
            return 100;
          }
          return prev + 10;
        });
      }, 150);
      return () => clearInterval(interval);
    }
    return () => clearTimeout(timer);
  }, [status]);

  // Handle manual retry
  const handleRetry = (e) => {
    e.stopPropagation();
    setStatus("queued");
    setProgress(0);
  };

  // Helper to format file size
  const formatSize = (bytes) => {
    if (!bytes) return "—";
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${parseFloat(kb.toFixed(1))} KB`;
    }
    const mb = kb / 1024;
    return `${parseFloat(mb.toFixed(2))} MB`;
  };

  // Helper to get file format suffix
  const getFormatSuffix = (fileName) => {
    if (!fileName) return "Unknown";
    const ext = fileName.substring(fileName.lastIndexOf(".")).toUpperCase();
    return ext.replace(".", "");
  };

  return (
    <div className="upload-preview-card">
      {/* Thumbnail area */}
      <div className="card-thumbnail">
        <img
          src={previewUrl || previewImage || insurancePreviewImg}
          alt="Document Preview"
          className="thumbnail-img"
        />
      </div>

      {/* Info area */}
      <div className="card-info">
        <div className="title-row">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditing(false);
              }}
              autoFocus
              className="card-title-input"
            />
          ) : (
            <div className="title-display">
              <span className="card-title-text">{title}</span>
              <button
                type="button"
                className="btn-edit-title"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon className="edit-pencil-icon" />
              </button>
            </div>
          )}
        </div>

        <div className="format-size-row">
          {file ? `${getFormatSuffix(file.name)} • ${formatSize(file.size)}` : "PDF • 125 KB"}
        </div>
      </div>

      {/* Footer Area with States */}
      <div className="card-footer">
        {status === "queued" && (
          <>
            <span className="status-label status-queued">Queued</span>
            <button type="button" className="btn-card-action btn-cancel" onClick={onRemove}>
              <CloseIcon className="action-icon" />
              <span>Cancel</span>
            </button>
          </>
        )}

        {status === "uploading" && (
          <>
            <div className="uploading-status-container">
              {/* Custom two-bar pause/loading icon */}
              <div className="pause-icon-wrapper">
                <span className="pause-bar"></span>
                <span className="pause-bar"></span>
              </div>
              <span className="progress-percentage">{progress}%</span>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <button type="button" className="btn-card-icon btn-delete" onClick={onRemove}>
              <DeleteIcon className="icon-trash" />
            </button>
          </>
        )}

        {status === "uploaded" && (
          <>
            <span className="status-label status-uploaded">Upload Successful!</span>
            <button type="button" className="btn-card-action btn-delete-text" onClick={onRemove}>
              <DeleteIcon className="action-icon red-trash" />
              <span>Delete</span>
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <span className="status-label status-error">Upload Failed!</span>
            <button type="button" className="btn-card-action btn-retry" onClick={handleRetry}>
              <ReplayIcon className="action-icon green-retry" />
              <span>Retry</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
