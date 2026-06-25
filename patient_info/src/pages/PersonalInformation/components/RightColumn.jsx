import MailIcon from "@mui/icons-material/Mail";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import PlaceIcon from "@mui/icons-material/Place";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import CustomDatePicker from "../../../components/CustomDatePicker/CustomDatePicker";
import { bloodGroups } from "../data/personalInfoConstants";

// ==========================================
// Sub-Component: RightColumn
// Description: Renders the right side input fields for Personal Information step
// ==========================================
export const RightColumn = ({
  form,
  errors,
  touched,
  handleChange,
  handleBlur,
  cities
}) => {
  return (
    <div className="form-column">
      <CustomDatePicker
        label="Date of Birth"
        name="dob"
        value={form.dob}
        onChange={handleChange}
        onBlur={() => handleBlur("dob")}
        placeholder="Select date of birth"
        required
        error={touched.dob && errors.dob}
      />

      <CustomInput
        label="Email Address"
        name="email"
        value={form.email}
        onChange={handleChange}
        onBlur={() => handleBlur("email")}
        placeholder="Enter your email (optional)"
        icon={MailIcon}
        error={touched.email && errors.email}
      />

      <CustomSelect
        label="Blood Group"
        name="bloodGroup"
        value={form.bloodGroup}
        onChange={handleChange}
        onBlur={() => handleBlur("bloodGroup")}
        placeholder="Select your blood group"
        options={bloodGroups}
        icon={WaterDropIcon}
        required
        error={touched.bloodGroup && errors.bloodGroup}
      />

      <CustomSelect
        label="Current City"
        name="city"
        value={form.city}
        onChange={handleChange}
        onBlur={() => handleBlur("city")}
        placeholder="Select your current city"
        options={cities}
        icon={PlaceIcon}
        required
        disabled={!form.state}
        error={touched.city && errors.city}
      />
    </div>
  );
};
