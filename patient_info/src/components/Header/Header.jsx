import Tooltip from "@mui/material/Tooltip";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import "./Header.scss";

const Header = ({ title, subtitle, showSupport = true }) => {
  return (
    <header className="page-header">
      <div className="header-text">
        <h1 className="header-title">{title}</h1>
        <p className="header-subtitle">{subtitle}</p>
      </div>
      {showSupport && (
        <div className="header-support">
          <Tooltip title="Click to contact customer support" arrow>
            <div className="support-icon-wrapper" style={{ cursor: "pointer" }}>
              <HeadsetMicIcon className="support-icon" />
            </div>
          </Tooltip>
          <div className="support-details">
            <span className="support-label">Need Help?</span>
            <Tooltip title="Click to contact customer support" arrow>
              <a href="#support" className="support-link" onClick={(e) => e.preventDefault()}>
                Contact Support
              </a>
            </Tooltip>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

