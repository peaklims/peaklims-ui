import { OrganizationContactDto } from "@/domain/organization-contacts/types";
import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { OrganizationContactKeys } from "./organization-contact.keys";

export const getContactsByOrganization = async (organizationId: string) => {
  return peakLimsApi
    .get(`/healthcareorganizationcontacts/byorganization/${organizationId}`)
    .then((response: AxiosResponse<OrganizationContactDto[]>) => response.data);
};

export const useGetContactsByOrganization = (organizationId: string) => {
  return useQuery({
    queryKey: OrganizationContactKeys.byOrg(organizationId),
    queryFn: () => getContactsByOrganization(organizationId),
    enabled: (organizationId.length ?? 0) > 0,
    gcTime: 2 * 60 * 1000,
  });
};
