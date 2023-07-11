const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Ставит твою любимую музыку")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("Загружает лучшую музыку по твоей ссылке")
				.addStringOption((option) => option.setName("url").setDescription("Ссылка на песню").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Загружает твой шикарный плейлист")
				.addStringOption((option) => option.setName("url").setDescription("Ссылка на плейлист").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Ищет твою музыку по ключевым словам")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("Ключевые слова").setRequired(true)
				)
		),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("Зайди сначала в голосовой чат, придурок")

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)
        
		let embed = new MessageEmbed()

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("Не знаю такого")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** была добавлена на нашу дискотеку`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Длительность: ${song.duration}`})

		} else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("Не знаю такого")
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} песен из шикарного плейлиста [${playlist.title}](${playlist.url})** были добавлены на нашу дискотеку`)
                .setThumbnail(playlist.thumbnail.url)
		} else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("Не знаю такого")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** была добавлена на нашу дискотеку`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Длительность: ${song.duration}`})
		}
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
        
	},
}