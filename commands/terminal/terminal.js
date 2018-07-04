/**
 * Terminal commmand manager
 * Terminal based commands found under ./commands/terminal/${file name here}.js
 */
exports.run = (bot) => {
    var stdin = process.openStdin();

    stdin.addListener("data", function(d){
        let replyChannel = bot.channels.get("422538627650813960");
        let prefix = "/"
        
        let args = d.toString('utf8').trim().split(' ');
        let cmd = args.shift().toLowerCase();

        if(cmd == "$"){
            replyChannel.send(args.join(' '))
            return;
        }
        try {
            delete require.cache[require.resolve(`./${cmd}.js`)];
            let commandFile = require(`./${cmd}.js`);
            commandFile.run(bot);
        } catch (err) {
            //console.log(err.stack);
            console.log("Terminal command \"" + cmd + "\" does not exist")
        }
    });
}