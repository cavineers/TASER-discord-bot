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
     * @param receivedMessage The message that was sent
     * @param name The name of the role
     * @returns boolean value if the user has that given role
     */
    public getRole(name: string) {
        return this.receivedMessage.member.roles.cache.find((r) => r.name === name);
    }

    /**
     * Adds a role to a user.
     * @param receivedMessage The message that was sent
     * @param roleId The ID of the role being added
     */
    public addRole(roleId: string) {
        const role = this.receivedMessage.guild.roles.cache.find((value) => value.id === roleId);
        const { member } = this.receivedMessage;
        if (role) member.roles.add(role);
    }

    /**
     * Removed a role from a user.
     * @param receivedMessage The message that was sent
     * @param roleId The ID of the role being removed
     */
    public removeRole(roleId: string) {
        const role = this.receivedMessage.guild.roles.cache.find((value) => value.id === roleId);
        const { member } = this.receivedMessage;
        if (role) member.roles.remove(role);
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
