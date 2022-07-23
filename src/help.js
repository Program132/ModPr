const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Command to help administrators of a server.'),
    async execute(interaction) {
        const author = interaction.member;

        const AdminEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("ModPr | Admin Help")
            .setDescription("Command to help administrators.")
            .setAuthor({
                name: "Program",
                iconURL: "https://cdn.discordapp.com/attachments/793461922338045952/1000513773284638770/Program_Logo_V2.png",
                url: "https://program132.github.io/home.html"
            })
            .addFields
            (
                {
                    name: "Start", value: "To start, you have the command **init** to give us informations about your server. \n" +
                        "Firstly, the channel id of your logs and the role id which will be the role added to the member once he joined. \n" +
                        "You will have to give a first argument, it can be : `logs`,  `role`. Then you give the ID (in the second argument)."
                }
            );

        try {
            if (author.permissions.has(PermissionsBitField.Flags.Administrator)) {
                await interaction.reply({embeds: [AdminEmbed]});
            }
        } catch (err) {
            await interaction.reply('ModPr Error: You have not the permission to execute this command.');
        }
    },
};