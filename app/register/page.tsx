import RegisterFormComponent from "@/components/ui/common/Form/RegisterFormComponent";
import { ShieldCheck } from "lucide-react";

const RegisterPage = () => {
  return (
    <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[25rem] items-center justify-center">
      <div className="wrapper space-y-6">
        <div className="logo flex h-12 w-12 items-center justify-center rounded-lg bg-[#233856]">
          <ShieldCheck className="h-6 w-6 text-blue-500" />
        </div>
        <div className="descriptions space-y-2">
          <h2 className="font-geist text-xl font-medium">
            Register to your profile
          </h2>
          <p className="w-full font-geist text-sm font-medium text-gray-400">
            Provide your valid details in the registration form. We will send a
            verification code in your email address.
          </p>
        </div>

        <div className="form-wrapper">
          <RegisterFormComponent />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
