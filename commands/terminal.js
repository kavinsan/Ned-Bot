/**
 * Terminal to bot functions and commands
 * Terminal based commands found under ./commands/terminal/${file name here}.js
 */
exports.run = (bot) => {
    var stdin = process.openStdin();

    stdin.addListener("data", function(d){
        let replyChannel = bot.channels.get("459450076599812098");
        let cmd = d.toString('utf8').trim()

        try {
            //delete require.cache[require.resolve(`./commands/terminal/${cmd}.js`)];
            let commandFile = require(`./commands/terminal/${cmd}.js`);
            commandFile.run(bot);
        } catch (err) {
            console.log(err.stack)
        }
    });
}