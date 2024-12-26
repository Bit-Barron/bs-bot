export const parseTeamCode = (teamCode: string): string => {
  teamCode = teamCode.trim().toUpperCase();

  const validFormat = /^[A-Z0-9]{6,8}$/;
  if (!validFormat.test(teamCode)) {
    throw new Error("Invalid team code format");
  }

  return teamCode;
};
