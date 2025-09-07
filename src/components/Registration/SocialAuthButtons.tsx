import React from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

interface Props {
  handleSocialRegister: (provider: string) => void;
}

const SocialAuthButtons: React.FC<Props> = ({ handleSocialRegister }) => {
  return (
    <div className="space-y-2">
      <button
        onClick={() => handleSocialRegister("google")}
        className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded"
      >
        <FaGoogle className="mr-2" /> Continue with Google
      </button>
      <button
        onClick={() => handleSocialRegister("facebook")}
        className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded"
      >
        <FaFacebook className="mr-2" /> Continue with Facebook
      </button>
    </div>
  );
};

export default SocialAuthButtons;
