'use strict';

var botbuilder = require('botbuilder');
var library = new botbuilder.Library('greetings');

library.dialog('greetingsDialog', [function (session) {
    session.beginDialog('askName');
}, function (session, results) {
    session.endDialog('Hello %s!', results.response);
}]);

library.dialog('askName', [function (session) {
    botbuilder.Prompts.text(session, 'What\'s your name ?');
}, function (session, results) {
    session.endDialogWithResult(results);
}]);

module.exports = library;
//# sourceMappingURL=greetings.js.map