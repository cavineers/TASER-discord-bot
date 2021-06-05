import { Commands } from './commands';
import { db } from '../discord';

export class AdminCmds {
    private receivedMessage;

    private commands: Commands;

    constructor(receivedMessage) {
        this.receivedMessage = receivedMessage;
        this.commands = new Commands(receivedMessage);
        Commands.adminError = false;
    }

    public checkCommand() {
        const command = this.commands.breakCommand();

        if (this.commands.getRole('Scouting')) {
            switch (command) {
                case '!del':
                    this.receivedMessage.delete({ timeout: 1000 });
                    this.deleteReport();
                    break;
                case '!updateVersion':
                    this.receivedMessage.delete({ timeout: 1000 });
                    this.updateVersion();
                    break;
                case '!approve':
                    this.receivedMessage.delete({ timeout: 1000 });
                    this.approve();
                    break;
                case '!edit':
                    this.receivedMessage.delete({ timeout: 1000 });
                    this.edit();
                    break;
                default:
                    Commands.adminError = true;
                    this.commands.invalidCmd();
                    break;
            }
        } else {
            this.receivedMessage.delete({ timeout: 1000 });
        }
    }

    private deleteReport() {
        const args = this.receivedMessage.content.split(' ');
        if (args[1] !== '') {
            this.receivedMessage.channel.messages
                .fetch({ around: args[1], limit: 1 })
                .then((message) => {
                    message.first().delete();
                })
                .then(() => {
                    this.receivedMessage.channel.send('Done! Thank you.').then((newMsg) => {
                        newMsg.delete({ timeout: 1000 });
                    });
                });
        }
    }

    private updateVersion() {
        const newVersion = this.receivedMessage.content.substring(15);
        if (newVersion !== '') {
            db.collection('Boards')
                .doc('subteam')
                .update({
                    version: newVersion,
                })
                .then(() => {
                    this.receivedMessage.channel.send('Current Version Updated').then((msg) => {
                        msg.delete({ timeout: 2000 });
                    });
                });
        }
    }

    private approve() {
        const args = this.receivedMessage.content.split(' ');
        if (args[1] !== '') {
            this.receivedMessage.channel.messages
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
                    this.receivedMessage.channel.send('Done! Thank you.').then((newMsg) => {
                        newMsg.delete({ timeout: 1000 });
                    });
                });
        }
    }

    private edit() {
        const args = this.receivedMessage.content.substring(6).split(' ');
        if (args[0] !== '' && args[1] !== '') {
            this.receivedMessage.channel.messages
                .fetch({ around: args[0], limit: 1 })
                .then((message) => {
                    let last = '';
                    for (let i = 1; i < args.length; i++) {
                        last += `${args[i]} `;
                    }
                    try {
                        const newEmbed = message.first().embeds[0].setDescription(last);
                        message.first().edit(newEmbed);
                    } catch {
                        //
                    }
                })
                .then(() => {
                    this.receivedMessage.channel.send('Done! Message Updated.').then((newMsg) => {
                        newMsg.delete({ timeout: 1000 });
                    });
                });
        }
    }
}
