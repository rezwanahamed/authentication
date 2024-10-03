import PasswordComponent from "@/components/ui/common/Form/PasswordComponent";
import { KeyRound } from "lucide-react";

const Homepage = () => {
  return (
    <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[25rem] items-center justify-center">
      <div className="wrapper space-y-6">
        <div className="logo flex h-12 w-12 items-center justify-center rounded-lg bg-[#233856]">
          <KeyRound className="h-6 w-6 text-blue-500" />
        </div>
        <div className="descriptions space-y-2">
          <h2 className="font-geist text-xl font-medium">Set your password</h2>
          <p className="w-full font-geist text-sm font-medium text-gray-400">
            Set a strong password to protect your data. Use number, characters
            and spacial symbols.
          </p>
        </div>

        <div className="form-wrapper">
          <PasswordComponent />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
