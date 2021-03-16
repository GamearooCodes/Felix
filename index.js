const {
  token,
  prefix,
  version,
  color,
  beta,
  mongourl,
  name,
} = require("./config");

const { sendwb, createwb, err } = require("./Utils/functions");

const Discord = require("discord.js");
const fs = require("fs");

const felix = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
felix.commands = new Discord.Collection();
const { createLogger, format, transports, level } = require("winston");
const { consoleFormat } = require("winston-console-format");

const logger = createLogger({
  level: "silly",
  format: format.combine(
    format.timestamp(),
    format.ms(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "Test" },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.padLevels(),
        consoleFormat({
          showMeta: true,
          metaStrip: ["timestamp", "service"],
          inspectOptions: {
            depth: Infinity,
            colors: true,
            maxArrayLength: Infinity,
            breakLength: 120,
            compact: Infinity,
          },
        })
      ),
    }),
  ],
});
const mongoose = require("mongoose");

mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(logger.info("Mongo Activated.."));

const commandFiles = fs.readdirSync("./commands");
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  felix.commands.set(command.name, command);
}

var figlet = require("figlet");

const Config = require("./Models/config");

felix.on("ready", async () => {
  const readOutdated = require("package-outdated");
  let check = await readOutdated();

  felix.user.setActivity(`f.help | New Bot!`);
  if (beta == true) logger.warn("Starting Bot In Beta Mode!");
  if (beta == false) logger.info("Starting Bot In Normal Mode!");
  if (check) logger.warn(check);
  else logger.info("No Updates Available!");
  figlet(`${felix.user.username} Is Ready!`, function (err, data) {
    if (err) {
      logger.warn("Something went wrong...");
      console.dir(err);
      return;
    }

    logger.silly(
      ` ${felix.user.tag}\n\n═════════════════════════════════════════════════════════════════════════════ \n ${data} \n ═════════════════════════════════════════════════════════════════════════════`
    );
  });
  logger.info("Bot Has Started!");

  const show = ["dnd", "dnd", "online", "idle"];

  setInterval(async () => {
    const index1 = Math.floor(Math.random() * (show.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
    felix.user.setStatus(show[index1]);
    logger.debug(show[index1]); // sets bot's activities to one of the phrases in the arraylist.
  }, 195000);

  setInterval(async () => {
    let servermain = felix.guilds.cache.get("605900262581993472");
    let chan = servermain.channels.cache.get("793854677439217724");
    chan.setName(`Felix:  ${felix.guilds.cache.size}`);
    let check = await readOutdated();
    if (check) logger.warn(check);
    else logger.info("No Updates Available!");

    const activities_list = [
      `f.help`,
      `f.help`,
      "Bot By: Gamearoo#0001",
      "with some code",
      "with You",
      `version: ${version}`,
      `f.bug [issue] to report bugs`,
      `f.help | New Bot!`,
      `${felix.guilds.cache.size} Servers`,
      `Helping ${felix.users.cache.size
        .toLocaleString()
        .replace(/,/g, ",")} Users`,
    ];
    const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
    felix.user.setActivity(activities_list[index]);
    logger.verbose(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
  }, 75000);

  felix.guilds.cache.forEach(async (guild) => {
    let data = await Config.findOne({ guildID: guild.id });
    if (data) return console.log(`${guild.name} Was already all set!`);
    if (!data) {
      let newData = new Config({
        Prefix: "f.",
        Auditlogs: "disabled",
        Modlogs: "mod-logs",
        guildID: guild.id,
        guildName: guild.name,
      });
      newData.save();
      return console.log(`Setup ${guild.name} Successfully!`);
    }
  });
});

const canvacord = require("canvacord");

felix.on("guildMemberAdd", (member) => {
  //! finds the channel if not defines it as no channel found will be used later
  let welcome = member.guild.channels.cache.find(
    (c) =>
      c.name === "felix-welcomes" || c.name === "welcomes" || c.name === "joins"
  );

  // code that sends the welcome msg to the user or welcomes channel

  //! i will add configurable options later also add a way to add a role to the user

  let card = new canvacord.Welcomer()
    .setUsername(member.user.username)
    .setDiscriminator(member.user.discriminator)
    .setMemberCount(member.guild.memberCount)
    .setGuildName(member.guild.name)
    .setAvatar(member.user.displayAvatarURL({ format: "png", size: 1024 }))
    .setBackground(
      "https://www.ramandrem.xyz/wp-content/uploads/2021/01/b1788b00057c785cb8c922e4c40bc38094905ed9_hq.png"
    );

  card.build().then((data) => {
    const attachment = new Discord.MessageAttachment(data, "WelcomeCard.png");
    if (!welcome)
      member.send(attachment).catch((error) => {
        return;
      });

    if (!welcome) return;

    welcome.send(member, attachment);
  });
});

felix.on("guildMemberRemove", (member) => {
  //! finds the channel if not defines it as no channel found will be used later
  let welcome = member.guild.channels.cache.find(
    (c) => c.name === "felix-byes" || c.name === "byes" || c.name === "leaves"
  );

  // code that sends the welcome msg to the user or welcomes channel

  //! i will add configurable options later also add a way to add a role to the user

  let card = new canvacord.Leaver()
    .setUsername(member.user.username)
    .setDiscriminator(member.user.discriminator)
    .setMemberCount(member.guild.memberCount)
    .setGuildName(member.guild.name)
    .setAvatar(member.user.displayAvatarURL({ format: "png", size: 1024 }))
    .setBackground(
      "https://www.ramandrem.xyz/wp-content/uploads/2021/01/b1788b00057c785cb8c922e4c40bc38094905ed9_hq.png"
    );

  card.build().then((data) => {
    const attachment = new Discord.MessageAttachment(data, "WelcomeCard.png");
    if (!welcome)
      member.send(attachment).catch((error) => {
        return;
      });
    if (!welcome) return;
    welcome.send(member, attachment);
  });
});

felix.on("message", async (message) => {
  if (message.author.bot) return;

  if (!message.guild) return message.reply("Sorry Dm's are disabled ");

  if (!message.content.toLowerCase().startsWith(prefix)) return;
  let args = message.content.slice(prefix.length).trim().split(" ");
  const command = args[0];
  //!args format
  //*args[0] args[1] so forth
  //! outputs
  //*f.ping test
  // and so forth
  const cmd = felix.commands.get(command);
  if (!cmd) return;
  felix.config = {
    prefix: `${prefix}`,
    color: `${color}`,
  };
  try {
    cmd.execute(message, args, felix, Discord.MessageEmbed);
  } catch (error) {
    console.log(error);
  }
});

felix.on("emojiUpdate", (oldEmoji, newEmoji) => {
  if (oldEmoji.name === newEmoji.name) return;
  let logs = newEmoji.guild.channels.cache.find((c) => c.name === "audit-logs");
  const embed = new Discord.MessageEmbed()
    .setFooter(
      `Logged By: ${felix.user.tag}`,
      felix.user.avatarURL({ format: "png" })
    )
    .setTitle(`Emoji Name Updated!`)
    .setColor(color)
    .setDescription(
      `Emoji: ${newEmoji}\n Before: ${oldEmoji.name}\n After: ${newEmoji.name}`
    );

  let webhooks = JSON.parse(fs.readFileSync("./webhook.json", "utf-8"));

  let serverid = newEmoji.guild.id;

  if (webhooks[serverid]) {
    let wbserver = webhooks[serverid];

    sendwb(
      wbserver.id,
      webserver.token,
      embed,
      felix,
      webhooks,
      logs,
      serverid
    );
    return;
  }
  createwb(webhooks, logs, embed, felix, serverid);
});

felix.login(token);
