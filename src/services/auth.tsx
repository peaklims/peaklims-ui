import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const claimsKeys = {
  claim: ["claims"],
};

const config = {
  headers: {
    "X-CSRF": "1",
  },
};

const fetchClaims = async () =>
  axios.get("/bff/user", config).then((res) => res.data);

function useClaims() {
  return useQuery(
    claimsKeys.claim,
    async () => {
      const delay = new Promise((resolve) => setTimeout(resolve, 550));
      return Promise.all([fetchClaims(), delay]).then(([claims]) => claims);
    },
    {
      retry: false,
    }
  );
}

function useAuthUser() {
  const { data: claims, isLoading } = useClaims();

  const logoutUrl = claims?.find(
    (claim: any) => claim.type === "bff:logout_url"
  );
  const nameDict =
    claims?.find((claim: any) => claim.type === "name") ||
    claims?.find((claim: any) => claim.type === "sub");
  const username = nameDict?.value;
  const firstName = claims?.find((claim: any) => claim.type === "given_name");
  const lastName = claims?.find((claim: any) => claim.type === "family_name");
  const email = claims?.find((claim: any) => claim.type === "email");
  const name = `${firstName?.value} ${lastName?.value}`;
  const initials = `${firstName?.value[0]}${lastName?.value[0]}`;
  const user = {
    username,
    firstName,
    lastName,
    email,
    initials,
    name,
  } as User;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!username);
  }, [username]);

  return {
    user,
    logoutUrl: logoutUrl?.value ?? undefined,
    isLoading,
    isLoggedIn,
  } as {
    user: User;
    logoutUrl: string | undefined;
    isLoading: boolean;
    isLoggedIn: boolean;
  };
}

export type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  initials: string;
  name: string;
};

export { useAuthUser };
