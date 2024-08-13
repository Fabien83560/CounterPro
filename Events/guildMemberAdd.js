const getEmbed = require('../Functions/getEmbed');

module.exports = async bot => {
    bot.on('guildMemberAdd', async member => {
        if (member.guild.id === '1272226665644167178') {
            try {
                const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === '1272228468989493428');

                if (!welcomeChannel) {
                    console.error('Welcome channel not found');
                    return;
                }

                const welcomeEmbed = await getEmbed(
                    "DEFINED",
                    "Welcome to the CounterPro community server!",
                    `Welcome ${member.user.username}! We are delighted to have you among us. Don't hesitate to consult the rules and participate in the discussions!`,
                    "#1E90FF"
                );

                await welcomeChannel.send({ embeds: [welcomeEmbed] });

            } catch (error) {
                console.error('Failed to send welcome message:', error.message);
            }
        }
    });
};
