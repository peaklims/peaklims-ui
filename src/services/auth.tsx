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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!username);
  }, [username]);

  return {
    username,
    logoutUrl,
    isLoading,
    isLoggedIn,
  };
}

export { useAuthUser };
