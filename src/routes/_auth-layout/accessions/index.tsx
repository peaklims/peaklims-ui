import { useAccessioningWorklist } from "@/domain/accessions/apis/get-accession-worklist";
import { AccessionWorklist } from "@/domain/accessions/features/worklist/accession-worklist";
import { columns } from "@/domain/accessions/features/worklist/accession-worklist-columns";
import { useAccessioningWorklistTableStore } from "@/domain/accessions/features/worklist/accession-worklist.store";
import { createFileRoute } from "@tanstack/react-router";
import { Helmet, HelmetProvider } from "react-helmet-async";

export const Route = createFileRoute("/_auth-layout/accessions/")({
  component: AccessionWorklistPage,
});

function AccessionWorklistPage() {
  return (
    <div className="">
      <HelmetProvider>
        <Helmet>
          <title>Accessioning Worklist</title>
        </Helmet>
      </HelmetProvider>

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
