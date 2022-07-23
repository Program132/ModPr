const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField} = require('discord.js');
const fs = require("fs");
let logs = require("../src/data/logs.json");
let memberrole = require("../src/data/memberrole.json");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('Command to give the channel id of logs, the member role.')
        .addStringOption(option =>
        option.setName('option')
            .setDescription('Choose the option.')
            .setRequired(true)
            .addChoices(
                { name: 'Logs', value: 'logs' },
                { name: 'Member Role', value: 'memberrole' },
            ))
        .addStringOption(option =>
            option.setName('argument')
            .setDescription('Give us the argument.')
            .setRequired(true)),
    async execute(interaction) {
        const guild = interaction.guild;
        const author = interaction.member;

        try {
            if (author.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const choice = interaction.options.getString("option");

                if (choice == "memberrole") {
                    if (guild.roles.cache.find(x => x.id == interaction.options.getString("argument"))) {
                        if (!memberrole[guild.id]) {
                            memberrole[guild.id] = {
                                "role": interaction.options.getString("argument")
                            }
                        } else {
                            memberrole[guild.id] = {
                                "role": interaction.options.getString("argument")
                            }
                        }
                        fs.writeFile("./src/data/memberrole.json", JSON.stringify(memberrole), function(err) { if (err) console.log(err); })

                        const MemberRole = guild.roles.cache.get(interaction.options.getString("argument"));
                        const MemeberRoleEmbed = new EmbedBuilder()
                            .setColor("DarkAqua")
                            .setTitle("ModPr | Member Role Config")
                            .setAuthor({
                                name: "Program",
                                iconURL: "https://cdn.discordapp.com/attachments/793461922338045952/1000513773284638770/Program_Logo_V2.png",
                                url: "https://program132.github.io/home.html"
                            })
                            .addFields
                            (
                                {
                                    name: "Logs Channel Defined", value: "Thanks for adding your member role. \n" +
                                        "Name: " + MemberRole.name + "\n" +
                                        "ID: " + MemberRole.id
                                }
                            );

                        if (logs[guild.id]) {
                            const LogsChannel = guild.channels.cache.get(logs[guild.id]["id"]);
                            if (LogsChannel.id != interaction.channel.id) {
                                await LogsChannel.send({embeds: [MemeberRoleEmbed]});
                            }
                        }

                        await interaction.reply({embeds: [MemeberRoleEmbed]});
                    } else {
                        await interaction.reply("ModPr Error: The role does not exist.");
                    }
                }
                else if (choice == "logs") {
                    if (guild.channels.cache.find(x => x.id == interaction.options.getString("argument"))) {
                        if (!logs[guild.id]) {
                            logs[guild.id] = {
                                "id": interaction.options.getString("argument")
                            }
                        } else {
                            logs[guild.id] = {
                                "id": interaction.options.getString("argument")
                            }
                        }
                        fs.writeFile("./src/data/logs.json", JSON.stringify(logs), function(err) { if (err) console.log(err); })

                        const LogsChannel = guild.channels.cache.get(interaction.options.getString("argument"));
                        const LogsEmbed = new EmbedBuilder()
                            .setColor("DarkAqua")
                            .setTitle("ModPr | Logs Channel Config")
                            .setAuthor({
                                name: "Program",
                                iconURL: "https://cdn.discordapp.com/attachments/793461922338045952/1000513773284638770/Program_Logo_V2.png",
                                url: "https://program132.github.io/home.html"
                            })
                            .addFields
                            (
                                {
                                    name: "Logs Channel Defined", value: "Thanks for adding your channel logs. \n" +
                                        "Name: " + LogsChannel.name + "\n" +
                                        "ID: " + LogsChannel.id
                                }
                            );

                        if (LogsChannel.id != interaction.channel.id) {
                            await LogsChannel.send({embeds: [LogsEmbed]});
                        }
                        await interaction.reply({embeds: [LogsEmbed]});
                    } else {
                        await interaction.reply("ModPr Error: The channel does not exist.");
                    }
                }
            }
        } catch (err) {
            console.log(err);
            await interaction.reply('ModPr Error: You have not the permission to execute this command.');
        }
    },
};