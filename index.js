const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, EmbedBuilder} = require('discord.js');
const { token } = require('./config.json');

const ChannelLogsFile = require("./src/data/logs.json");
const MemberRoleFile = require("./src/data/memberrole.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'src');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log(`Client ${client.user.tag} is ready! Total Servers : ${client.guilds.cache.size}.`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('guildMemberAdd',  async member => {
    const guild = member.guild;
    if (ChannelLogsFile[guild.id]) {
        const JoinedEmbed = new EmbedBuilder()
            .setColor("DarkGold")
            .setTitle("ModPr | Member Join Event")
            .setAuthor({
                name: "Program",
                iconURL: "https://cdn.discordapp.com/attachments/793461922338045952/1000513773284638770/Program_Logo_V2.png",
                url: "https://program132.github.io/home.html"
            })
            .addFields
            (
                {
                    name: "Member Joined", value: "A new member joined the discord server."
                },
                {
                    name: "Member Informations", value: "Name: " + member.displayName + "\n" +
                        "ID: " + member.id
                }
            );
        const LogsChannel = guild.channels.cache.get(ChannelLogsFile[guild.id]["id"]);
        await LogsChannel.send({embeds: [JoinedEmbed]});
    }
    if (MemberRoleFile[guild.id]) {
        let role = guild.roles.cache.get(MemberRoleFile[guild.id]["role"]);
        await member.roles.add(role, "joined");
    }
})

client.on('guildMemberRemove',  async member => {
    const guild = member.guild;
    if (ChannelLogsFile[guild.id]) {
        const LeaveEmbed = new EmbedBuilder()
            .setColor("DarkGold")
            .setTitle("ModPr | Member Leave Event")
            .setAuthor({
                name: "Program",
                iconURL: "https://cdn.discordapp.com/attachments/793461922338045952/1000513773284638770/Program_Logo_V2.png",
                url: "https://program132.github.io/home.html"
            })
            .addFields
            (
                {
                    name: "Member Left", value: "A member left the discord server."
                },
                {
                    name: "Member Informations", value: "Name: " + member.displayName + "\n" +
                        "ID: " + member.id
                }
            );
        const LogsChannel = guild.channels.cache.get(ChannelLogsFile[guild.id]["id"]);
        await LogsChannel.send({embeds: [LeaveEmbed]});
    }
})



client.on('messageDelete',  async message => {
    const guild = message.guild;
    if (message.author.id !== client.user.id) {
        if (ChannelLogsFile[guild.id]) {
            const MessageDeleteEmbed = new EmbedBuilder()
                .setColor("DarkGold")
                .setTitle("ModPr | Message Delete Event")
                .setAuthor({
                    name: "Program",
                    iconURL: "https://cdn.discordapp.com/attachments/793461922338045952/1000513773284638770/Program_Logo_V2.png",
                    url: "https://program132.github.io/home.html"
                })
                .addFields
                (
                    {
                        name: "Message Deleted", value: "A message was deleted by a member."
                    },
                    {
                        name: "Member Informations", value: "URL: " + message.url + "\n" +
                            "Content: " + message.content + "\n" +
                            "ID: " + message.id  + "\n" +
                            "Author Name: " + message.author.username + "\n" +
                            "Author ID: " + message.author.id
                    }
                );
            const LogsChannel = guild.channels.cache.get(ChannelLogsFile[guild.id]["id"]);
            await LogsChannel.send({embeds: [MessageDeleteEmbed]});
        }
    }
})

client.on('messageUpdate',  async (newmessage, oldmessage) => {
    const guild = newmessage.guild;
    if (newmessage.author.id !== client.user.id) {
        if (ChannelLogsFile[guild.id]) {
            const MessageUpdateEmbed = new EmbedBuilder()
                .setColor("DarkGold")
                .setTitle("ModPr | Message Update Event")
                .setAuthor({
                    name: "Program",
                    iconURL: "https://cdn.discordapp.com/attachments/793461922338045952/1000513773284638770/Program_Logo_V2.png",
                    url: "https://program132.github.io/home.html"
                })
                .addFields
                (
                    {
                        name: "Message Updated", value: "A message was updated by a member."
                    },
                    {
                        name: "Member Informations", value: "URL: " + newmessage.url + "\n" +
                            "New Content: " + newmessage.content + "\n" +
                            "Old Content: " + oldmessage.content + "\n" +
                            "ID: " + newmessage.id  + "\n" +
                            "Author Name: " + newmessage.author.username + "\n" +
                            "Author ID: " + newmessage.author.id
                    }
                );
            const LogsChannel = guild.channels.cache.get(ChannelLogsFile[guild.id]["id"]);
            await LogsChannel.send({embeds: [MessageUpdateEmbed]});
        }
    }
})

client.login(token);