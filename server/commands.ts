export class Commands {
    /**
     * Gets the role in a server based on the name
     * @param receivedMessage The message that was sent
     * @param name The name of the role
     * @returns boolean value if the user has that given role
     */
    public static getRole(receivedMessage, name: string) {
        return receivedMessage.member.roles.cache.find((r) => r.name === name);
    }

    /**
     * Adds a role to a user.
     * @param receivedMessage The message that was sent
     * @param roleId The ID of the role being added
     */
    public static addRole(receivedMessage, roleId: string) {
        const role = receivedMessage.guild.roles.cache.find((value) => value.id === roleId);
        const { member } = receivedMessage;
        if (role) member.roles.add(role);
    }

    /**
     * Removed a role from a user.
     * @param receivedMessage The message that was sent
     * @param roleId The ID of the role being removed
     */
    public static removeRole(receivedMessage, roleId: string) {
        const role = receivedMessage.guild.roles.cache.find((value) => value.id === roleId);
        const { member } = receivedMessage;
        if (role) member.roles.remove(role);
    }
}
