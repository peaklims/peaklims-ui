import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { AccessionContactDto } from "../types";
import { AccessionContactKeys } from "./accession-contact.keys";

export const getContactsForAnAccession = async (accessionId: string) => {
  return peakLimsApi
    .get(`/accessioncontacts/byAccession/${accessionId}`)
    .then((response: AxiosResponse<AccessionContactDto[]>) => response.data);
};

export const useGetContactsForAnAccession = (
  accessionId: string | undefined
) => {
  return useQuery(
    AccessionContactKeys.byAccession(accessionId!),
    () => getContactsForAnAccession(accessionId!),
    {
      enabled: accessionId !== null && accessionId !== undefined,
    }
  );
};
