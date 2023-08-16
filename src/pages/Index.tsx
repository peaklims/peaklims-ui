import { useAuthUser } from "@/services/auth";

export function IndexPage() {
  const { user } = useAuthUser();
  return (
    <>
      <div className="">Dashboard for {user.name}</div>
    </>
  );
}
