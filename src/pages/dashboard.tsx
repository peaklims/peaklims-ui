import { useAuthUser } from "@/services/auth";
import { Helmet } from "react-helmet";

export function IndexPage() {
  const { user } = useAuthUser();
  return (
    <>
      <div className="">
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <p>Dashboard for {user.name}</p>
      </div>
    </>
  );
}
