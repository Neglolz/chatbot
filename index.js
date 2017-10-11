const restify = require('restify');
const botbuilder = require('botbuilder');
const greetings = require('./greetings');

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3987, function () {
    console.log('%s bot started at %s', server.name, server.url)
});


const connector = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

server.post('/api/messages', connector.listen());

const bot = new botbuilder.UniversalBot(connector, session => {
    session.beginDialog('greetings:greetingsDialog', session);
});


bot.library(greetings);
