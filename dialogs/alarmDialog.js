/**
 * Created by johnnyribeiro on 13/10/2017.
 */
const botbuilder = require('botbuilder');

const library = new botbuilder.Library('alarms');
let alarmToSave;
library.dialog('saveAlarmDialog', [
    (session) => {
        alarmToSave = {};
        botbuilder.Prompts.text(session, 'What\'s your alarm name ?')
    },
    (session, results) => {
        alarmToSave.name = results.response;
        botbuilder.Prompts.text(session, `What's your name ?`)
    },
    (session, results, args) => {
        if (args && args.reprompt) {
            botbuilder.Prompts.text("I've already the datetime");
        } else {
            alarmToSave.author = results.response;
            botbuilder.Prompts.time(session, "Please provide a alarm date and time (e.g.: June 6th at 5pm)");
        }
    },
    (session, results) => {
        //let matched = results.response.match();
        if (false) { // typeof results.response === 'undefined'
            //undefined
            session.replaceDialog('saveAlarmDialog');
        } else {
            // Good date
            alarmToSave.date = botbuilder.EntityRecognizer.resolveTime([results.response]);
            alarmToSave.date = new Date(Date.parse(alarmToSave.date)).toUTCString();
            botbuilder.Prompts.confirm(session, 'Do you want activ alarm ?')
        }
    },
    (session, results) => {
        alarmToSave.status = results.response;
        alarmToSave.createdDate = new Date().toUTCString();

        if (typeof  session.userData.alarms === 'undefined') {
            session.userData.alarms = []
        }
        session.userData.alarms.push(alarmToSave);

        console.log('result', alarmToSave);
        session.endDialog(`It's done, your alarm is saved !`
            +`<br>Alarm name : ${alarmToSave.name}<br>`
            +`<br>Trigger at : ${alarmToSave.date}<br>`
            +`<br>Activ : ${alarmToSave.status}<br>`
            +`<br>created by ${alarmToSave.author} at ${alarmToSave.createdDate}`);


    }
]).endConversationAction(
    "endAskTime", "Ok. It's done.",
    {
        matches: /^cancel$|^goodbye$|^skip$|^stop$/i,
        confirmPrompt: "This will cancel your request. Are you sure?"
    }
)
// Once triggered, will start a new dialog as specified by
// the 'onSelectAction' option.
    .triggerAction({
        matches: /^save alarm$|^enregistrer alarme$/i,
        onSelectAction: (session, args, next) => {
            // Add the help dialog to the top of the dialog stack
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });

library.dialog('getAlarmsDialog', [
    (session) => {
        console.log('test',session.userData);
        console.log('test',session.userData.alarms)
        if(session.userData.alarms){
            for (let i = 0; i < session.userData.alarms.length; i++){
                session.send(`Alarm ${session.userData.alarms[i].name}<br/>Trigger at : $\{session.userData.alarms[i].date}`)
            }
        }else{

        }
    }
]).triggerAction({
    matches: /^get alarms$|^consulter les alarmes$/i,
    onSelectAction: (session, args, next) => {
        // Add the help dialog to the top of the dialog stack
        // (override the default behavior of replacing the stack)
        session.beginDialog(args.action, args);
    }
});

library.dialog('test', [
    (session) => {
        console.log('test',session.userData);
        console.log('test',session.userData.alarms)
    }
]).triggerAction({
    matches: /^test$/i,
    onSelectAction: (session, args, next) => {
        // Add the help dialog to the top of the dialog stack
        // (override the default behavior of replacing the stack)
        session.beginDialog(args.action, args);
    }
});

module.exports = library;