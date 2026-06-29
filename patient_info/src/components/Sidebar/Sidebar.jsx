import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import SvgIcon from "@mui/material/SvgIcon";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import { useProgress } from "../../context/ProgressContext";
import logoImg from "../../assets/logo.png";
import "./Sidebar.scss";

// Custom SVG Icons wrapped in MUI SvgIcon to match design and MUI specifications
const PersonalInfoIcon = (props) => (
  <SvgIcon viewBox="0 0 24 24" {...props} sx={{ fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...(props.sx || {}) }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </SvgIcon>
);

const AdditionalInfoIcon = (props) => (
  <SvgIcon viewBox="0 0 24 24" {...props} sx={{ fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...(props.sx || {}) }}>
    <path d="M12 21c4.5-3.5 8-7 8-11.5C20 6.5 18 4.5 15.5 4.5c-1.5 0-2.5.5-3.5 1.5-1-1-2-1.5-3.5-1.5C6 4.5 4 6.5 4 9.5c0 .7.1 1.4.3 2" />
    <path d="M12 21c-1.5-1.5-2.5-3-3-4.5" />
    <path d="M2 12h5.5l1.5 3.5 2.5-8 2 6.5 1.5-2h7" />
  </SvgIcon>
);

const MedicalHistoryIcon = (props) => (
  <SvgIcon viewBox="0 0 24 24" {...props} sx={{ fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...(props.sx || {}) }}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
    <path d="M12 16.2l-.65-.58C9.17 13.59 7.9 12.33 7.9 10.75c0-1.28 1-2.25 2.28-2.25.72 0 1.41.34 1.82.87.41-.53 1.1-.87 1.82-.87 1.28 0 2.28.97 2.28 2.25 0 1.58-1.27 2.84-3.45 4.87L12 16.2z" />
  </SvgIcon>
);

const InsuranceIcon = (props) => (
  <SvgIcon viewBox="0 0 24 24" {...props} sx={{ fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...(props.sx || {}) }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </SvgIcon>
);

const HealthRecordsIcon = (props) => (
  <SvgIcon viewBox="0 0 24 24" {...props} sx={{ fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...(props.sx || {}) }}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <path d="M14 16h6M17 13v6" />
  </SvgIcon>
);

const ReviewCompleteIcon = (props) => (
  <SvgIcon viewBox="0 0 24 24" {...props} sx={{ fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...(props.sx || {}) }}>
    <path d="M14 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 2 17.5V19" />
    <circle cx="8" cy="7" r="3.5" />
    <path d="M16 12l2 2 4-4" />
  </SvgIcon>
);


// ==========================================
// Component: Sidebar
// Description: Renders the brand logo, step-by-step progress sidebar, and estimated time card
// ==========================================
const Sidebar = () => {
  // location: hook to retrieve the current browser URL path (e.g. '/personal-information')
  const location = useLocation();
  
  // progress: current completion progress from context provider
  const { progress } = useProgress();

  // Steps configuration: defines the name, route path, and custom icon component for each registration step
  const steps = [
    { name: "Personal Information", path: "/personal-information", icon: PersonalInfoIcon },
    { name: "Additional Information", path: "/additional-information", icon: AdditionalInfoIcon },
    { name: "Medical History", path: "/medical-history", icon: MedicalHistoryIcon },
    { name: "Insurance Information", path: "/insurance-information", icon: InsuranceIcon },
    { name: "Health Records", path: "/health-records", icon: HealthRecordsIcon },
    { name: "Review & Complete", path: "/review-complete", icon: ReviewCompleteIcon },
  ];

  return (
    <Box component="aside" className="sidebar">
      {/* Brand Logo Header */}
      <Box className="logo-container">
        <img src={logoImg} alt="MediConnect Healthcare Ecosystem" className="logo-img" />
      </Box>

      {/* Navigation Steps */}
      <Box component="nav" className="steps-container">
        {steps.map((step, index) => {
          // Find the index of the currently active step based on URL path matching
          const activeIndex = steps.findIndex(s => location.pathname === s.path);
          
          // Determine status flags for rendering the step style
          const isActive = location.pathname === step.path;
          const isCompleted = index < activeIndex && activeIndex !== -1;
          const isDisabled = index > activeIndex && !isActive && activeIndex !== -1;
          
          // Use checkmark icon if completed, otherwise use the step's specific icon
          const Icon = isCompleted ? CheckIcon : step.icon;

          return (
            <Box
              key={step.path}
              className={`step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${isDisabled ? "disabled" : ""}`}
            >
              <Box className="step-icon-wrapper">
                <Icon className="step-icon" />
              </Box>
              <Box component="span" className="step-label">{step.name}</Box>
            </Box>
          );
        })}
      </Box>

      {/* Profile Progress Card */}
      <Box className="progress-card">
        <Box className="progress-header">
          <p className="progress-title">Profile Progress</p>
          <p className="progress-value">{progress}% Complete</p>
        </Box>
        
        {/* MUI LinearProgress component displaying current progress bar */}
        <Box className="progress-bar-track" sx={{ height: 6, borderRadius: 3, overflow: "hidden", position: "relative" }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: "100%",
              backgroundColor: "transparent",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#0d7a5f",
                borderRadius: 99
              }
            }}
          />
        </Box>
        
        {/* Estimated completion timer notification */}
        <Box className="progress-estimate">
          <AccessTimeIcon className="stopwatch-icon" />
          <span>Estimated Time: 2-3 Minutes</span>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;