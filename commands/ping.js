module.exports = {
  name: "ping",
  description: "Gets Bots ping",
  async execute(message, args, felix, MessageEmbed) {
    let botMsg = await message.channel.send(`Pinging...`);

    let b;
    if (Math.round(felix.ws.ping) >= 300) b = "true";
    if (Math.round(felix.ws.ping) < 300) b = "false";

    let d;

    if (Math.round(botMsg.createdAt - message.createdAt) >= 500) d = "true";
    if (Math.round(botMsg.createdAt - message.createdAt) < 500) d = "false";

    const embed = new MessageEmbed()
      .setAuthor(felix.user.tag, felix.user.avatarURL())
      .setThumbnail(felix.user.avatarURL())
      .setTitle("Pong!")
      .setTimestamp(message.createdTimestamp)
      .addField(
        `Bots Ping`,
        `🏓${Math.round(botMsg.createdAt - message.createdAt)}ms!🏓 `,
        false
      )
      .addField("Api Ping", `🏓${Math.round(felix.ws.ping)}ms!🏓`, true)
      .addField("Api Lag:", b, true)
      .addField("Bot Lag:", d, true)
      .setFooter(
        `Requested By: ${message.author.tag}`,
        message.author.avatarURL({ dynamic: true })
      )
      .setColor(felix.config.color);

    botMsg.edit(" ", embed);
  },
};
