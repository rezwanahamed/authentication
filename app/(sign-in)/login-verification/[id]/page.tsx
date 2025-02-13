"use client";
import { apiUrls } from "@/lib/config/apiUrls";
import { appUrls } from "@/lib/config/appUrls";
import { decryptData, encryptData } from "@/utils/cryptoUtils";
import { usePostData } from "@/utils/useApiPost";
import { Key, Mail, Smartphone, Sticker } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const Homepage = () => {
  const params = useParams();
  const router = useRouter();
  const decryptedEmail = decryptData(params?.id as string);

  const { postData } = usePostData();

  const onClickHandler = async (type: string) => {
    if (type === "email") {
      const payload = {
        email: decryptedEmail,
        page: "login-verification",
      };
      const encryptPayload = encryptData(payload);
      try {
        const response = await postData(apiUrls.AUTH.GENERATE_LOGIN_OTP, {
          credential: decryptedEmail,
          credentialType: "email",
        });
        if (response?.status === 200) {
          router.push(`${appUrls.AUTH.OTP}/${encryptPayload}`);
        }
      } catch (err) {
        console.error(err);
      }
      return;
    }
    if (type === "passkey") {
      router.push(`${appUrls.AUTH.PASSKEY_VALIDATION}/${params?.id}`);
      return;
    }
  };

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

        <ul className="grid w-full gap-2 md:grid-cols-2">
          <li onClick={() => onClickHandler("email")}>
            <input
              type="radio"
              id="email"
              name="contact_method"
              value="email"
              className="peer hidden"
              required
            />
            <label
              htmlFor="email"
              className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-transparent bg-[#292929] p-5 text-white hover:bg-[#233856] hover:text-white peer-checked:border-blue-500 peer-checked:bg-[#233856] peer-checked:text-white"
            >
              <div className="rounded-full bg-blue-500 p-2">
                <Mail className="h-4 w-4" />
              </div>
              <p className="mt-2 font-geist text-sm font-medium">Use email</p>
            </label>
          </li>

          <li onClick={() => onClickHandler("phone")}>
            <input
              type="radio"
              id="phone"
              name="contact_method"
              value="phone"
              className="peer hidden"
            />
            <label
              htmlFor="phone"
              className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-transparent bg-[#292929] p-5 text-white hover:bg-[#233856] hover:text-white peer-checked:border-blue-500 peer-checked:bg-[#233856] peer-checked:text-white"
            >
              <div className="rounded-full bg-blue-500 p-2">
                <Smartphone className="h-4 w-4" />
              </div>
              <p className="mt-2 font-geist text-sm font-medium">
                Use phone number
              </p>
            </label>
          </li>

          <li onClick={() => onClickHandler("passkey")} className="col-span-2">
            <input
              type="radio"
              id="pass-key"
              name="contact_method"
              value="pass-key"
              className="peer hidden"
            />
            <label
              htmlFor="pass-key"
              className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-transparent bg-[#292929] p-5 text-white hover:bg-[#233856] hover:text-white peer-checked:border-blue-500 peer-checked:bg-[#233856] peer-checked:text-white"
            >
              <div className="rounded-full bg-blue-500 p-2">
                <Key className="h-4 w-4" />
              </div>
              <p className="mt-2 font-geist text-sm font-medium">Use passkey</p>
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Homepage;
