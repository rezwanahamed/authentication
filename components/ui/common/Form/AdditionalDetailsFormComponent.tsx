"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { appUrls } from "@/lib/config/appUrls";
import useObjectStore from "@/zustand/pageStatusCheckStore";
import useRegisterFormStore from "@/zustand/useRegisterFormStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { renderFormField } from "./RenderFormFieldComponent";

const formSchema = z.object({
  address: z.string().min(2),
  age: z.string().min(1),
  dateOfBirth: z.string().date(),
});

const AdditionalDetailsFormComponent = () => {
  const setValue = useObjectStore((state) => state.setValue);
  const [errorMessages, setErrorMessages] = useState([]);
  const { appendFormData } = useRegisterFormStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      age: "",
      dateOfBirth: "",
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
      setErrorMessages(errors as []);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    appendFormData(values);
    form.reset();
    setValue("password-page-access", true);
    router.push(appUrls.AUTH.PASSWORD);
    setErrorMessages([]);
  }

  return (
    <div className="font-geist_mono">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {renderFormField(form, "address", "Address", "text")}
          {renderFormField(form, "age", "Age", "text")}
          {renderFormField(form, "dateOfBirth", "Date of birth", "date")}

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

export default AdditionalDetailsFormComponent;
