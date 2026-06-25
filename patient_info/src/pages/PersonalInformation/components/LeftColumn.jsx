import PersonIcon from "@mui/icons-material/Person";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import WcIcon from "@mui/icons-material/Wc";
import PlaceIcon from "@mui/icons-material/Place";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import { genderOptions, stateOptions } from "../data/personalInfoConstants";

// ==========================================
// Sub-Component: LeftColumn
// Description: Renders the left side input fields for Personal Information step
// ==========================================
export const LeftColumn = ({
  form,
  errors,
  touched,
  handleChange,
  handleBlur
}) => {
  return (
    <div className="form-column">
      <CustomInput
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        onBlur={() => handleBlur("name")}
        placeholder="Enter your full name"
        icon={PersonIcon}
        required
        error={touched.name && errors.name}
      />

      <CustomInput
        label="Phone Number"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        onBlur={() => handleBlur("mobile")}
        placeholder="+91 9876 543 210"
        icon={PhoneEnabledIcon}
        className="phone-input-field"
        maxLength={10}
        error={touched.mobile && errors.mobile}
      />

      <CustomSelect
        label="Gender"
        name="gender"
        value={form.gender}
        onChange={handleChange}
        onBlur={() => handleBlur("gender")}
        placeholder="Select your gender"
        options={genderOptions}
        icon={WcIcon}
        required
        error={touched.gender && errors.gender}
      />

      <CustomSelect
        label="State"
        name="state"
        value={form.state}
        onChange={handleChange}
        onBlur={() => handleBlur("state")}
        placeholder="Select state"
        options={stateOptions}
        icon={PlaceIcon}
        required
        error={touched.state && errors.state}
      />
    </div>
  );
};
