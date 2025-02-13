"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { apiUrls } from "@/lib/config/apiUrls";
import { appUrls } from "@/lib/config/appUrls";
import { encryptData } from "@/utils/cryptoUtils";
import { usePostData } from "@/utils/useApiPost";
import useRegisterFormStore from "@/zustand/useRegisterFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import zxcvbn from "zxcvbn";
import { renderFormField } from "./RenderFormFieldComponent";

const formSchema = z
  .object({
    password: z
      .string()
      .min(7, "Password must be at least 8 characters long")
      .max(32, "Password must be at most 32 characters long"),
    confirmPassword: z
      .string()
      .min(7, "Confirm password must be at least 8 characters long")
      .max(32, "Confirm password must be at most 32 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const PasswordComponent = () => {
  const { postData, isLoading } = usePostData();
  const router = useRouter();

  const { appendFormData, mergedData, clearFormData } = useRegisterFormStore();
  const [errorMessages, setErrorMessages] = useState<
    { field: string; message: string }[]
  >([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "password") {
        const result = zxcvbn(value.password || "");
        setPasswordStrength(result.score);
        setPasswordFeedback(
          result.feedback.warning || result.feedback.suggestions[0] || "",
        );
      }

      if (value.password === value.confirmPassword) {
        setErrorMessages([]);
        return;
      }

      if (form.formState.isValid) {
        setErrorMessages([]);
      } else {
        const errors = Object.entries(form.formState.errors).map(
          ([field, error]) => ({
            field,
            message: error.message || "",
          }),
        );
        setErrorMessages(errors);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    appendFormData(values);
    form.reset();
    setErrorMessages([]);
    setPasswordStrength(0);
    setPasswordFeedback("");

    const dataToSend = { ...mergedData, password: values?.password };

    try {
      const response = await postData(apiUrls.AUTH.REGISTER, dataToSend); // Use response directly
      if (response?.status === 201) {
        toast.success(
          "Your account has been created successfully, check your email to verify your account",
          {
            position: "top-center",
          },
        );
        const encrypt = encryptData(mergedData?.email as string);
        router.push(`${appUrls.AUTH.REGISTER_OTP_VERIFICATION}/${encrypt}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.status === 400) {
        toast.error("User already exists", { position: "top-center" });
        router.push(appUrls.AUTH.SIGN_UP);
      } else if (error?.status === 401) {
        toast.error("This phone number is already used", {
          position: "top-center",
        });
        router.push(appUrls.AUTH.SIGN_UP);
      } else {
        toast.error(error.message || "Server error", {
          position: "top-center",
        });
      }
    } finally {
      clearFormData();
    }
  }

  const getStrengthColor = (strength: number) => {
    const colors = [
      "bg-red-600",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-blue-500",
    ];
    return colors[strength] || colors[0];
  };

  const getStrengthText = (strength: number) => {
    const texts = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
    return texts[strength];
  };

  return (
    <div className="font-geist_mono">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {renderFormField(form, "password", "Password", "password")}
          {renderFormField(
            form,
            "confirmPassword",
            "Confirm password",
            "password",
          )}

          <div className="password-strength space-y-2">
            <div className="flex w-full items-center gap-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`progress-bar h-2 w-full rounded-full ${
                    index <= passwordStrength
                      ? getStrengthColor(passwordStrength)
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm">{getStrengthText(passwordStrength)}</p>
            {passwordFeedback && (
              <p className="text-sm text-yellow-500">{passwordFeedback}</p>
            )}
          </div>

          {errorMessages.length > 0 && (
            <div className="warnings flex w-full items-start gap-2 rounded-sm bg-[#3b3221] p-3 text-sm text-yellow-500">
              <span>
                <ShieldAlert className="h-5 w-5" />
              </span>
              <ul>
                {errorMessages.map(({ field, message }, index) => (
                  <li key={index}>{`${field}: ${message}`}</li>
                ))}
              </ul>
            </div>
          )}
          {isLoading ? (
            <Button className="w-full border border-blue-500 bg-blue-500 font-geist duration-300 hover:bg-transparent hover:text-blue-500">
              <svg
                aria-hidden="true"
                role="status"
                className="me-3 inline h-4 w-4 animate-spin text-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </Button>
          ) : (
            <Button
              className="w-full border border-blue-500 bg-blue-500 font-geist duration-300 hover:bg-transparent hover:text-blue-500"
              type="submit"
            >
              Submit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default PasswordComponent;
