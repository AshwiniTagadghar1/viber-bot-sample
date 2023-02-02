const express = require('express');
const bodyParser = require('body-parser');
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;

const app = express();

// app.use(bodyParser.json()); 
var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Your Viber bot's Auth Token
const VIBER_BOT_TOKEN = '5072e9f1c467e643-f7f0ec35d9acd847-21aab1f7e56301e2';

// Create a new instance of the Viber bot
const bot = new ViberBot({
  authToken: VIBER_BOT_TOKEN,
  name: "MyGitHubBot",
  avatar: "http://viber.com/avatar.jpg"
});


// set the webhook URL for the bot
bot.setWebhook('https://d76d-240b-c010-400-2b88-396b-323d-1d82-c1aa.ngrok.io/viber/webhook');

// Register the bot with the express app
bot.on(BotEvents.SUBSCRIBED, async response => {
  // console.log("Bot subscribed to user: ", response);
  try {
    const subscriberDetails = await bot.get_user_details(response.userProfile.id);
    // console.log(subscriberDetails);
  } catch (err) {
    //  console.log(err);
  }
});






bot.on(BotEvents.MESSAGE_RECEIVED, message => {
  //console.log("Bot received a message: ", message);

});

app.use("/viber/webhook", bot.middleware());


app.post('/github/webhook', (req, res) => {

  //for pull request event
  // console.log(req.body);
  //console.log("req received: ", req.body.action);
  if (req.headers['x-github-event'] === 'pull_request') {



    //const pullRequest = req.body.get_user_details ;
    console.log("inside pull", req.body);

    // const action = pullRequest.action;
    // const user = pullRequest.user.login;
    // console.log("action: ", action);
    //console.log("user: ", name);
    // check if the pull request action is 'opened'

    // Send a message to the Viber bot subscriber
    // console.log("near bot sending notification")
    bot.sendMessage({ id: 'V3WfzB0PnxzAy9Q3f5N7Dw==' }, new TextMessage(`A new pull request has been opened ${JSON.stringify(req.body.pull_request.user.login)}`));

  }
  //for push events
  // if (req.headers['X-GitHub-Event'] === 'push') {
  //   const subscriberId = 'V3WfzB0PnxzAy9Q3f5N7Dw==';
  //   bot.sendMessage(subscriberId, new TextMessage(`A push event was just triggered`));
  // }
  //  res.sendStatus(200);
  res.json(res);
  res.end(JSON.stringify(req.body, null, 2))
});

bot.on(BotEvents.CONVERSATION_STARTED, (userProfile, isSubscribed, context, onFinish) => {
  // console.log("User ID: " + userProfile.id);
  onFinish(null);
});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
