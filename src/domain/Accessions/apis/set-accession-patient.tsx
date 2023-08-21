// import { generateSieveSortOrder } from "@/utils/sorting";
import { peakLimsApi } from "@/services/apiClient";
import { toDateOnly } from "@/utils/dates";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

const setAccessionPatient = async (data: SetAccessionPatient) => {
  const body = {
    accessionId: data.accessionId,
    patientId: data.patientId,
    patientForCreation: {
      firstName: data.patientForCreation?.firstName,
      lastName: data.patientForCreation?.lastName,
      dateOfBirth: toDateOnly(data.patientForCreation?.dateOfBirth),
      sex: data.patientForCreation?.sex,
      race: data.patientForCreation?.race,
      ethnicity: data.patientForCreation?.ethnicity,
    },
  };
  await peakLimsApi.put("/accessions/setPatient", body);
};

export type SetAccessionPatient = {
  accessionId: string;
  patientId?: string | undefined;
  patientForCreation?: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    sex: string;
    race?: string;
    ethnicity?: string;
  };
};

export function useSetAccessionPatient(
  options?: UseMutationOptions<void, AxiosError, SetAccessionPatient>
) {
  return useMutation<void, AxiosError, SetAccessionPatient>(
    setAccessionPatient,
    {
      ...options,
    }
  );
}
