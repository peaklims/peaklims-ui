// import { generateSieveSortOrder } from "@/utils/sorting";
import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TestOrderDto, TestOrderForCreationDto } from "../types";

const addTestOrder = async ({
  accessionId,
  testOrderForCreation,
}: {
  accessionId: string;
  testOrderForCreation: TestOrderForCreationDto;
}): Promise<TestOrderDto> => {
  return await peakLimsApi
    .post(`/v1/testOrders/${accessionId}`, testOrderForCreation)
    .then((response) => response.data as TestOrderDto);
};

type MutationContext = {
  accessionId: string;
};

export function useAddTestOrder(
  options?: UseMutationOptions<
    TestOrderDto,
    AxiosError,
    { accessionId: string; testOrderForCreation: TestOrderForCreationDto },
    MutationContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    TestOrderDto,
    AxiosError,
    { accessionId: string; testOrderForCreation: TestOrderForCreationDto },
    MutationContext
  >({
    mutationFn: ({
      accessionId,
      testOrderForCreation,
    }: {
      accessionId: string;
      testOrderForCreation: TestOrderForCreationDto;
    }) => addTestOrder({ accessionId, testOrderForCreation }),
    onMutate: (variables) => {
      // Make `data` available for cache key
      return { accessionId: variables.accessionId };
    },
    onSuccess: (_, __, context: MutationContext | undefined) => {
      if (context) {
        queryClient.invalidateQueries(AccessionKeys.forEdits());
      }
    },
    ...options,
  });
}

const addPanelToAccession = async ({
  accessionId,
  panelId,
}: {
  accessionId: string;
  panelId: string;
}) => {
  return await peakLimsApi
    .post(
      `/v1/panels/toAccession?accessionId=${accessionId}&panelId=${panelId}`
    )
    .then((response) => response.data);
};

export function useAddPanelToAccession(
  options?: UseMutationOptions<
    TestOrderDto,
    AxiosError,
    { accessionId: string; panelId: string },
    MutationContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    TestOrderDto,
    AxiosError,
    { accessionId: string; panelId: string },
    MutationContext
  >({
    mutationFn: ({
      accessionId,
      panelId,
    }: {
      accessionId: string;
      panelId: string;
    }) => addPanelToAccession({ accessionId, panelId }),
    onMutate: (variables) => {
      return { accessionId: variables.accessionId };
    },
    onSuccess: (_, __, context: MutationContext | undefined) => {
      if (context) {
        queryClient.invalidateQueries(AccessionKeys.forEdits());
      }
    },
    ...options,
  });
}

export function useAddTestOrderForTest(
  options?: UseMutationOptions<
    TestOrderDto,
    AxiosError,
    { accessionId: string; testId: string },
    MutationContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    TestOrderDto,
    AxiosError,
    { accessionId: string; testId: string },
    MutationContext
  >({
    mutationFn: ({
      accessionId,
      testId,
    }: {
      accessionId: string;
      testId: string;
    }) => {
      const testOrderForCreation: TestOrderForCreationDto = { testId }; // Adjust if more fields are needed
      return addTestOrder({ accessionId, testOrderForCreation });
    },
    onMutate: (variables) => {
      return { accessionId: variables.accessionId };
    },
    onSuccess: (_, __, context: MutationContext | undefined) => {
      if (context) {
        queryClient.invalidateQueries(AccessionKeys.forEdits());
      }
    },
    ...options,
  });
}
