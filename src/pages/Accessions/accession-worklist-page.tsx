import { useAccessioningWorklist } from "@/domain/accessions/apis/get-accession-worklist";
import { AccessionWorklist } from "@/domain/accessions/features/worklist/accession-worklist";
import { useAccessioningWorklistTableStore } from "@/domain/accessions/features/worklist/accession-worklist.store";
import { Helmet } from "react-helmet";
import { columns } from "../../domain/accessions/features/worklist/accession-worklist-columns";

export function AccessionWorklistPage() {
  return (
    <div className="">
      <Helmet>
        <title>Accessioning Worklist</title>
      </Helmet>

      <h1 className="text-4xl font-bold tracking-tight scroll-m-20">
        Accessioning Worklist
      </h1>
      <div className="pt-4">
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
    <AccessionWorklist
      columns={columns}
      data={data?.data ?? []}
      pagination={data?.pagination}
      isLoading={isLoading}
    />
  );
}
