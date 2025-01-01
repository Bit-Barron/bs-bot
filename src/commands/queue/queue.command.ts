import { Discord, Slash } from "discordx";

@Discord()
export class QueueCommand {
  @Slash({
    name: "queue",
    description: "Join the matchmaking queue",
  })
  async queue() {
    
  }
}
