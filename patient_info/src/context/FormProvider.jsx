/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const FormContext = createContext(null);

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({});

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => useContext(FormContext);