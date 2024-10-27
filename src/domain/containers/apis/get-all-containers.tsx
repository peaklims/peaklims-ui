import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ContainerDto } from "../types";
import { ContainerKeys } from "./container.keys";

export const getAllContainers = async () => {
  return peakLimsApi
    .get(`/v1/containers/all`)
    .then((response: AxiosResponse<ContainerDto[]>) => response.data);
};

export const useGetAllContainers = () => {
  return useQuery({
    queryKey: ContainerKeys.full(),
    queryFn: () => getAllContainers(),
  });
};

export const getAllContainersForDropdown = async (
  sampleType: string | null
) => {
  return sampleType === null || sampleType === undefined || sampleType === ""
    ? peakLimsApi
        .get(`/v1/containers/all`)
        .then((response: AxiosResponse<ContainerDto[]>) => response.data)
        .then((Containers) =>
          Containers.map((Container) => ({
            label: Container.type,
            value: Container.id,
          }))
        )
    : peakLimsApi
        .get(`/v1/containers/all?sampleType=${sampleType}`)
        .then((response: AxiosResponse<ContainerDto[]>) => response.data)
        .then((Containers) =>
          Containers.map((Container) => ({
            label: Container.type,
            value: Container.id,
          }))
        );
};

export const useGetAllContainersForDropdown = (sampleType: string | null) => {
  return useQuery({
    queryKey: ContainerKeys.fullDropdownForSampleType(sampleType),
    queryFn: () => getAllContainersForDropdown(sampleType),
  });
};
