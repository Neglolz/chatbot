const botbuilder = require('botbuilder');

const library = new botbuilder.Library('globalMenu');

library.dialog('globalMenuDialog', [(session, args, next) => {
    //Send a global menu
    botbuilder.Prompts.choice(session, `Voici le menu du chatbot :<br>Vous pouvez cliquer sur le bouton ou tapez le mot`, "red|green|blue", {listStyle: botbuilder.ListStyle.button});
    session.send(`Global help menu.`);
},
    (session, results, next) => {
        session.endDialog(`you want : ${results.response.entity}`)
    }]).endConversationAction(
    "endAskTime", "Ok. It's done.",
    {
        matches: /^cancel$|^goodbye$|^skip$|^stop$/i,
        confirmPrompt: "This will cancel your request. Are you sure?"
    }
)
// Once triggered, will start a new dialog as specified by
// the 'onSelectAction' option.
    .triggerAction({
        matches: /^menu$|^main menu$|^global menu$/i,
        onSelectAction: (session, args, next) => {
            // Add the help dialog to the top of the dialog stack
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });

module.exports = library;