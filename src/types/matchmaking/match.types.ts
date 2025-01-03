export enum MatchStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

export interface MatchType {
  id: string;
  team1: string;
  team2: string;
  status: MatchStatus;
  createdAt: Date;
}
