export function getSexDisplay(sex: string | null | undefined) {
  return sex === "Unknown" ? "(Sex Unknown)" : sex;
}

export function getFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
) {
  return [firstName, lastName].join(" ").trim();
}

export function getDisplayRace(race: string | null | undefined) {
  return race === "Unknown" ? `Unknown Race` : race;
}

export function getDisplayEthnicity(ethnicity: string | null | undefined) {
  return ethnicity === "Unknown" ? `Unknown Ethnicity` : ethnicity;
}

export function getDisplayRaceEthnicityCombo(
  race: string | null | undefined,
  ethnicity: string | null | undefined
) {
  let raceEth = "";
  const notGiven = "Not Given";

  if (race && ethnicity && race !== notGiven && ethnicity !== notGiven) {
    raceEth = `${race} (${ethnicity})`;
  } else if (race && race !== notGiven) {
    raceEth = race;
  } else if (ethnicity && ethnicity !== notGiven) {
    raceEth;
  }
  return raceEth;
}
