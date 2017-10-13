'use strict';

var greetings = require('./dialogs/greetings');
var globalMenu = require('./menu');
var alarms = require('./dialogs/alarmDialog');
var cron = require('cron');
var restify = require('restify');
var botbuilder = require('botbuilder');

var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3987, function () {
    console.log('%s bot started at %s', server.name, server.url);
});

var connector = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

server.post('/api/messages', connector.listen());

var job1 = new cron.CronJob({
    cronTime: '* * * * *',
    onTick: function onTick() {
        console.log('job 1 ticked');
    },
    start: false,
    timeZone: 'Europe/Paris'
});
//job1.start();


var bot = new botbuilder.UniversalBot(connector, function (session) {

    session.beginDialog('greetings:greetingsDialog');
});
var username = '';
var helpMessage = '\n * I\'m Simon, I repeat everything you say. \n * I announce when an user comes or leaves the conversation. \n * The feature works with bots too.';
var savedAddress = void 0;

// Import dialogs
bot.library(greetings);
bot.library(globalMenu);
bot.library(alarms);

// Enable conversation data persistence
bot.set('persistConversationData', true);

// Do GET this endpoint to delivey a notification
server.get('/api/CustomWebApi', function (req, res, next) {
    sendProactiveMessage(savedAddress);
    res.send('triggered');
    next();
});

// Send simple notifications
function sendProactiveMessage(address) {
    var msg = new botbuilder.Message().address(address);
    msg.text('Hello, this is a notification');
    msg.textLocale('en-US');
    bot.send(msg);
}

/*bot.dialog('example', (session, args) => {

    savedAddress = session.message.address;

    let message = 'Hello! In a few seconds I\'ll send you a message proactively to demonstrate how bots can initiate messages.';
    session.send(message);

    message = 'You can also make me send a message by accessing: ';
    message += 'http://localhost:' + server.address().port + '/api/CustomWebApi';
    session.send(message);

    setTimeout(() => {
        sendProactiveMessage(savedAddress);
    }, 5000);
});*/

// root dialog
bot.dialog('example2', function (session, args) {

    // ListStyle passed in as Enum
    botbuilder.Prompts.choice(session, "Which color?", "red|green|blue", { listStyle: botbuilder.ListStyle.button });
});
//# sourceMappingURL=app.js.map