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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ethnicitiesDropdown } from "../types/ethnicities";
import { racesDropdown } from "../types/races";
import { sexesDropdown } from "../types/sexes";

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
    sex: z.string().nonempty("Sex is required"),
    race: z.string(),
    ethnicity: z.string(),
  });

  const patientForm = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      sex: "",
      dateOfBirth: undefined,
      race: "Not Given",
      ethnicity: "Not Given",
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
        <div className="flex-1 space-y-4">
          <FormField
            control={patientForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={true}>First Name</FormLabel>
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
                <FormLabel required={true}>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="col-span-1">
              <FormField
                control={patientForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={true}>Date of Birth</FormLabel>
                    <FormControl>
                      <DatePicker {...field} buttonClassName="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1">
              <FormField
                control={patientForm.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={true}>Sex</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sex" />
                        </SelectTrigger>
                        <SelectContent>
                          {sexesDropdown.map((sex) => (
                            <SelectItem key={sex.value} value={sex.value}>
                              {sex.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1">
              <FormField
                control={patientForm.control}
                name="race"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={false}>Race</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a race" />
                        </SelectTrigger>
                        <SelectContent>
                          {racesDropdown.map((race) => (
                            <SelectItem
                              key={race.value}
                              value={race.value}
                              className={
                                race.label === "" ? "hidden" : undefined
                              }
                            >
                              {race.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1">
              <FormField
                control={patientForm.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={false}>Ethnicity</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an ethnicity" />
                        </SelectTrigger>
                        <SelectContent>
                          {ethnicitiesDropdown.map((ethnicity) => (
                            <SelectItem
                              key={ethnicity.value}
                              value={ethnicity.value}
                              className={
                                ethnicity.label === "" ? "hidden" : undefined
                              }
                            >
                              {ethnicity.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-8">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

export default PatientForm;
