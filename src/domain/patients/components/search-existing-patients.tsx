import { PaginationControls } from "@/components/data-table/pagination";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
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
  RichDatePicker,
  getDateControlOnChangeValue,
  getDateControlValue,
} from "@/components/ui/rich-cal";
import {
  SetAccessionPatient,
  useSetAccessionPatient,
} from "@/domain/accessions/apis/set-accession-patient";
import { usePatientCardContext } from "@/domain/patients/components/patient-cards";
import { cn } from "@/lib/utils";
import { PagedResponse } from "@/types/apis";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnSort } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { FilterX, SearchIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useExistingPatientSearch } from "../apis/search-existing-patients";
import { getFullName, getSexDisplay } from "../patient.services";
import { PatientSearchResultDto } from "../types";

const filterFormSchema = z.object({
  filterInputValue: z.string().optional(),
  dateOfBirth: z.date().optional(),
});

export function SearchExistingPatients() {
  const [filterValue, setFilterValue] = useState<string>("");
  const { setAddPatientDialogIsOpen, setSearchExistingPatientsDialogIsOpen } =
    usePatientCardContext();

  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  const { data: searchResults, isLoading } = useExistingPatientSearch({
    sortOrder: [] as ColumnSort[],
    pageSize: pageSize,
    pageNumber: pageNumber,
    filters: filterValue,
    delayInMs: 450,
  });

  return (
    <div className="space-y-3">
      <FilterForm filterValue={filterValue} setFilterValue={setFilterValue} />

      <SearchPatientResults
        hasSearchValue={(filterValue?.length ?? 0) > 0}
        isLoading={isLoading}
        searchResults={searchResults}
        setPageSize={setPageSize}
        setPageNumber={setPageNumber}
      />

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

function FilterForm({
  filterValue,
  setFilterValue,
}: {
  filterValue: string;
  setFilterValue: (value: string) => void;
}) {
  const filterForm = useForm<z.infer<typeof filterFormSchema>>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      filterInputValue: filterValue,
      dateOfBirth: undefined,
    },
  });

  const filterInputValue = filterForm.watch("filterInputValue");

  const onSubmit = (data: z.infer<typeof filterFormSchema>) => {
    const filterInputValue = data.filterInputValue;
    if ((filterInputValue?.length ?? 0) <= 0) {
      setFilterValue("");
      return;
    }
    setFilterValue(`FirstName @=* "${filterInputValue}" 
      || LastName @=* "${filterInputValue}" 
      || InternalId @=* "${filterInputValue}" 
      || accessions.AccessionNumber @=* "${filterInputValue}"`);
  };
  return (
    <div className="flex space-x-3">
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
                  <RichDatePicker
                    {...field}
                    value={getDateControlValue(field.value)}
                    onChange={(value) => {
                      field.onChange(getDateControlOnChangeValue(value));
                    }}
                    maxValue={"today"}
                    isDisabled={true}
                  />
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
              disabled={(filterInputValue?.length ?? 0) <= 0}
            >
              <SearchIcon className="w-5 h-5 " />
            </Button>
            <Button
              variant="outline"
              className="w-1/2 rounded-l-none text-rose-400 md:w-auto hover:text-rose-600"
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
  );
}

export function SearchPatientResults({
  hasSearchValue,
  isLoading,
  searchResults,
  setPageSize,
  setPageNumber,
}: {
  hasSearchValue: boolean;
  isLoading: boolean;
  searchResults: PagedResponse<PatientSearchResultDto> | undefined;
  setPageSize: (value: number) => void;
  setPageNumber: (value: number) => void;
}) {
  const { accessionId, setSearchExistingPatientsDialogIsOpen } =
    usePatientCardContext();
  const setPatientApi = useSetAccessionPatient();
  const [activePatientId, setActivePatientId] = useState<string | undefined>(
    undefined
  );
  const detailSectionVariants = {
    open: { opacity: 1, height: "100%" },
    closed: { opacity: 0, height: "0%" },
  };
  const pagination = searchResults?.pagination;

  return (
    <div className="">
      <div className="h-[20rem] md:h-[30rem] bg-slate-50 rounded-t-md shadow-md overflow-y-auto">
        <div className="h-full p-2 space-y-3">
          {!hasSearchValue ? (
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
                    const name = getFullName(
                      patient?.firstName as string,
                      patient?.lastName as string
                    );
                    const sexDisplay = getSexDisplay(patient?.sex);
                    return (
                      <motion.div
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
                              <motion.div className="space-y-1 pt-0.5 flex-1">
                                <p className="text-slate-600">
                                  {patient?.age} year old {sexDisplay}
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
                              </motion.div>
                              <motion.div className="flex items-center justify-between pt-3 space-x-2 md:pt-0 md:justify-end md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                                <Button
                                  className="w-[48%]"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setActivePatientId(
                                      patient.id === activePatientId
                                        ? undefined
                                        : patient.id
                                    );
                                  }}
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
                              </motion.div>
                            </div>
                            <motion.div
                              className={cn(
                                patient.id !== activePatientId && "hidden",
                                "pl-5 pt-3 space-y-2"
                              )}
                              variants={detailSectionVariants}
                              initial="closed"
                              animate={
                                patient.id === activePatientId
                                  ? "open"
                                  : "closed"
                              }
                            >
                              <div className="">
                                <h3 className="font-medium">Accessions</h3>
                                {patient?.accessions?.length <= 0 ? (
                                  <p className="text-xs text-slate-600">
                                    This patient has no accessions
                                  </p>
                                ) : (
                                  <ul className="space-y-2">
                                    {patient?.accessions?.map((accession) => {
                                      return (
                                        <li key={accession.id} className="py-1">
                                          <div className="pl-4 border-l-2 border-slate-900 ">
                                            <p className="text-sm font-semibold text-slate-600/80">
                                              {accession.accessionNumber}
                                            </p>
                                          </div>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {pagination && (
        <PaginationControls
          entityPlural="patients"
          pageSize={pagination?.pageSize ?? 1}
          pageNumber={pagination?.pageNumber ?? 0}
          apiPagination={pagination}
          setPageSize={setPageSize}
          setPageNumber={setPageNumber}
          className="shadow bg-slate-50"
        />
      )}
    </div>
  );
}
