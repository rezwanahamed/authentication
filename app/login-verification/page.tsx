import { Key, Mail, Smartphone, Sticker } from "lucide-react";

const Homepage = () => {
  return (
    <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[25rem] items-center justify-center">
      <div className="wrapper space-y-6">
        <div className="logo flex h-12 w-12 items-center justify-center rounded-lg bg-[#233856]">
          <Sticker className="h-6 w-6 text-blue-500" />
        </div>
        <div className="descriptions space-y-2">
          <h2 className="font-geist text-xl font-medium">
            Login to your profile
          </h2>
          <p className="w-full font-geist text-sm font-medium text-gray-400">
            Provide your valid details in the registration form. We will send a
            verification code in your email address.
          </p>
        </div>

        <div className="two-step-verification-plan grid grid-cols-2 gap-2">
          <div className="plan flex h-[10rem] flex-col items-center justify-center rounded-lg border border-blue-500 bg-[#233856]">
            <div className="rounded-full bg-blue-500 p-2">
              <Smartphone className="h-4 w-4" />
            </div>
            <p className="mt-2 text-center font-geist text-sm font-medium">
              Use phone number
            </p>
          </div>

          <div className="plan flex h-[10rem] flex-col items-center justify-center rounded-lg bg-[#292929]">
            <div className="rounded-full bg-[#424242] p-2">
              <Mail className="h-4 w-4" />
            </div>
            <p className="mt-2 font-geist text-sm font-medium">Use email</p>
          </div>

          <div className="plan col-span-2 flex h-[10rem] flex-col items-center justify-center rounded-lg bg-[#292929]">
            <div className="rounded-full bg-[#424242] p-2">
              <Key className="h-4 w-4" />
            </div>
            <p className="mt-2 font-geist text-sm font-medium">Use passkey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
