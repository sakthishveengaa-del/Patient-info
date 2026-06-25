import "./CustomButton.scss";

const CustomButton = ({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`custom-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
