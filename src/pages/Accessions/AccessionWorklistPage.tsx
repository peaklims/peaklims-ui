import { useAccessions } from "@/domain/Accessions/apis/GetAccessionList";
import { Helmet } from "react-helmet";
import {
  PaginatedDataTable,
  PaginatedTableProvider,
  usePaginatedTableContext,
} from "./Worklist/BasicAccessioningWorklist";
import { columns } from "./Worklist/WorkListColumns";

export function AccessionWorklistPage() {
  return (
    <div className="">
      <Helmet>
        <title>Accessioning Worklist</title>
      </Helmet>

      <h1>Accessioning Worklist</h1>
      <div className="pt-6">
        <PaginatedTableProvider>
          <AccessioningWorklist />
        </PaginatedTableProvider>
      </div>
    </div>
  );
}

function AccessioningWorklist() {
  const { sorting, pageSize, pageNumber } = usePaginatedTableContext();
  const { data, isLoading } = useAccessions({
    sortOrder: sorting,
    pageSize,
    pageNumber,
    delayInMs: 450,
  });
  return (
    <PaginatedDataTable
      columns={columns}
      data={data?.data ?? []}
      pagination={data?.pagination}
      isLoading={isLoading}
    />
  );
}
