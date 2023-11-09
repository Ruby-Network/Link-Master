import { EmbedBuilder } from "discord.js";
import { guildModel, userModel } from "./schema.ts";
import { ClientMessages } from "./messages.ts";

export default async function viewUser(user: any, GuildId: string) {
  const doc = await guildModel.findOne({ GuildId });
  if(!doc) return {
    content: ClientMessages.ERR_SERVER_NOT_FOUND,
    ephemeral: true
  };
  const userData = await userModel.findOne({ UserId: user.id });
  if(!userData) return {
    content: ClientMessages.ERR_USER_NOT_USED_BOT,
    ephemeral: true
  };
  if(!userData.guilds[GuildId]) return {
    content: ClientMessages.ERR_USER_NOT_USED_BOT,
    ephemeral: true
  };
  const links: string = userData.guilds[GuildId].links.slice(0, doc.limit).join("\n");
  const embed = new EmbedBuilder()
    .setAuthor({ name: `Usage data for ${user.tag}`, iconURL: user.displayAvatarURL() })
    .addFields([
      { name: "Curent Usage", value: `${userData.guilds[GuildId].uses} (out of ${doc.limit})` },
      { name: `Last ${doc.limit} links`, value: links }
    ]);
  return { embeds: [embed], ephemeral: true };
}