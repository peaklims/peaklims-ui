import { LoadingSpinner } from "@/components/loading-spinner";
import { Notification } from "@/components/notifications";
import { PatientAvatar } from "@/components/svgs/patient-avatar";
import { Button } from "@/components/ui/button";
import { useRemoveAccessionPatient } from "@/domain/accessions/apis/remove-accession-patient";
import {
  AddPatientButton,
  SearchExistingPatientsButton,
  usePatientCardContext,
} from "@/domain/patients/components/patient-cards";
import {
  getDisplayRaceEthnicityCombo,
  getFullName,
} from "@/domain/patients/patient.services";
import { EditPatientButton } from "./edit-patient-button";

export type PatientForCard = {
  id: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  dateOfBirth?: Date;
  race?: string;
  ethnicity?: string;
  internalId: string;
  sex: string;
};

export function PatientCard({ patientInfo }: { patientInfo: PatientForCard }) {
  const accessionId = usePatientCardContext().accessionId;
  const removeAccessionApi = useRemoveAccessionPatient();
  function removePatientFromAccession() {
    removeAccessionApi.mutateAsync(accessionId!).catch((e) => {
      Notification.error(
        "There was an error removing the patient from this accession"
      );
      console.error(e);
    });
  }

  const firstName = patientInfo?.firstName ?? "";
  const lastName = patientInfo?.lastName ?? "";
  const name = getFullName(firstName, lastName);
  const raceEth = getDisplayRaceEthnicityCombo(
    patientInfo?.race,
    patientInfo?.ethnicity
  );

  const sexDisplay =
    patientInfo?.sex === "Unknown" ? "(Sex Unknown)" : patientInfo?.sex;

  return (
    <BaseCard>
      <div className="flex items-stretch flex-1 px-4 py-3 bg-slate-50">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <p className="text-lg text-slate-800">{name}</p>
            <p className="max-w-[7rem] mt-1 rounded bg-gradient-to-r from-emerald-400 to-emerald-600 px-1 py-1 text-2xs font-bold text-white shadow-md">
              {patientInfo?.internalId}
            </p>
          </div>
          <div className="sm:flex sm:items-end sm:justify-start">
            <div className="flex-1 space-y-1">
              <p className="text-sm text-slate-600">
                {patientInfo?.age} year old {sexDisplay}
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
                <p className="font-medium text-2xs text-slate-600">
                  {patientInfo?.dateOfBirth?.toString()}
                </p>
              </div>
              <p className="pr-2 font-medium text-2xs text-slate-600">
                {raceEth}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 space-x-2 md:pt-0 md:justify-end md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
              <EditPatientButton patientId={patientInfo.id} />
              <Button
                className="w-[48%] px-3"
                size="sm"
                variant="outline"
                onClick={removePatientFromAccession}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}

function BaseCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="group flex min-h-[5rem] overflow-hidden rounded-lg border border-emerald-500 shadow-md max-w-lg min-w-[20rem] sm:min-w-[30rem]">
      <div className="flex items-center justify-center px-2 py-2 border shadow-sm border-emerald-500 bg-emerald-500 shadow-emerald-700">
        <div className="p-1 border border-white rounded-full">
          <PatientAvatar className="w-4 h-4 text-white" />
        </div>
      </div>
      {children}
    </div>
  );
}

export function EmptyPatientCard() {
  return (
    <BaseCard>
      <div className="flex items-center flex-1 px-4 py-3 bg-slate-50">
        <div className="flex items-center justify-between w-full">
          <p className="select-none text-slate-800">No patient selected</p>
          <div className="flex space-x-2">
            <SearchExistingPatientsButton />
            <AddPatientButton />
          </div>
        </div>
      </div>
    </BaseCard>
  );
}

export function LoadingPatientCard() {
  return (
    <BaseCard>
      <div className="flex items-center justify-center flex-1 px-4 py-3 bg-slate-50">
        <LoadingSpinner />
      </div>
    </BaseCard>
  );
}
