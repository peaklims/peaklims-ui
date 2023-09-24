// import { generateSieveSortOrder } from "@/utils/sorting";
import { peakLimsApi } from "@/services/api-client";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
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
    .post(`/testOrders/${accessionId}`, testOrderForCreation)
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
  return useMutation<
    TestOrderDto,
    AxiosError,
    { accessionId: string; testOrderForCreation: TestOrderForCreationDto },
    MutationContext
  >(
    ({
      accessionId,
      testOrderForCreation,
    }: {
      accessionId: string;
      testOrderForCreation: TestOrderForCreationDto;
    }) => {
      return addTestOrder({ accessionId, testOrderForCreation });
    },
    {
      onMutate: (variables) => {
        // Make `data` available for cache key
        return { accessionId: variables.accessionId };
      },
      // onSuccess: (_, __, context: MutationContext | undefined) => {
      //   if (context) {
      //     queryClient.invalidateQueries(
      //       // TestOrderKeys.detail(context.testOrderId)
      //     );
      //   }
      // },
      ...options,
    }
  );
}

export function useAddTestOrderForPanel(
  options?: UseMutationOptions<
    TestOrderDto,
    AxiosError,
    { accessionId: string; panelId: string },
    MutationContext
  >
) {
  return useMutation<
    TestOrderDto,
    AxiosError,
    { accessionId: string; panelId: string },
    MutationContext
  >(
    ({ accessionId, panelId }: { accessionId: string; panelId: string }) => {
      const testOrderForCreation: TestOrderForCreationDto = { panelId };
      return addTestOrder({ accessionId, testOrderForCreation });
    },
    {
      onMutate: (variables) => {
        // Make `data` available for cache key
        return { accessionId: variables.accessionId };
      },
      // onSuccess: (_, __, context: MutationContext | undefined) => {
      //   if (context) {
      //     queryClient.invalidateQueries(
      //       // TestOrderKeys.detail(context.testOrderId)
      //     );
      //   }
      // },
      ...options,
    }
  );
}

export function useAddTestOrderForTest(
  options?: UseMutationOptions<
    TestOrderDto,
    AxiosError,
    { accessionId: string; testId: string },
    MutationContext
  >
) {
  return useMutation<
    TestOrderDto,
    AxiosError,
    { accessionId: string; testId: string },
    MutationContext
  >(
    ({ accessionId, testId }: { accessionId: string; testId: string }) => {
      const testOrderForCreation: TestOrderForCreationDto = { testId };
      return addTestOrder({ accessionId, testOrderForCreation });
    },
    {
      onMutate: (variables) => {
        // Make `data` available for cache key
        return { accessionId: variables.accessionId };
      },
      // onSuccess: (_, __, context: MutationContext | undefined) => {
      //   if (context) {
      //     queryClient.invalidateQueries(
      //       // TestOrderKeys.detail(context.testOrderId)
      //     );
      //   }
      // },
      ...options,
    }
  );
}
