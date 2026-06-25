import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout/MainLayout";

import PersonalInformation from "../pages/PersonalInformation/PersonalInformation";
import AdditionalInformation from "../pages/AdditionalInformation/AdditionalInformation";
import MedicalHistory from "../pages/MedicalHistory/MedicalHistory";
import InsuranceInformation from "../pages/InsuranceInformation/InsuranceInformation";
import HealthRecords from "../pages/HealthRecords/HealthRecords";
import ReviewComplete from "../pages/ReviewComplete/ReviewComplete";
import AccountCreated from "../pages/AccountCreated/AccountCreated";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout Route */}
      <Route path="/" element={<MainLayout />}>
        
        {/* Default redirect */}
        <Route
          index
          element={<Navigate to="/personal-information" replace />}
        />

        {/* Pages */}
        <Route
          path="personal-information"
          element={<PersonalInformation />}
        />

        <Route
          path="additional-information"
          element={<AdditionalInformation />}
        />

        <Route
          path="medical-history"
          element={<MedicalHistory />}
        />

        <Route
          path="insurance-information"
          element={<InsuranceInformation />}
        />

        <Route
          path="health-records"
          element={<HealthRecords />}
        />

        <Route
          path="review-complete"
          element={<ReviewComplete />}
        />
      </Route>

      {/* Render success page outside MainLayout to avoid sidebar */}
      <Route
        path="account-created"
        element={<AccountCreated />}
      />

      {/* Fallback route */}
      <Route
        path="*"
        element={<Navigate to="/personal-information" replace />}
      />
    </Routes>
  );
};

export default AppRoutes;