import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginForm from "../components/Login/LoginForm";
import SocialAuthButtons  from "../components/Login/SocialAuthButtons";
import { endpoints } from "../apis/endpoints";

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  error?: boolean;
  success?: boolean;
  error_msg?: string;
  user?: Record<string, unknown>; 
  token?: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleLoginSubmit = async (): Promise<void> => {
    setError("");

    if (!loginData.email.trim() || !loginData.password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", loginData.email);
      formData.append("password", loginData.password);
      formData.append("password_type", "manual");

      const response = await fetch(endpoints.login, {
        method: "POST",
        body: formData,
      });

      const data: LoginResponse = await response.json();

      if (data.error === false || data.success === true) {
        console.log("Login successful:", data);

        const userDataToStore = {
          email: loginData.email,
          user: data.user,
          loginTime: new Date().toISOString(),
          rememberMe: rememberMe,
        };

        localStorage.setItem("userData", JSON.stringify(userDataToStore));

        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        setLoginData({ email: "", password: "" });
        navigate("/");
      } else {
        setError(data.error_msg || "Login failed. Please try again.");
        console.log("Login failed:", data);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (): void => {
    console.log("Forgot password clicked");
    // navigate('/forgot-password');
  };

  const handleSocialLogin = (provider: string): void => {
    console.log(`${provider} login clicked`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <Link to="/" className="flex items-center">
            <img
              src="src/assets/images/bee-logo.png"
              alt="Explorer Bees"
              className="w-16 h-12 object-contain"
            />
            <span className="text-2xl font-bold text-white drop-shadow-lg">
              Explorer<span className="text-yellow-400">Bees</span>
            </span>
          </Link>

          <Link
            to="/"
            className="text-white/80 hover:text-white transition-colors drop-shadow-md font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Content */}
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 rounded-3xl blur-xl"></div>

              <div
                className="relative bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
                  boxShadow:
                    "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    Welcome Back!
                  </h1>
                  <p className="text-white/80 drop-shadow-md">
                    Please login to your account in ExplorerBees.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                    <p className="text-red-300 text-sm text-center">{error}</p>
                  </div>
                )}

                {/* Login Form */}
                <LoginForm
                  loginData={loginData}
                  setLoginData={setLoginData}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  rememberMe={rememberMe}
                  setRememberMe={setRememberMe}
                  handleLoginSubmit={handleLoginSubmit}
                  handleForgotPassword={handleForgotPassword}
                  isLoading={isLoading}
                />

                {/* Social Login */}
                <SocialAuthButtons handleSocialLogin={handleSocialLogin} />

                {/* Register link */}
                <div className="text-center mt-6">
                  <p className="text-white/80 drop-shadow-md">
                    Don't have an account?{" "}
                    <button
                      onClick={() => navigate("/Registration")}
                      className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors drop-shadow-md"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
