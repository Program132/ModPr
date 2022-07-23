const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Give informations about the discord bot.'),
    async execute(interaction) {
        const InformationEmbed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("ModPr Informations")
            .setDescription("Give informations about ModPr.")
            .setAuthor({
                name: "Program",
                iconURL: "https://cdn.discordapp.com/attachments/793461922338045952/1000513773284638770/Program_Logo_V2.png",
                url: "https://program132.github.io/home.html"
            })
            .addFields
            (
                {
                    name: "Bases", value: "ModPr is a moderation bot, the bot has some commands for the moderations.", inline: true
                    },
                    {
                    name: "Why this project", value:"I want to help communities and it's nicer when you have a customizable discord bot.", inline: true
                    },
                    {
                    name: "Coding with a team", value:"Sadly no, I am working alone.", inline: true
                    }
            );

        await interaction.reply({embeds: [InformationEmbed]});
    },
};