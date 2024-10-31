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
import { usePostData } from "@/lib/utils/useApiPost";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AxiosError } from "axios";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});

const LoginFormComponent = () => {
  const { postData } = usePostData();
  
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
      const response = await postData("/api/auth/login", values);
      
      if (response?.status === 200) {
        toast.success("OTP generated successfully", {
          position: "top-center",
        });
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("Full error object:", axiosError);

      if (axiosError.response?.status === 401) {
        toast.error("Invalid credentials", { position: "top-center" });
      } else if (axiosError.response?.status === 403) {
        toast.error("User not verified", { position: "top-center" });
      } else {
        toast.error(axiosError.message || "Server error", { position: "top-center" });
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

export default LoginFormComponent;