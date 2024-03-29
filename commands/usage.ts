import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { guildModel, userModel } from "../lib/schema.js";
import { ClientMessages } from "../lib/messages.js";

export const data = new SlashCommandBuilder()
  .setName("usage")
  .setDescription("View the last couple links you have received, along with your usage")
  .setDMPermission(false);
  
export async function run(client: any, interaction: ChatInputCommandInteraction) {
  const gid: string = interaction.guild!.id;
  const doc = await guildModel.findOne({ GuildId: gid });
  if(!doc) return interaction.reply({
    content: ClientMessages.ERR_SERVER_NOT_FOUND,
    ephemeral: true
  });
  const user = await userModel.findOne({ UserId: interaction.user.id });
  if(!user) return interaction.reply({
      content: ClientMessages.ERR_YOU_HAVE_NOT_USED_BOT,
      ephemeral: true
  });
  if(!user.guilds.has(gid)) return interaction.reply({
    content: ClientMessages.ERR_YOU_HAVE_NOT_USED_BOT,
    ephemeral: true
  });
  const userGuild = user.guilds.get(gid)!;
  const links: string = userGuild.links.slice(0, doc.limit).join("\n");
  const embed = new EmbedBuilder()
    .addFields([
      { name: "Curent Usage", value: `${userGuild.uses} (out of ${doc.limit})` },
      { name: `Last ${doc.limit} links`, value: links }
    ]);
  interaction.reply({ embeds: [embed], ephemeral: true });
}