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
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters long",
    }),
    lastName: z.string(),
    email: z.string().email(),
    age: z.number(),
    phone: z.number(),
    dateOfBirth: z.string().date(),
    password: z.string().min(8).max(32),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const LoginFormComponent = () => {
  const [errorMessages, setErrorMessages] = useState([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 0,
      phone: 0,
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      const errors = Object.entries(form.formState.errors).map(
        ([field, error]) => ({
          field,
          message: error.message,
        }),
      );
      setErrorMessages(errors);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.warn("Form submitted with values:", values);
    form.reset();
    setErrorMessages([]);
  }

  const renderFormField = (
    name: string,
    label: string,
    type: string = "text",
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={form.formState.errors[name] ? "text-red-500" : ""}
          >
            {label}
          </FormLabel>
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
          {renderFormField("email", "Email", "password")}
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
