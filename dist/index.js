'use strict';

var restify = require('restify');
var botbuilder = require('botbuilder');

// setup the restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3987, function () {
    console.log('%s bot started at %s', server.name, server.url);
});

// create chat connector
var connector = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

// Listening for user inputs
server.post('/api/messages', connector.listen());

// Reply by echoing
var bot = new botbuilder.UniversalBot(connector, function (session) {
    session.send('Reprends ça: %s ', session.message.text);
    //session.send(JSON.stringify(session.dialogData))
    var card = new botbuilder.AnimationCard(session).title('Card').subtitle('Well done').image(botbuilder.CardImage.create(session, 'https://media.giphy.com/media/xDQ3Oql1BN54c/giphy.gif')).media([{ url: 'https://media.giphy.com/media/xDQ3Oql1BN54c/giphy.gif' }]);
    var msg = new botbuilder.Message(session).addAttachment(card);
    session.send(msg);

    bot.on('typing', function () {
        session.send('Ca vient?');
    });

    bot.on('conversationUpdate', function (message) {

        if (message.membersAdded && message.membersAdded.length > 0) {

            var membersAdded = message.membersAdded.map(function (x) {
                var isSelf = x.id == message.address.bot.id;
                return (isSelf ? message.address.bot.name : x.name) || ' ' + '(Id=' + x.id + ' )';
            }).join(', ');

            bot.send(new botbuilder.Message().address(message.address).text('Bienvenue ' + membersAdded));
        }
    });
});
//# sourceMappingURL=index.js.map