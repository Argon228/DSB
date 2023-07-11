const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Шафлит по просьбе Никиты"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("За пустой шафл тебя Никита забанит, падла")

		queue.shuffle()
        await interaction.editReply(`Очередь из ${queue.tracks.length} песен была перемешана`)
	},
}