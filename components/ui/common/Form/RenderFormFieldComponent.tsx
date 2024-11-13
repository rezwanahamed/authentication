import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input"; 
  
  export const renderFormField = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any,
    name: string, 
    label: string,
    type: string,
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