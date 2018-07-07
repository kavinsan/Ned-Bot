
const Discord = require('discord.js');
const config = require('../config.json');

exports.run = (bot,message,args) => {
    try {
        if(!message.member.roles.find("name","Sheep")){
            message.channel.send("**This command is for** `sheeps` **only**")
            return;
        }
    } catch(err){
        console.log("error getting role");
        message.channel.send("**This command is for** `sheeps` **only**")
        return;
    }

    let platform; //Platform type  (pc, xbl, psn)
    let username; //Fortnite username

    //Conditions for missing arguments 
    if(!args[0] & !args[1]){
        return message.channel.send('**Include the platform `(pc, xbl, psn)` and username `\'/fortnite platform username\'`**');   
    }
    if(!args[0]) {
        return message.channel.send('**Include the platform `(pc, xbl, psn)` \'/fortnite `platform` username\'**');
    }
    if(!args[1]) {
        return message.channel.send('**Include the username \'/fortnite platform `username`\'**');        
    }

    //validate platform
    platform = args.shift();
    if(!checkPlatform(platform)){
        return message.channel.send('**Include the platform `(pc, xbl, psn)` and username `\'/fortnite platform type username\'`**');
    }

    //Rest of the string should be combined for the username
    username = args.join(' ');

    var options = {
        mode: 'text',
        scriptPath: "./scripts/fortnite/",
        args: [platform, username]
    };
    var PythonShell = require('python-shell');
    var pyshell = new PythonShell("./scraper.py",options);
    
    pyshell.on('message', function (data) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(data);
        message.channel.send(data)
    });
    
    // end the input stream and allow the process to exit
    pyshell.end(function (err) {
        if (err){
            throw err;
        };
        extract(message);
        console.log('finished');
    });
    console.log("success");

};

function extract(message){
    delete require.cache[require.resolve(`../data.json`)];
    const data = require(`../data.json`);
    const keys = ["solo","duo","squad"];
    const colors = ["#92F3FF","#B8FF92","#ccccff"]
    
    for(let i = 0; i < 3; i++) {
        let color = colors[i]
        let mode = keys[i]
        let matches = data.data[i].matches
        let kd = data.data[i].kd
        let wins = data.data[i].wins
        let winPercent = data.data[i].winPercent
        let kills = data.data[i].kills
        let killsPerMatch = data.data[i].killsPerMatch
        let score = data.data[i].score
        let scorePerMatch = data.data[i].scorePerMatch
        
        let topX;
        let topY;
        let topXname;
        let topYname;

        switch(mode){
            case "solo":
                topX = data.data[i].top10
                topY = data.data[i].top25

                topXname = "top 10"
                topYname = "top 25"
                break;
            case "duo":
                topX = data.data[i].top5
                topY = data.data[i].top12

                topXname = "top 5"
                topYname = "top 12"
                break;
            case "squad":
                topX = data.data[i].top3
                topY = data.data[i].top6
                topXname = "top 3"
                topYname = "top 6"
                break;
        }
        
        if(wins == 0){
            wins +=  " <:feels:459483155892666368>";
        }

            let embed = new Discord.RichEmbed()
            .setTitle(mode)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setColor(color)
            .setThumbnail(message.author.avatarURL)
            .setFooter("https://fortnitetracker.com/profile/pc/lumelity", "http://i.imgur.com/w1vhFSR.png")
            .addField("matches",
    matches, true)
            .addField("kd",
            kd, true)
            .addField("wins",
            wins, true)
            .addField("win percent",
            winPercent, true)
            .addField("kills",
            kills, true)
            .addField("kills per match",
            killsPerMatch, true)
            .addField("score",
            score, true)
            .addField("score per match",
            scorePerMatch, true)
            .addField(topXname,
            topX, true)
            .addField(topYname,
            topY, true)

        message.channel.send({embed});
    }
    return
};

function checkPlatform(platform){
    platform = platform.toLowerCase();
    if((platform == "pc") || (platform == "xbl") || (platform == "psn")){
        return true;
    }
    return false;
}
