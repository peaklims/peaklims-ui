import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { peakLimsBff } from "./api-client";

const claimsApiKeys = {
  claims: ["claims"],
};

type ClaimsType = {
  type: string;
  value: string;
};

const fetchClaims = async (): Promise<ClaimsType[]> =>
  peakLimsBff.get("/user").then((res) => res.data);

function useClaims() {
  return useQuery({
    queryKey: claimsApiKeys.claims,
    queryFn: async () => {
      const delay = new Promise((resolve) => setTimeout(resolve, 550));
      return Promise.all([fetchClaims(), delay]).then(
        ([claims]) => claims as ClaimsType[]
      );
    },
    retry: false,
  });
}

export function login() {
  window.location.href = "/bff/login";
}

function useAuthUser() {
  const { data: claims, isLoading, isError } = useClaims();

  if (isError) login();

  const logoutUrl = claims?.find((claim) => claim.type === "bff:logout_url");
  const nameDict =
    claims?.find((claim) => claim.type === "name") ||
    claims?.find((claim) => claim.type === "sub");
  const username = nameDict?.value;
  const firstName = claims?.find((claim) => claim.type === "given_name");
  const lastName = claims?.find((claim) => claim.type === "family_name");
  const email = claims?.find((claim) => claim.type === "email");
  const organizationId = claims?.find(
    (claim) => claim.type === "organization_id"
  );
  const name = `${firstName?.value || ""} ${lastName?.value || ""}`;
  const initials = `${firstName?.value?.[0] || ""}${
    lastName?.value?.[0] || ""
  }`;

  const user: User = {
    username: username || "",
    firstName: firstName?.value || "",
    lastName: lastName?.value || "",
    email: email?.value || "",
    initials,
    name,
    organizationId: organizationId?.value || "",
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!username);
  }, [username]);

  return {
    user,
    logoutUrl: logoutUrl?.value,
    isLoading,
    isLoggedIn,
  };
}

export type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  initials: string;
  name: string;
  organizationId: string;
};

export { useAuthUser };
