import { useAccessions } from "@/domain/Accessions/apis/GetAccessionList";
import { Helmet } from "react-helmet";
import { BasicAccessioningWorklist } from "./Worklist/BasicAccessioningWorklist";
import { columns } from "./Worklist/WorkListColumns";

export function AccessionWorklistPage() {
  const { data } = useAccessions();
  return (
    <div className="">
      <Helmet>
        <title>Accessioning Worklist</title>
      </Helmet>

      <h1>Accessioning Worklist</h1>
      <div className="pt-6">
        <BasicAccessioningWorklist columns={columns} data={data?.data ?? []} />
      </div>
    </div>
  );
}
