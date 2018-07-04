const config = require(`./config.json`);
const Discord = require('discord.js');
const bot = new Discord.Client();

const prefix = '/';
const terminal = require(`./commands/terminal/terminal.js`);
terminal.run(bot);

bot.on('message', message =>{

    //Commmand handler
    let args = message.content.slice(prefix.length).trim().split(' ');
    let cmd = args.shift().toLowerCase();

    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) {
        return;
    }
    try {
        delete require.cache[require.resolve(`./commands/${cmd}.js`)];
        let commandFile = require(`./commands/${cmd}.js`);
        commandFile.run(bot, message, args);
        
    } catch (err) {
        console.log(err.stack)
        console.log("Command does not exist");
    }

});

bot.on('ready', () =>{
    console.log(config.bots[id].name + ' Bot Started');
    //let replyChannel = bot.channels.get("459450076599812098");
    //replyChannel.send(":^) hello");
});

bot.on('disconnect', event => {
    console.log('Bot Disconnected');
});

//Bot id & login
var id = 1;
bot.login(config.bots[id].key);
