import { EmbedBuilder } from "discord.js";
import prisma from "../../utils/prisma";

export class CreateTeamService {
  public async createTeam() {
    const getTeam = await prisma.matchmaking.findMany();

    console.log(getTeam);
  }
}
