import { Commands } from './commands';
import { db, discord } from '../discord';

export class GeneralCmds {
    private receivedMessage;

    private commands: Commands;

    constructor(receivedMessage) {
        this.receivedMessage = receivedMessage;
        this.commands = new Commands(receivedMessage);
        Commands.generalError = false;
    }

    public checkCommand() {
        const command = this.commands.breakCommand();
        switch (command) {
            case '!help':
                this.receivedMessage.delete({ timeout: 1000 });
                this.receivedMessage.channel
                    .send(
                        `Commands: \n!bug [BUG INFORMATION]: Report a bug for TASER \n!request [FEATURE REQUEST]: Submit a feature request \n!version: Get current version information \nLink to TASER: https://taser4541.herokuapp.com/login \n\nLocked: \n!updateVersion [VERSION INFO] \n!edit [ID] [NEW DESCRIPTION] \n!approve [ID] \n!del [ID]`
                    )
                    .then((msg) => {
                        msg.delete({ timeout: 14000 });
                    });
                break;
            case '!bug':
                this.receivedMessage.delete({ timeout: 1000 });
                this.addBugReport();
                break;
            case '!request':
                this.receivedMessage.delete({ timeout: 1000 });
                this.addRequest();
                break;
            case '!version':
                this.receivedMessage.delete({ timeout: 1000 });
                this.getVersion();
                break;
            default:
                Commands.generalError = true;
                this.commands.invalidCmd();
                break;
        }
    }

    private addBugReport() {
        const bugDiscover = new discord.MessageEmbed()
            .setColor('#ff2b2b')
            .setTitle('TASER Bug')
            .setURL('https://taser4541.herokuapp.com/login')
            .setAuthor('Error Message -- Bug Discovery')
            .setDescription(`BUG: \n${this.receivedMessage.content.substring(5)}\n\n`);
        this.receivedMessage.channel.send(bugDiscover).then((message) => {
            message.edit(bugDiscover.setFooter(`ID: ${message.id}`));
            message.react('✅');
            message.react('❌');
        });
    }

    private addRequest() {
        const featureReq = new discord.MessageEmbed()
            .setColor('#4389fe')
            .setTitle('TASER Feature Request')
            .setURL('https://taser4541.herokuapp.com/login')
            .setAuthor('New Request')
            .setDescription(`REQ: \n${this.receivedMessage.content.substring(8)}\n\n`);
        this.receivedMessage.channel.send(featureReq).then((message) => {
            message.edit(featureReq.setFooter(`ID: ${message.id}`));
            message.react('✅');
            message.react('❌');
        });
    }

    private getVersion() {
        db.collection('Boards')
            .doc('subteam')
            .get()
            .then((doc) => {
                this.receivedMessage.channel.send(`Version Information:\n\n${doc.data().version}`).then((msg) => {
                    msg.delete({ timeout: 10000 });
                });
            });
    }
}
