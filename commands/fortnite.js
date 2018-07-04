
const config = require('../config.json');
const Fortnite = require('fortnite');
const stats = new Fortnite(config.fortnite.key); //replace "config.fortnite.key" with the API key if you dont have this file

exports.run = (client, message, args, tools) => {

    let platform; //Platform type  (pc, xbl, psn)
    let type; //Type of mode to retrieve (solo, duo, squad, all)
    let username; //Fortnite username

    //Conditions for missing arguments 
    if(!args[0] & !args[1] & !args[2]){
        return message.channel.send('**Include the platform `(pc, xbl, psn)`, type `(solo, duo, squad, all)` and username `\'/fortnite platform type username\'`**');   
    }
    if(!args[0]) {
        return message.channel.send('**Include the platform `(pc, xbl, psn)` \'/fortnite `platform` type username\'**');
    }
    if(!args[1]) {
        return message.channel.send('**Include the type `(solo, duo, squad, all)` \'/fortnite platform `type` username\'**');        
    }
    if(!args[2]) {
        return message.channel.send('**Include the username \'/fortnite platform type `username`\'**');        
    }

    //validate platform
    platform = args.shift();
    if(!checkPlatform(platform)){
        return message.channel.send('**Include the platform `(pc, xbl, psn)`, type `(solo, duo, squad, all)` and username `\'/fortnite platform type username\'`**');
    }

    //validate type
    type = args.shift().toLowerCase();
    if(!checkType(type)){
        return message.channel.send('**Include the type `(solo, duo, squad, all)` \'/fortnite platform `type` username\'**'); 
    }

    //Rest of the string should be combined for the username
    username = args.join(' ');


    console.log(platform);
    console.log(type);
    console.log(username);

    stats.user(username,platform).then( data => {
        
        let stats = mode(type,data);
        let msg = (type == "all") ? (modeData("solo",username,stats[0]) + modeData("duo",username,stats[1]) + modeData("squad",username,stats[2])) : modeData(type,username,stats);
        console.log(msg)
        //message.author.send(msg);
        return message.channel.send(msg);

    })
    .catch(error => {
        console.log(error);
        return message.channel.send('Username not found :eyes:');
    })
}
//Return the fortntie data object containing the stast for the specific mode type
function mode(type, data){
    if (type == "solo"){
        return data.stats.solo;
    } else if (type == "duo"){
        return data.stats.duo;
    } else if (type == "squad"){
        return data.stats.squad;
    } else if (type == "all"){
        return [data.stats.solo,data.stats.duo,data.stats.squad];
    }
    return;
    
}
//Return the data for the specific mode type
function modeData(type,username,stats){
    let score = stats.score;
    let kd = stats.kd;
    let matches = stats.matches;
    let kills = stats.kills;
    let kills_per_match = stats.kills_per_match;
    let score_per_match = stats.score_per_match;
    let wins = stats.wins;
    let top_3 = stats.top_3;
    let top_5 = stats.top_5;
    let top_12 = stats.top_12;

    let feels = ''
    if(wins == 0){
        feels =  " <:feels:459483155892666368>";
    }
    type = capitalize(type);
    let msg = "\n__***" + type +" Stats for " + username + "***__\:\n"

    msg = msg + "**score: **`" + score + "`\n" +
    "**kd: **`" + kd + "`\n" + "**matches: **`" + matches + "`\n" + 
    "**kills: **`" + kills + "`\n" + "**kills per match: **`" + kills_per_match + "`\n" + 
    "**score per match: **`" + score_per_match + "`\n" + "**wins: **`" + wins + "`" + feels + "\n" +
    "**top 3: **`" + top_3 + "`\n" + "**top 5: **`" + top_5 + "`\n" + "**top 12: **`" + top_12 + "`\n";

    return msg;
}

/*
    Helper Functions
*/
function checkPlatform(platform){
    platform = platform.toLowerCase();
    if((platform == "pc") || (platform == "xbl") || (platform == "psn")){
        return true;
    }
    return false;
}
function checkType(type){
    type = type.toLowerCase();
    if((type == "solo") || (type == "duo") || (type == "squad") || (type == "all")){
        return true;
    }
    return false;
}
function capitalize(word){
    let temp = word.charAt(0).toUpperCase();
    let cap = temp + word.slice(1);
    return cap;
}