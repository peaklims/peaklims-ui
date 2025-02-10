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
      const delay = new Promise((resolve) => setTimeout(resolve, 0));
      return Promise.all([fetchClaims(), delay]).then(
        ([claims]) => claims as ClaimsType[]
      );
    },
    retry: false,
    gcTime: Infinity,
    staleTime: Infinity,
  });
}

export function login() {
  window.location.href = "/bff/login";
}

function useAuthUser() {
  const { data: claims, isLoading, isError } = useClaims();
  if (isError) login();

  const logoutUrl = claims?.find((claim) => claim.type === "bff:logout_url");
  const username = claims?.find((claim) => claim.type === "preferred_username"); // nameDict?.value;
  const firstName = claims?.find((claim) => claim.type === "given_name");
  const lastName = claims?.find((claim) => claim.type === "family_name");
  const email = claims?.find((claim) => claim.type === "email");
  const organizationId = claims?.find(
    (claim) => claim.type === "organization_id"
  );
  const name = claims?.find((claim) => claim.type === "name");
  const initials = `${firstName?.value?.[0] || ""}${
    lastName?.value?.[0] || ""
  }`;

  const user: User = {
    username: username?.value || "",
    firstName: firstName?.value || "",
    lastName: lastName?.value || "",
    email: email?.value || "",
    initials,
    name: name?.value || "",
    organizationId: organizationId?.value || "",
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!username);
  }, [username]);

  const response = {
    user,
    logoutUrl: logoutUrl?.value,
    isLoading,
    isLoggedIn,
  };

  return response;
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
