const { WebhookClient } = require("discord.js");
const fs = require("fs");
const util = require("util");

async function err(error, felix, message, code) {
  let owner = felix.users.cache.get("171373018285735936");
  console.log(error);
  message.channel.send(`An Error Has happened! Error Code: ${code}`);
  owner.send(`\`\`\`An Error Has Happened! \n Error: ${error}\`\`\``);
}

//! im writhing down on paper the functions so ik what i have to work with

async function sendwb(wbid, wbtoken, embed, felix, webhooks, logs, serverid) {
  const webhook = new WebhookClient(wbid, wbtoken);
  webhook
    .send({
      username: "Felix Logs",
      avatarURL: felix.user.avatarURL({ format: "png" }),
      embeds: [embed],
    })
    .catch((error) => {
      //* This will come in place in a minute
      createwb(webhooks, logs, embed, felix, serverid);
    });
}

async function createwb(webhooks, logs, embed, felix, serverid) {
  logs
    .createWebhook("Felix Logs", {
      avatar: felix.user.avatarURL({ format: "png" }),
      reason: "Webhook For Audit Logs :)",
    })
    .then((wb) => {
      sendwb(wb.id, wb.token, embed, felix, webhooks, logs, serverid);
      webhooks[serverid] = {
        id: wb.id,
        token: wb.token,
      };
      fs.writeFile("../webhook.json", JSON.stringify(webhooks), (error) => {
        if (error) console.log(error);
      });
    });
}

//!The exports will allow me to use these in any file where i call this file

module.exports = {
  err,
  sendwb,
  createwb,
};
