import {
  PaginatedDataTable,
  useAccessioningWorklistTableStore,
} from "@/components/data-table/paginated-data-table";
import { useAccessioningWorklist } from "@/domain/accessions/apis/get-accession-list";
import { Helmet } from "react-helmet";
import { columns } from "../../domain/accessions/components/worklist/accession-worklist-columns";

export function AccessionWorklistPage() {
  return (
    <div className="">
      <Helmet>
        <title>Accessioning Worklist</title>
      </Helmet>

      <h1 className="text-4xl font-bold tracking-tight scroll-m-20">
        Accessioning Worklist
      </h1>
      <div className="pt-6">
        <AccessioningWorklist />
      </div>
    </div>
  );
}

function AccessioningWorklist() {
  const { sorting, pageSize, pageNumber, queryKit } =
    useAccessioningWorklistTableStore();
  const { data, isLoading } = useAccessioningWorklist({
    sortOrder: sorting,
    pageSize,
    pageNumber,
    filters: queryKit.filterValue(),
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
