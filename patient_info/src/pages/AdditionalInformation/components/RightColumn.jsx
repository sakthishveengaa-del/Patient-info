import { KeyboardArrowDown } from "@mui/icons-material";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import { dietaryOptions, alcoholOptions } from "../data/additionalInfoConstants";

// ==========================================
// Sub-Component: RightColumn
// Description: Renders the right side input fields for Additional Information step
// ==========================================
export const RightColumn = ({
  form,
  errors,
  touched,
  handleChange,
  handleBlur
}) => {
  return (
    <div className="form-column">
      <CustomInput
        label="Weight"
        name="weight"
        value={form.weight}
        onChange={handleChange}
        onBlur={() => handleBlur("weight")}
        placeholder="Enter weight"
        suffix={form.weightUnit}
        suffixIcon={KeyboardArrowDown}
        suffixOptions={["kg", "lb"]}
        suffixValue={form.weightUnit}
        onSuffixChange={handleChange}
        suffixName="weightUnit"
        error={touched.weight && errors.weight}
      />

      <CustomInput
        label="Blood Sugar"
        name="bloodSugar"
        value={form.bloodSugar}
        onChange={handleChange}
        onBlur={() => handleBlur("bloodSugar")}
        placeholder="Enter Bloog Sugar (If Known), e.g. 90 mg/dl"
        suffix="mg/dL"
        error={touched.bloodSugar && errors.bloodSugar}
      />

      <CustomSelect
        label="Dietary Preference"
        name="dietaryPreference"
        value={form.dietaryPreference}
        onChange={handleChange}
        placeholder="Select"
        options={dietaryOptions}
      />

      <CustomSelect
        label="Alcohol Consumption"
        name="alcoholConsumption"
        value={form.alcoholConsumption}
        onChange={handleChange}
        placeholder="Select"
        options={alcoholOptions}
      />

      <CustomInput
        label="Emergency Contact Number"
        name="emergencyNumber"
        value={form.emergencyNumber}
        onChange={handleChange}
        onBlur={() => handleBlur("emergencyNumber")}
        placeholder="+91 9876 543 210"
        icon={PhoneEnabledIcon}
        maxLength={10}
        required
        error={touched.emergencyNumber && errors.emergencyNumber}
      />
    </div>
  );
};
