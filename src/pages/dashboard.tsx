import { useAuthUser } from "@/services/auth";
import { getLocalTimeZone, today } from "@internationalized/date";

import React from "react";
import { Helmet } from "react-helmet";

export function IndexPage() {
  const { user } = useAuthUser();
  let [value, setValue] = React.useState(today(getLocalTimeZone()));

  return (
    <>
      <div className="">
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <div className="space-y-3">Dashboard</div>
      </div>
    </>
  );
}
