import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { OrganizationDto } from "../types";
import { OrganizationKeys } from "./organization.keys";

export const getAllOrganizations = async () => {
  return peakLimsApi
    .get(`/healthcareOrganizations/all`)
    .then((response: AxiosResponse<OrganizationDto[]>) => response.data);
};

export const useGetAllOrganizations = () => {
  return useQuery({
    queryKey: OrganizationKeys.full(),
    queryFn: () => getAllOrganizations(),
  });
};

export const getAllOrganizationsForDropdown = async () => {
  return peakLimsApi
    .get(`/healthcareOrganizations/all`)
    .then((response: AxiosResponse<OrganizationDto[]>) => response.data)
    .then((organizations) =>
      organizations.map((organization) => ({
        label: organization.name,
        value: organization.id,
        disabled: organization.status === "Inactive",
      }))
    );
};

export const useGetAllOrganizationsForDropdown = () => {
  return useQuery({
    queryKey: OrganizationKeys.fullDropdown(),
    queryFn: () => getAllOrganizationsForDropdown(),
  });
};
