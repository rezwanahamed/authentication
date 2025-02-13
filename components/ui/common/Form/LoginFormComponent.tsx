"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiUrls } from "@/lib/config/apiUrls";
import { appUrls } from "@/lib/config/appUrls";
import { encryptData } from "@/utils/cryptoUtils";
import { usePostData } from "@/utils/useApiPost";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

const LoginFormComponent = () => {
  const { postData, isLoading } = usePostData();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    form.reset();

    try {
      const response = await postData(apiUrls.AUTH.LOGIN, values);

      if (response?.status === 200) {
        const encrypt = encryptData(values?.email as string);
        router.push(`${appUrls.AUTH.SIGN_IN_VERIFICATION}/${encrypt}`);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Full error object:", axiosError);

      if (axiosError.response?.status === 401) {
        toast.error("Invalid credentials", { position: "top-center" });
      } else if (axiosError.response?.status === 403) {
        toast.error("User not verified", { position: "top-center" });
      } else {
        toast.error(axiosError.message || "Server error", {
          position: "top-center",
        });
      }
    }
  }

  const renderFormField = (
    name: "email" | "password",
    label: string,
    type: string = "text",
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              className={`border-gray-500 focus:border-blue-500 ${
                form.formState.errors[name] ? "border-red-500" : ""
              }`}
              type={type}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );

  return (
    <div className="font-geist_mono">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {renderFormField("email", "Email", "email")}
          {renderFormField("password", "Password", "password")}

          {isLoading ? (
            <Button
              className="w-full border border-blue-500 bg-blue-500 font-geist duration-300 hover:bg-transparent hover:text-blue-500"
            >
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

export default LoginFormComponent;
