import React, { useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import RegistrationForm from "../components/Registration/RegistrationForm";
import SocialAuthButtons  from "../components/Registration/SocialAuthButtons";
import type {
  RegisterData,
  UsernameStatus,
  LoadingState,
} from "../types/Registration";

const Registration: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    city: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [countries] = useState<string[]>([]);
  const [states] = useState<string[]>([]);
  const [cities] = useState<string[]>([]);
  const [loading] = useState<LoadingState>({
    countries: false,
    states: false,
    cities: false,
    username: false,
  });

  const [usernameStatus] = useState<UsernameStatus>({
    available: null,
    checking: false,
    message: "",
  });

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "name":
        return value.trim() ? "" : "Name is required";
      case "username":
        return value.trim().length >= 3
          ? ""
          : "Username must be at least 3 characters";
      case "email":
        return /\S+@\S+\.\S+/.test(value) ? "" : "Invalid email address";
      case "password":
        return value.length >= 6
          ? ""
          : "Password must be at least 6 characters";
      case "confirmPassword":
        return value === registerData.password ? "" : "Passwords do not match";
      case "country":
        return value ? "" : "Country is required";
      case "state":
        return value ? "" : "State is required";
      case "city":
        return value ? "" : "City is required";
      default:
        return "";
    }
  };

  const handleRegisterSubmit = () => {
    const newErrors: Record<string, string> = {};
    Object.entries(registerData).forEach(([field, value]) => {
      const error = validateField(field, value as string);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    showSuccessMessage("Registration successful!");
  };

  const enhancedSetRegisterData = (newData: Partial<RegisterData>) => {
    const updatedData = { ...registerData, ...newData };
    setRegisterData(updatedData);

    Object.keys(newData).forEach((field) => {
      if (touched[field]) {
        const error = validateField(field, (newData as any)[field]);
        setErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
      }
    });
  };

  const markFieldAsTouched = (field: keyof RegisterData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, registerData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Create Account</h1>

        {successMessage && (
          <div className="mb-4 text-green-600 font-medium text-center">
            {successMessage}
          </div>
        )}

        <RegistrationForm
          registerData={registerData}
          setRegisterData={enhancedSetRegisterData}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          countries={countries}
          states={states}
          cities={cities}
          handleRegisterSubmit={handleRegisterSubmit}
          errors={errors}
          touched={touched}
          markFieldAsTouched={markFieldAsTouched}
          loading={loading}
          usernameStatus={usernameStatus}
        />

        <div className="my-4 text-center text-gray-500">or</div>

        <SocialAuthButtons handleSocialRegister={handleSocialRegister} />

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;
