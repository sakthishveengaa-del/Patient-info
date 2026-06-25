import { KeyboardArrowDown } from "@mui/icons-material";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import { activityOptions, smokingOptions, relationshipOptions } from "../data/additionalInfoConstants";

// ==========================================
// Sub-Component: LeftColumn
// Description: Renders the left side input fields for Additional Information step
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
        label="Height"
        name="height"
        value={form.height}
        onChange={handleChange}
        onBlur={() => handleBlur("height")}
        placeholder="Enter height"
        suffix={form.heightUnit}
        suffixIcon={KeyboardArrowDown}
        suffixOptions={["cm", "ft"]}
        suffixValue={form.heightUnit}
        onSuffixChange={handleChange}
        suffixName="heightUnit"
        error={touched.height && errors.height}
      />

      <CustomInput
        label="Blood Pressure"
        name="bloodPressure"
        value={form.bloodPressure}
        onChange={handleChange}
        onBlur={() => handleBlur("bloodPressure")}
        placeholder="Enter Blood Pressure (If Known), e.g. 120/80"
        suffix="mmHg"
        error={touched.bloodPressure && errors.bloodPressure}
      />

      <CustomSelect
        label="Physical Activity Level"
        name="activityLevel"
        value={form.activityLevel}
        onChange={handleChange}
        placeholder="Select"
        options={activityOptions}
      />

      <CustomSelect
        label="Smoking Status"
        name="smokingStatus"
        value={form.smokingStatus}
        onChange={handleChange}
        placeholder="Select"
        options={smokingOptions}
      />

      <CustomSelect
        label="Emergency Contact Relationship"
        name="emergencyRelationship"
        value={form.emergencyRelationship}
        onChange={handleChange}
        placeholder="Select"
        options={relationshipOptions}
        required
        error={touched.emergencyRelationship && errors.emergencyRelationship}
        onBlur={() => handleBlur("emergencyRelationship")}
      />
    </div>
  );
};
