'use strict';

var restify = require('restify');
var botbuilder = require('botbuilder');
var greetings = require('./greetings');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3987, function () {
    console.log('%s bot started at %s', server.name, server.url);
});

var connector = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

server.post('/api/messages', connector.listen());

var bot = new botbuilder.UniversalBot(connector, function (session) {
    session.beginDialog('greetings:greetingsDialog', session);
});

bot.library(greetings);
//# sourceMappingURL=index.js.map