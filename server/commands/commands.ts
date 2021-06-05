export class Commands {
    private receivedMessage;

    public static adminError: boolean = false;

    public static generalError: boolean = false;

    constructor(receivedMessage) {
        this.receivedMessage = receivedMessage;
    }

    public breakCommand() {
        return this.receivedMessage.content.split(' ')[0];
    }

    /**
     * Gets the role in a server based on the name
     * @param name The name of the role
     * @returns boolean value if the user has that given role
     */
    public getRole(name: string) {
        return this.receivedMessage.member.roles.cache.find((r) => r.name === name);
    }

    /**
     * Adds a role to a user.
     * @param roleName The name of the role being added
     */
    public addRole(roleName: string) {
        const role = this.receivedMessage.guild.roles.cache.find((value) => value.name === roleName);
        const { member } = this.receivedMessage;
        if (role) {
            member.roles.add(role);
            this.receivedMessage.channel
                .send(`Thanks! I have added the ${roleName} role to your account`)
                .then((msg) => {
                    msg.delete({ timeout: 5000 });
                });
        } else {
            this.receivedMessage.channel.send(`Could not find the request role: ${roleName}`).then((msg) => {
                msg.delete({ timeout: 5000 });
            });
        }
    }

    /**
     * Removed a role from a user.
     * @param roleName The name of the role being removed
     */
    public removeRole(roleName: string) {
        const role = this.receivedMessage.guild.roles.cache.find((value) => value.name === roleName);
        const { member } = this.receivedMessage;
        if (role) {
            member.roles.remove(role);
            this.receivedMessage.channel
                .send(`Thanks! I have removed the ${roleName} role from your account`)
                .then((msg) => {
                    msg.delete({ timeout: 5000 });
                });
        } else {
            this.receivedMessage.channel.send(`Could not find the request role: ${roleName}`).then((msg) => {
                msg.delete({ timeout: 5000 });
            });
        }
    }

    /* ----------------------------- Error Handling ---------------------------- */

    public invalidCmd() {
        if (Commands.adminError === true && Commands.generalError === true) {
            this.receivedMessage.delete({ timeout: 1000 });
            this.receivedMessage.channel.send('Sorry. This is not a command I recognize.').then((msg) => {
                msg.delete({ timeout: 2000 });
            });
        }
    }
}
