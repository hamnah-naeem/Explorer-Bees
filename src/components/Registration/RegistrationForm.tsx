import React from "react";
import type { RegisterData, UsernameStatus, LoadingState } from "../../types/Registration";

interface Props {
  registerData: RegisterData;
  setRegisterData: (data: Partial<RegisterData>) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  countries: string[];
  states: string[];
  cities: string[];
  handleRegisterSubmit: () => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  markFieldAsTouched: (field: keyof RegisterData) => void;
  loading: LoadingState;
  usernameStatus: UsernameStatus;
}

const RegistrationForm: React.FC<Props> = ({
  registerData,
  setRegisterData,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  countries,
  states,
  cities,
  handleRegisterSubmit,
  errors,
  touched,
  markFieldAsTouched,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleRegisterSubmit();
      }}
      className="space-y-4"
    >
      <input
        type="text"
        placeholder="Full Name"
        value={registerData.name}
        onChange={(e) => setRegisterData({ name: e.target.value })}
        onBlur={() => markFieldAsTouched("name")}
        className="w-full border rounded p-2"
      />
      {touched.name && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <input
        type="text"
        placeholder="Username"
        value={registerData.username}
        onChange={(e) => setRegisterData({ username: e.target.value })}
        onBlur={() => markFieldAsTouched("username")}
        className="w-full border rounded p-2"
      />
      {touched.username && errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

      <input
        type="email"
        placeholder="Email"
        value={registerData.email}
        onChange={(e) => setRegisterData({ email: e.target.value })}
        onBlur={() => markFieldAsTouched("email")}
        className="w-full border rounded p-2"
      />
      {touched.email && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={registerData.password}
        onChange={(e) => setRegisterData({ password: e.target.value })}
        onBlur={() => markFieldAsTouched("password")}
        className="w-full border rounded p-2"
      />
      {touched.password && errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      <input
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm Password"
        value={registerData.confirmPassword}
        onChange={(e) => setRegisterData({ confirmPassword: e.target.value })}
        onBlur={() => markFieldAsTouched("confirmPassword")}
        className="w-full border rounded p-2"
      />
      {touched.confirmPassword && errors.confirmPassword && (
        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
      )}

      <select
        value={registerData.country}
        onChange={(e) => setRegisterData({ country: e.target.value })}
        onBlur={() => markFieldAsTouched("country")}
        className="w-full border rounded p-2"
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      {touched.country && errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}

      <select
        value={registerData.state}
        onChange={(e) => setRegisterData({ state: e.target.value })}
        onBlur={() => markFieldAsTouched("state")}
        className="w-full border rounded p-2"
      >
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {touched.state && errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}

      <select
        value={registerData.city}
        onChange={(e) => setRegisterData({ city: e.target.value })}
        onBlur={() => markFieldAsTouched("city")}
        className="w-full border rounded p-2"
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      {touched.city && errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}

      <button type="submit" className="w-full bg-yellow-600 text-white py-2 rounded">
        Register
      </button>
    </form>
  );
};

export default RegistrationForm;
