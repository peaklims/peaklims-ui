import { peakLimsApi } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ContainerDto } from "../types";
import { ContainerKeys } from "./container.keys";

export const getAllContainers = async () => {
  return peakLimsApi
    .get(`/containers/all`)
    .then((response: AxiosResponse<ContainerDto[]>) => response.data);
};

export const useGetAllContainers = () => {
  return useQuery(ContainerKeys.full(), () => getAllContainers(), {});
};

export const getAllContainersForDropdown = async () => {
  return peakLimsApi
    .get(`/containers/all`)
    .then((response: AxiosResponse<ContainerDto[]>) => response.data)
    .then((Containers) =>
      Containers.map((Container) => ({
        label: Container.type,
        value: Container.id,
        disabled: Container.status === "Inactive",
      }))
    );
};

export const useGetAllContainersForDropdown = () => {
  return useQuery(
    ContainerKeys.fullDropdown(),
    () => getAllContainersForDropdown(),
    {}
  );
};
