const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("repeat")
		.setDescription("Повторяет одну и ту же песню(она же так хороша)"),
		run: async ({ client, interaction }) => {
			const queue = client.player.getQueue(interaction.guildId)
	
			if (!queue) return await interaction.editReply("Повторение nothing не являетcя repeat")
			const currentSong = queue.current
			for(let i = 0; i < 50; i++){
				await queue.addTrack(currentSong)
			}
			await interaction.editReply({
				embeds: [
					new MessageEmbed().setDescription(`${currentSong.title} кому-то очень сильно нравится... Придётся слушать её вечно`).setThumbnail(currentSong.thumbnail)
				]
			})
	},
}