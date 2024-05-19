import { PaginatedTableStore } from "@/components/data-table/types";
import { create } from "zustand";

export interface AccessioningWorklistTableStore extends PaginatedTableStore {
  status: string[];
  addStatus: (status: string) => void;
  removeStatus: (status: string) => void;
  clearStatus: () => void;
  filterInput: string | null;
  setFilterInput: (f: string | null) => void;
}

export const useAccessioningWorklistTableStore =
  create<AccessioningWorklistTableStore>((set, get) => ({
    initialPageSize: 10,
    pageNumber: 1,
    setPageNumber: (page) => set({ pageNumber: page }),
    pageSize: 10,
    setPageSize: (size) => set({ pageSize: size }),
    sorting: [],
    setSorting: (sortOrUpdater) => {
      if (typeof sortOrUpdater === "function") {
        set((prevState) => ({ sorting: sortOrUpdater(prevState.sorting) }));
      } else {
        set({ sorting: sortOrUpdater });
      }
    },
    status: [],
    addStatus: (status) =>
      set((prevState) => ({ status: [...prevState.status, status] })),
    removeStatus: (status) =>
      set((prevState) => ({
        status: prevState.status.filter((s) => s !== status),
      })),
    clearStatus: () => set({ status: [] }),
    filterInput: null,
    setFilterInput: (f) => set({ filterInput: f }),
    isFiltered: {
      result: () =>
        get().status.length > 0 || (get().filterInput?.length ?? 0) > 0,
    },
    resetFilters: () => set({ status: [], filterInput: null }),
    queryKit: {
      filterValue: () => {
        const statusFilter = get()
          .status.map((status) => `status == "${status}"`)
          .join(" || ");
        const accessionNumberFilter = get().filterInput
          ? `accessionNumber @=* "${get().filterInput}"`
          : "";
        if (statusFilter && accessionNumberFilter) {
          return `${statusFilter} && ${accessionNumberFilter}`;
        }
        if (statusFilter.length > 0) return statusFilter;
        if (accessionNumberFilter.length > 0) return accessionNumberFilter;
        return "";
      },
    },
  }));
