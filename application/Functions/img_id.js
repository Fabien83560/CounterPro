module.exports = async (bot, imgName) => {
    const ids = {
        "logo": '<:logo:1271877957413114019>',
        "1": '<:Leaderboard_1:1273362293207466056>',
        "2": '<:Leaderboard_2:1273362368352485417>',
        "3": '<:Leaderboard_3:1273362428452802702>',
        "4": '<:Leaderboard_4:1273362495905595552>',
        "5": '<:Leaderboard_5:1273362508299636787>',
        "6": '<:Leaderboard_6:1273362522405339186>',
        "7": '<:Leaderboard_7:1273362530525249586>',
        "8": '<:Leaderboard_8:1273362539366846537>',
        "9": '<:Leaderboard_9:1273362548686590080>',
        "10": '<:Leaderboard_10:1273362557733830768>'
    };
    const testingIds = {
        "logo": '<:logo:1271877849564975224>',
        "1": '<:Leaderboard_1:1274088288185094215>',
        "2": '<:Leaderboard_2:1274088303037251674>',
        "3": '<:Leaderboard_3:1274088315414511687>',
        "4": '<:Leaderboard_4:1274088326466502810>',
        "5": '<:Leaderboard_5:1274088339326373888>',
        "6": '<:Leaderboard_6:1274088351938641952>',
        "7": '<:Leaderboard_7:1274088363728830507>',
        "8": '<:Leaderboard_8:1274088376122871821>',
        "9": '<:Leaderboard_9:1274088390127648810>',
        "10": '<:Leaderboard_10:1274088404119846982>'
    };

    const id = bot.user.username == "Testing" ? testingIds[imgName] : bot.user.username === "CounterPro" ? ids[imgName] : null;
    return id ? id : null;
};
