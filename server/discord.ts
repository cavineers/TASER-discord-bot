/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import { AdminCmds } from './commands/admin';
import { GeneralCmds } from './commands/general';

export const discord = require('discord.js');
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
export const db = admin.firestore();
const client = new discord.Client();

client.on('ready', () => {
    client.guilds.cache.forEach((guild) => {
        guild.channels.cache.forEach((channel) => {
            console.log(` -> ${guild.name}: ${channel.name} ${channel.id} ${channel.type}`); // This gives channel bot has access to
            if (channel.type !== 'voice' && channel.type !== 'category') {
                channels.push(` - ${guild.name}: ${channel.name} ${channel.id}`);
            }
        });
    });
    console.log('>>All Systems Ready Awaiting Instructions...');
    console.log('>>Systems are Live on Discord');
});

client.on('message', (receivedMessage) => {
    if (receivedMessage.guild.name === 'BOT_DEV_SERVER' || receivedMessage.channel.name === 'taser-bug-reporting') {
        if (receivedMessage.author === client.user) {
            return;
        }

        const adminCmds = new AdminCmds(receivedMessage);
        const generalCmds = new GeneralCmds(receivedMessage);

        adminCmds.checkCommand();
        generalCmds.checkCommand();
    }
});

client.login(process.env.TOKEN);

// Server Settings
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
}, 3000);
