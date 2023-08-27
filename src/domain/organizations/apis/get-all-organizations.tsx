import { peakLimsApi } from "@/services/apiClient";
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
  return useQuery(OrganizationKeys.full(), () => getAllOrganizations(), {});
};

export const getAllOrganizationsForDropdown = async () => {
  return peakLimsApi
    .get(`/healthcareOrganizations/all`)
    .then((response: AxiosResponse<OrganizationDto[]>) => response.data)
    .then((organizations) =>
      organizations.map((organization) => ({
        label: organization.name,
        value: organization.id,
      }))
    );
};

export const useGetAllOrganizationsForDropdown = () => {
  return useQuery(
    OrganizationKeys.full(),
    () => getAllOrganizationsForDropdown(),
    {}
  );
};
