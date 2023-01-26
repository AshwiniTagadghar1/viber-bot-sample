const express = require('express');
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;

const app = express();

// Your Viber bot's Auth Token
const VIBER_BOT_TOKEN = '5072e9f1c467e643-f7f0ec35d9acd847-21aab1f7e56301e2';

// Create a new instance of the Viber bot
const bot = new ViberBot({
    authToken: VIBER_BOT_TOKEN,
    name: "MyGitHubBot",
    avatar: "http://viber.com/avatar.jpg"
});


// set the webhook URL for the bot
bot.setWebhook('https://4148-180-34-52-24.ngrok.io/viber/webhook');

// Register the bot with the express app
bot.on(BotEvents.SUBSCRIBED, async response => {
    console.log("Bot subscribed to user: ", response);
    try {
      const subscriberDetails = await bot.get_user_details(response.userProfile.id);
      console.log(subscriberDetails);
    } catch (err) {
      console.log(err);
    }
});

bot.on(BotEvents.MESSAGE_RECEIVED, message => {
    console.log("Bot received a message: ", message);

});

app.use("/viber/webhook", bot.middleware());



app.post('/github/webhook', (req, res) => {
    if (req.headers['x-github-event'] === 'pull_request') {
        const pullRequest = req.body;
        // check if the pull request action is 'opened'
        if (pullRequest.action === 'opened') {
            // Send a message to the Viber bot subscriber
            console.log("near bot sending notification")
            bot.sendMessage({ id: 'V3WfzB0PnxzAy9Q3f5N7Dw==' }, new TextMessage(`A new pull request has been opened: ${pullRequest.pull_request.title}`));
        }
    }
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
