let restify = require('restify')
let botbuilder = require('botbuilder')

// setup the restify server
let server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3987, function () {
    console.log('%s bot started at %s', server.name, server.url);
})

// create chat connector
let connector = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
})

// Listening for user inputs
server.post('/api/messages', connector.listen())

// Reply by echoing
let bot = new botbuilder.UniversalBot(connector, function (session) {
    session.send('Reprends ça: %s ', session.message.text)
    //session.send(JSON.stringify(session.dialogData))
    let card = new botbuilder.AnimationCard(session)
        .title('Card')
        .subtitle('Well done')
        .image(botbuilder.CardImage.create(session, 'https://media.giphy.com/media/xDQ3Oql1BN54c/giphy.gif'))
        .media([
            { url: 'https://media.giphy.com/media/xDQ3Oql1BN54c/giphy.gif' }
        ]);
    let msg = new botbuilder.Message(session).addAttachment(card);
    session.send(msg);

    bot.on('typing', () => {
        session.send('Ca vient?');
    })

    bot.on('conversationUpdate', message => {
        if (message.membersAdded && message.membersAdded.length > 0) {
            let membersAdded = message.membersAdded.map(function (x) {
                let isSelf = x.id == message.address.bot.id;
                return (isSelf ? message.address.bot.name : x.name) || ' ' + '(Id=' + x.id + ' )'
            }).join(', ');
            bot.send(new botbuilder.Message()
                .address(message.address)
                .text('Bienvenue ' + membersAdded));
        }
    });

    bot.on('contactRelationUpdate', message => {
        if (message.action && message.action === 'add') {
            bot.send(new botbuilder.Message().address(message.address).text('Hello bot ' + message.address.id));
        }
        if (message.action && message.action === 'remove') {
            bot.send(new botbuilder.Message().address(message.address).text('Bye bot ' + message.address.id));
        }
    });
});