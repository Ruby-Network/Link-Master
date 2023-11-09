import { ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType } from "discord.js";
import resetUser from "../lib/resetUser.ts";

export const data = new ContextMenuCommandBuilder()
  .setName("Reset Usage")
  .setType(ApplicationCommandType.User)
  .setDefaultMemberPermissions(8)
  .setDMPermission(false);

export async function run(client: any, interaction: any) {
  // @ts-ignore DM permission is set to false, guild.id cannot be null
  const data = await resetUser(interaction.targetUser.id, interaction.guild.id);
  if(!data.done) return interaction.reply({
    content: "User not found in database!",
    ephemeral: true
  });
  const embed = new EmbedBuilder()
    .setDescription(`✅ Reset usage (${data.oldUsage}) for <@${interaction.targetUser.id}>`);
  interaction.reply({ embeds: [embed], ephemeral: true });
}