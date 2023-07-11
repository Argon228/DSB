const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("quit").setDescription("Уничтожает бедного бота(что ты наделал!)"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Я не здесь, придурок")

		queue.destroy()
        await interaction.editReply("За чтоооооооооооооооооооооооооооооооооо?")
	},
}