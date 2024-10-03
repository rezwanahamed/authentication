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
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters long",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters long",
  }),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
});

const RegisterFormComponent = () => {
  const [errorMessages, setErrorMessages] = useState<
    Array<{ field: string; message: string }>
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      const errors = Object.entries(form.formState.errors).map(
        ([field, error]) => ({
          field,
          message: error?.message || "",
        }),
      );
      setErrorMessages(errors);
    });
    return () => subscription.unsubscribe();
  }, [form, form.formState.errors]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.warn("Form submitted with values:", values);
    form.reset();
    setErrorMessages([]);
  }

  return (
    <div className="font-geist_mono">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <PhoneInput
                    placeholder="Enter phone number"
                    defaultCountry="BD"
                    international
                    countryCallingCodeEditable={true}
                    value={field.value as string | undefined}
                    onChange={(value) => field.onChange(value || "")}
                       className="input-phone flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormControl>
              </FormItem>
            )}
          />

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
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterFormComponent;
