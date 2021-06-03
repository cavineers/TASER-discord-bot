const discord = require('discord.js');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const channels = [];
const firebase = JSON.parse(process.env.FIREBASE_KEY);
admin.initializeApp({
    credential: admin.credential.cert(firebase),
});
const db = admin.firestore();
const client = new discord.Client();
client.on('ready', () => {
    client.guilds.cache.forEach((guild) => {
        guild.channels.cache.forEach((channel) => {
            console.log(` -> ${guild.name}: ${channel.name} ${channel.id} ${channel.type}`);
            if (channel.type !== 'voice' && channel.type !== 'category') {
                channels.push(` - ${guild.name}: ${channel.name} ${channel.id}`);
            }
            if (guild.name === 'BOT_DEV_SERVER' && channel.name === 'logs') {
            }
        });
    });
    console.log('>>All Systems Ready Awaiting Instructions...');
    console.log('>>Systems are Live on Discord');
    console.log('No internal server errors... Excellent >:)');
});
client.on('message', (receivedMessage) => {
    if (receivedMessage.guild != null) {
        if (receivedMessage.author === client.user) {
            return;
        }
        if (receivedMessage.content === '!help') {
            receivedMessage.delete({ timeout: 1000 });
            receivedMessage.channel
                .send(`Commands: \n!optin: Opt in to the TASER beta program \n!bug [BUG INFORMATION]: Report a bug for TASER \n!request [FEATURE REQUEST]: Submit a feature request \n!optout: Opt out from the TASER beta program \n!version: Get current version information \nLink to TASER: https://taser4541.herokuapp.com/login \n\nLocked: \n!updateVersion [VERSION INFO] \n!edit [ID] [NEW DESCRIPTION] \n!approve [ID] \n!del [ID]`)
                .then((msg) => {
                msg.delete({ timeout: 14000 });
            });
        }
        else if (receivedMessage.content.includes('!bug') &&
            (receivedMessage.channel.name === 'taser-bug-reporting' ||
                receivedMessage.channel.name === 'bot-testing-development')) {
            const bugDiscover = new discord.MessageEmbed()
                .setColor('#ff2b2b')
                .setTitle('TASER Bug')
                .setURL('https://taser4541.herokuapp.com/login')
                .setAuthor('Error Message -- Bug Discovery')
                .setDescription(`BUG: \n${receivedMessage.content.substring(5)}\n\n`);
            receivedMessage.channel.send(bugDiscover).then((message) => {
                message.edit(bugDiscover.setFooter(`ID: ${message.id}`));
                message.react('✅');
                message.react('❌');
            });
            receivedMessage.delete({ timeout: 1000 });
        }
        else if (receivedMessage.content.includes('!request') &&
            (receivedMessage.channel.name === 'taser-bug-reporting' ||
                receivedMessage.channel.name === 'bot-testing-development')) {
            const featureReq = new discord.MessageEmbed()
                .setColor('#4389fe')
                .setTitle('TASER Feature Request')
                .setURL('https://taser4541.herokuapp.com/login')
                .setAuthor('New Request')
                .setDescription(`REQ: \n${receivedMessage.content.substring(8)}\n\n`);
            receivedMessage.channel.send(featureReq).then((message) => {
                message.edit(featureReq.setFooter(`ID: ${message.id}`));
                message.react('✅');
                message.react('❌');
            });
            receivedMessage.delete({ timeout: 1000 });
        }
        else if (receivedMessage.content.includes('!approve') &&
            (receivedMessage.channel.name === 'taser-bug-reporting' ||
                receivedMessage.channel.name === 'bot-testing-development')) {
            receivedMessage.delete({ timeout: 1000 });
            if (receivedMessage.member.roles.cache.find((r) => r.name === 'Scouting')) {
                const args = receivedMessage.content.split(' ');
                if (args[1] !== '') {
                    receivedMessage.channel.messages
                        .fetch({ around: args[1], limit: 1 })
                        .then((message) => {
                        const date = new Date().toLocaleString();
                        const newEmbed = message
                            .first()
                            .embeds[0].setColor('#00ba76')
                            .addField('Approved', `Request has been approved at ${date}`, true);
                        message.first().edit(newEmbed);
                    })
                        .then(() => {
                        receivedMessage.channel.send('Done! Thank you.').then((newMsg) => {
                            newMsg.delete({ timeout: 1000 });
                        });
                    });
                }
                else {
                    receivedMessage.delete({ timeout: 500 });
                }
            }
        }
        else if (receivedMessage.content.includes('!del') &&
            (receivedMessage.channel.name === 'taser-bug-reporting' ||
                receivedMessage.channel.name === 'bot-testing-development')) {
            receivedMessage.delete({ timeout: 1000 });
            if (receivedMessage.member.roles.cache.find((r) => r.name === 'Scouting')) {
                const args = receivedMessage.content.split(' ');
                if (args[1] !== '') {
                    receivedMessage.channel.messages
                        .fetch({ around: args[1], limit: 1 })
                        .then((message) => {
                        message.first().delete();
                    })
                        .then(() => {
                        receivedMessage.channel.send('Done! Thank you.').then((newMsg) => {
                            newMsg.delete({ timeout: 1000 });
                        });
                    });
                }
                else {
                    receivedMessage.delete({ timeout: 500 });
                }
            }
        }
        else if (receivedMessage.content.includes('!optin') &&
            (receivedMessage.channel.name === 'taser-bug-reporting' ||
                receivedMessage.channel.name === 'bot-testing-development')) {
            if (receivedMessage.channel.name === 'taser-bug-reporting') {
                const role = receivedMessage.guild.roles.cache.find((value) => value.id === '805954504700329995');
                const { member } = receivedMessage;
                if (role)
                    member.roles.add(role);
                receivedMessage.delete({ timeout: 1000 });
                receivedMessage.author.send('Hello and welcome to the TASER beta program. You have received this message because you have opted in for TASER beta testing!\n\nThe testing link can be found here https://taser4541-beta.herokuapp.com/login\n\n Please report any bugs, feature requests, or necessary information in the taser-bug-reporting channel. Thank you and happy bug hunting!');
                receivedMessage.channel
                    .send('Thanks you have opted in for TASER Testing. You can opt out anytime by using !optout')
                    .then((msg) => {
                    msg.delete({ timeout: 5000 });
                });
            }
            else {
                const role = receivedMessage.guild.roles.cache.find((value) => value.id === '805997664889339955');
                const { member } = receivedMessage;
                if (role)
                    member.roles.add(role);
                receivedMessage.author.send('Hello and welcome to the TASER beta program. You have received this message because you have opted in for TASER beta testing!\n\nThe testing link can be found here https://taser4541-beta.herokuapp.com/login\n\n Please report any bugs, feature requests, or necessary information in the taser-bug-reporting channel. Thank you and happy bug hunting!');
                receivedMessage.delete({ timeout: 1000 });
                receivedMessage.channel
                    .send('Thanks you have opted in for TASER Testing. You can opt out anytime by using !optout')
                    .then((msg) => {
                    msg.delete({ timeout: 5000 });
                });
            }
        }
        else if (receivedMessage.content.includes('!optout') &&
            (receivedMessage.channel.name === 'taser-bug-reporting' ||
                receivedMessage.channel.name === 'bot-testing-development')) {
            if (receivedMessage.channel.name === 'taser-bug-reporting') {
                const role = receivedMessage.guild.roles.cache.find((value) => value.id === '805954504700329995');
                const { member } = receivedMessage;
                if (role)
                    member.roles.remove(role);
                receivedMessage.delete({ timeout: 1000 });
                receivedMessage.channel.send('You have been opted out of the TASER Testing program :(').then((msg) => {
                    msg.delete({ timeout: 5000 });
                });
            }
            else {
                const role = receivedMessage.guild.roles.cache.find((value) => value.id === '805997664889339955');
                const { member } = receivedMessage;
                if (role)
                    member.roles.remove(role);
                receivedMessage.delete({ timeout: 1000 });
                receivedMessage.channel.send('You have been opted out of the TASER Testing program :(').then((msg) => {
                    msg.delete({ timeout: 5000 });
                });
            }
        }
        else if (receivedMessage.content === '!version' &&
            (receivedMessage.channel.name === 'taser-bug-reporting' ||
                receivedMessage.channel.name === 'bot-testing-development')) {
            db.collection('Boards')
                .doc('subteam')
                .get()
                .then((doc) => {
                receivedMessage.delete({ timeout: 1000 });
                receivedMessage.channel.send(`Version Information:\n\n${doc.data().version}`).then((msg) => {
                    msg.delete({ timeout: 10000 });
                });
            });
        }
        else if (receivedMessage.content.includes('!updateVersion') &&
            (receivedMessage.channel.name === 'taser-bug-reporting' ||
                receivedMessage.channel.name === 'bot-testing-development')) {
            receivedMessage.delete({ timeout: 1000 });
            if (receivedMessage.member.roles.cache.find((r) => r.name === 'Scouting')) {
                const newVersion = receivedMessage.content.substring(15);
                if (newVersion !== '') {
                    db.collection('Boards')
                        .doc('subteam')
                        .update({
                        version: newVersion,
                    })
                        .then(() => {
                        receivedMessage.channel.send('Current Version Updated').then((msg) => {
                            msg.delete({ timeout: 2000 });
                        });
                    });
                }
                else {
                    receivedMessage.delete({ timeout: 1000 });
                }
            }
        }
        else if (receivedMessage.content.includes('!edit') &&
            (receivedMessage.channel.name === 'taser-bug-reporting' ||
                receivedMessage.channel.name === 'bot-testing-development')) {
            receivedMessage.delete({ timeout: 1000 });
            if (receivedMessage.member.roles.cache.find((r) => r.name === 'Scouting')) {
                const args = receivedMessage.content.substring(6).split(' ');
                if (args[0] !== '' && args[1] !== '') {
                    receivedMessage.channel.messages
                        .fetch({ around: args[0], limit: 1 })
                        .then((message) => {
                        let last = '';
                        for (let i = 1; i < args.length; i++) {
                            last += `${args[i]} `;
                        }
                        try {
                            const newEmbed = message.first().embeds[0].setDescription(last);
                            message.first().edit(newEmbed);
                        }
                        catch (_a) {
                        }
                    })
                        .then(() => {
                        receivedMessage.channel.send('Done! Message Updated.').then((newMsg) => {
                            newMsg.delete({ timeout: 1000 });
                        });
                    });
                }
                else {
                    receivedMessage.delete({ timeout: 500 });
                }
            }
        }
        else if (receivedMessage.channel.name === 'taser-bug-reporting' ||
            receivedMessage.channel.name === 'bot-testing-development') {
            receivedMessage.channel
                .send('Sorry. This is not a command I recognize. Try again a bit later!')
                .then((msg) => {
                msg.delete({ timeout: 2000 });
            });
            receivedMessage.delete({ timeout: 1000 });
        }
    }
});
client.login(process.env.TOKEN);
setTimeout(() => {
    const PORT = process.env.PORT || 8000;
    console.log(`Live on port: ${PORT}`);
    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', '../../app');
    app.use(express.static('../../app'));
    app.set('view options', {
        layout: false,
    });
    const urlencodedParser = bodyParser.urlencoded({
        extended: false,
    });
    app.get('/', (req, res) => {
        res.render(`../app/index.ejs`, {
            data: channels,
        });
    });
    app.post('/sendMsg', urlencodedParser, (req, res) => {
        if (req.body.pass === '4541') {
            client.guilds.cache.forEach((guild) => {
                guild.channels.cache.forEach((channel) => {
                    if (` - ${guild.name}: ${channel.name} ${channel.id}` === req.body.channel) {
                        channel.send(req.body.mainMsg);
                    }
                });
            });
            res.redirect('/');
        }
    });
    app.listen(PORT);
}, 2500);
