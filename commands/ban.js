module.exports = {
  name: "ban",
  description: "ban a user",
  async execute(message, args, felix, MessageEmbed) {
    const kUser =
      message.mentions.members.first() || felix.users.cache.get(args[1]);
    //! check for perms and safety checks
    if (!message.member.hasPermission("BAN_MEMBERS")) {
      return message.reply(`You don't have permission to run this command!`);
    } else if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
      message.reply(
        `I can't Ban the user. Im missing the permission \`\`BAN_MEMBERS\`\`!`
      );
    } else if (!kUser) {
      return message.reply(`No User Specified!`);
    }
    const memberPosition = kUser.roles.highest.position;
    const authorPosition = message.member.roles.highest.position;

    if (authorPosition <= memberPosition)
      return message.channel.send(
        `You can't ban this member! There role is higher or equal to yours!`
      );
    //let try that
    //lets check to make sure there not higher then the bot
    //ex lower then me but higher then the bot
    const botposistion = message.guild.me.roles.highest.position;
    if (botposistion <= memberPosition)
      return message.reply(
        `I Can't Ban them there role is higher or equal then mine!`
      );
    //idk why we need it for a ban command but this bot will be of lower power then ram anyway or in case the server owner dosnt want the bot to ban staff ig
    //!lets make sure there not trying to hijack the server and ban the owner
    if (kUser.user.id === message.guild.owner.id) {
      message.reply(`You can't ban the owner!`);
      //! lets let the owner be aware someone has attempted to do so
      message.guild.owner
        .send(`${message.member} Has attempted to ban you!`)
        .catch((err) =>
          message.channel.send(
            `${message.guild.owner}, ${message.author} has attempted to ban you!`
          )
        ); //catch if the bot can dm if so send if no ping in the channel

      return;
    }

    //lets pull the reason for the ban
    let reason = args.slice(2).join(" ");
    if (!reason) reason = "No Reason Provided!";
    //that makes sure theres always a reason (u can add logs to a logs channel ill do that in the future)
    kUser.send(`You where banned From ${message.guild.name}`).catch((err) => {
      null;
    });
    // send a msg if it cant it will nul lto allow it to continue
    message.guild.members.ban(kUser.id, { reason });
    message.reply(`Banned ${kUser} out of the server!`);
    return; //warnning handled
  },
};
