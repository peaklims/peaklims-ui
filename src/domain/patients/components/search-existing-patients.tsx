import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
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
import {
  SetAccessionPatient,
  useSetAccessionPatient,
} from "@/domain/accessions/apis/set-accession-patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnSort } from "@tanstack/react-table";
import { FilterX, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useExistingPatientSearch } from "../apis/search-existing-patients";
import { usePatientCardContext } from "./patient-card/patient-card";

const filterFormSchema = z.object({
  filterInputValue: z.string().optional(),
  dateOfBirth: z.date().optional(),
});

export function SearchExistingPatients() {
  const pageSize = 10;
  const pageNumber = 1;
  const sorting = [] as ColumnSort[];

  const {
    setAddPatientDialogIsOpen,
    accessionId,
    setSearchExistingPatientsDialogIsOpen,
  } = usePatientCardContext();

  const [filterValue, setFilterValue] = useState<string>("");
  const setPatientApi = useSetAccessionPatient();

  const { data: searchResults, isLoading } = useExistingPatientSearch({
    sortOrder: sorting,
    pageSize,
    pageNumber,
    filters: filterValue,
    delayInMs: 450,
  });
  const filterForm = useForm<z.infer<typeof filterFormSchema>>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      filterInputValue: filterValue,
      dateOfBirth: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof filterFormSchema>) => {
    const filterInputValue = data.filterInputValue;
    if ((filterInputValue?.length ?? 0) <= 0) {
      console.log("resetting filter");
      setFilterValue("");
      return;
    }
    setFilterValue(`FirstName @=* "${filterInputValue}" 
      || LastName @=* "${filterInputValue}" 
      || InternalId @=* "${filterInputValue}" 
      || accessions.AccessionNumber @=* "${filterInputValue}"`);
  };

  // TODO as mutation or query? i think i should actually do a query with enabled using a `redoSearch` useState bool that will be set `true` onClick and then `false` after the query is done
  return (
    <div className="space-y-3">
      <div className="flex pt-4 space-x-3">
        <Form {...filterForm}>
          <form
            className="flex-1 space-y-3 md:space-y-0 md:space-x-3 md:flex md:items-end"
            onSubmit={filterForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={filterForm.control}
              name="filterInputValue"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Filter</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Search by name or identifiers"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* first name sounds like
or last name sounds like 
or full name sounds like
or internal id insensitive contains
or accession insensitive contains */}

            <FormField
              control={filterForm.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <DatePicker {...field} buttonClassName="w-full" disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="-space-x-px">
              <Button
                type="submit"
                variant={"outline"}
                className="w-1/2 rounded-r-none md:w-auto text-emerald-500 hover:text-emerald-600"
              >
                <SearchIcon className="w-5 h-5 " />
              </Button>
              <Button
                variant="outline"
                className="w-1/2 text-red-400 rounded-l-none md:w-auto hover:text-red-600"
                onClick={() => {
                  filterForm.reset();
                  setFilterValue("");
                }}
                disabled={(filterValue?.length ?? 0) <= 0}
              >
                <FilterX className="w-5 h-5 " />
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="h-[20rem] space-y-3 md:h-[30rem] p-2 overflow-y-auto bg-slate-50 rounded-md shadow-md">
        {(filterValue?.length ?? 0) <= 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center">No search query has been provided</p>
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {searchResults?.data.map((patient) => {
                  const name =
                    `${patient.firstName} ${patient.lastName}`.trimEnd();
                  return (
                    <div
                      className="group flex min-h-[5rem] overflow-hidden rounded-lg border border-emerald-500 shadow-md md:max-w-lg"
                      key={patient.id}
                    >
                      <div className="flex items-stretch flex-1 px-4 py-3 bg-slate-50">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <p className="text-lg font-semibold text-slate-800">
                              {name}
                            </p>
                            <p className="max-w-[7rem] mt-1 rounded bg-gradient-to-r from-emerald-400 to-emerald-600 px-1 py-1 text-xs font-bold text-white shadow-md">
                              {patient?.internalId}
                            </p>
                          </div>
                          <div className="text-sm sm:flex sm:items-end sm:justify-start">
                            <div className="space-y-1 pt-0.5 flex-1">
                              <p className="text-slate-600">
                                {patient?.age} year old {patient?.sex}
                              </p>
                              <div className="flex items-center justify-start space-x-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-4 h-4 text-slate-600"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z"
                                  />
                                </svg>
                                <p className="text-xs font-medium text-slate-600">
                                  {patient?.dateOfBirth?.toString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 space-x-2 md:pt-0 md:justify-end md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                              <Button
                                className="w-[48%]"
                                size="sm"
                                variant="outline"
                                onClick={() => console.log("temp")}
                              >
                                Details
                              </Button>
                              <Button
                                className="w-[48%]"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const dto = {
                                    accessionId,
                                    patientId: patient.id,
                                  } as SetAccessionPatient;
                                  setPatientApi
                                    .mutateAsync(dto)
                                    .then(() => {
                                      setSearchExistingPatientsDialogIsOpen(
                                        false
                                      );
                                    })
                                    .catch((err) => {
                                      console.log(err);
                                    });
                                }}
                              >
                                Assign
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
      <div className="flex justify-end pt-6 space-x-3">
        <Button
          variant={"outline"}
          onClick={() => setSearchExistingPatientsDialogIsOpen(false)}
        >
          Cancel
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            setSearchExistingPatientsDialogIsOpen(false);

            setTimeout(() => {
              setAddPatientDialogIsOpen(true);
            }, 400);
          }}
        >
          Close and Add New Patient
        </Button>
      </div>
    </div>
  );
}
