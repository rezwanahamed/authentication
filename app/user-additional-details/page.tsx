"use client";
import AdditionalDetailsFormComponent from "@/components/ui/common/Form/AdditionalDetailsFormComponent";
import useObjectStore from "@/zustand/pageStatusCheckStore";
import { MapPinHouse } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const UserAdditionalDetails = () => {
  const getValue = useObjectStore((state) => state.getValue);
  const router = useRouter()

  useEffect(() => {
    const canAccess = getValue("user-additional-details-access");
    if (!canAccess) {
      router.push('/register')
      return;
    }
  }, []);
  return (
    <div className="main-wrapper mx-auto flex max-h-max min-h-screen w-[25rem] items-center justify-center">
      <div className="wrapper space-y-6">
        <div className="logo flex h-12 w-12 items-center justify-center rounded-lg bg-[#233856]">
          <MapPinHouse className="h-6 w-6 text-blue-500" />
        </div>
        <div className="descriptions space-y-2">
          <h2 className="font-geist text-xl font-medium">
            Add your address and additional details
          </h2>
          <p className="w-full font-geist text-sm font-medium text-gray-400">
            Provide your valid details in the registration form. Add your
            address , age and date of birth.
          </p>
        </div>

        <div className="form-wrapper">
          <AdditionalDetailsFormComponent />
        </div>
      </div>
    </div>
  );
};

export default UserAdditionalDetails;
