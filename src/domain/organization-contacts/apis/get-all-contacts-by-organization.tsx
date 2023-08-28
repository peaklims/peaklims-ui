import { OrganizationContactDto } from "@/domain/organization-contacts/types";
import { peakLimsApi } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { OrganizationContactKeys } from "./organization-contact.keys";

export const getContactsByOrganization = async (organizationId: string) => {
  return peakLimsApi
    .get(`/healthcareorganizationcontacts/byorganization/${organizationId}`)
    .then((response: AxiosResponse<OrganizationContactDto[]>) => response.data);
};

export const useGetContactsByOrganization = (organizationId: string) => {
  return useQuery(
    OrganizationContactKeys.byOrg(organizationId),
    () => getContactsByOrganization(organizationId),
    {
      enabled: organizationId !== null && organizationId !== undefined,
    }
  );
};
