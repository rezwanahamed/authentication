"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
  const { postData } = usePostData();
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
      const response = await postData("/api/auth/register", dataToSend); // Use response directly
      if (response?.status === 201) {
        toast.success(
          "Your account has been created successfully, check your email to verify your account",
          {
            position: "top-center",
          },
        );
        const encrypt = encryptData(mergedData?.email as string);
        router.push(`/registration-verification-otp/${encrypt}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.status === 400) {
        toast.error("User already exists", { position: "top-center" });
        router.push("/register");
      } else if (error?.status === 401) {
        toast.error("This phone number is already used", {
          position: "top-center",
        });
        router.push("/register");
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

          <Button
            className="w-full border border-blue-500 bg-blue-500 font-geist duration-300 hover:bg-transparent hover:text-blue-500"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PasswordComponent;
