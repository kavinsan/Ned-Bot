//Shuts down the bot
exports.run = (bot) => {
    try {
        bot.destroy();
    } catch (err){
        console.log(err.stack);
    }
}