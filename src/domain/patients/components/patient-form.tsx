import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";

function PatientForm() {
  const patientFormSchema = z.object({
    firstName: z.string().nonempty("First Name is required"),
    lastName: z.string().nonempty("Last Name is required"),
    dateOfBirth: z
      .date({
        required_error: "Date of Birth is required",
      })
      .refine((dob) => dob <= new Date(), {
        message: "Date of Birth must not be in the future.",
      }),
  });

  const patientForm = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof patientFormSchema>) {
    console.log(values);
  }

  return (
    <Form {...patientForm}>
      <form
        onSubmit={patientForm.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 space-y-3">
          <FormField
            control={patientForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={patientForm.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid w-full grid-cols-2 gap-x-3">
            <div className="col-span-1">
              <FormField
                control={patientForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <DatePicker {...field} buttonClassName="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1">TBD</div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

export default PatientForm;
