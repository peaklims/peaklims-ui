type ClaimOverrides = {
  userId?: string | undefined;
  email?: string | undefined;
  username?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  organizationId?: string | undefined;
};

export async function setupUserClaims({
  context,
  overrides = {},
}: {
  context: any;
  overrides?: ClaimOverrides;
}) {
  // TODO faker
  const claims = {
    email: "test@example.com",
    username: "test-superuser",
    name: "Test SuperUser",
    firstName: "Test",
    lastName: "SuperUser",
    organizationId: "15bd4351-e666-4191-95ef-a94615aadc85",

    ...overrides,
  };

  const CLAIM_TYPE_EMAIL = "email";
  const CLAIM_TYPE_FIRST_NAME = "given_name";
  const CLAIM_TYPE_LAST_NAME = "family_name";
  const CLAIM_TYPE_ORGANIZATION_ID = "organization_id";
  const CLAIM_TYPE_USERNAME = "preferred_username";
  const CLAIM_TYPE_NAME = "name";

  const claimsArray = [
    { type: CLAIM_TYPE_EMAIL, value: claims.email },
    { type: CLAIM_TYPE_USERNAME, value: claims.username },
    { type: CLAIM_TYPE_FIRST_NAME, value: claims.firstName },
    { type: CLAIM_TYPE_LAST_NAME, value: claims.lastName },
    { type: CLAIM_TYPE_NAME, value: claims.name },
    { type: CLAIM_TYPE_ORGANIZATION_ID, value: claims.organizationId },
  ];

  await context.route("**/user", async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(claimsArray),
    });
  });

  return claimsArray;
}
