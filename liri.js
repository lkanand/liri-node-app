require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var title = "";

var twitterScreenName = "lokey_charms";
var twitterCount = 20;

if(process.argv.length > 3) {
	var titleArray = [];
	for(i = 3; i < process.argv.length; i++)
		titleArray.push(process.argv[i]);
	title = titleArray.join(" ");
}

fs.appendFile("log.txt", command + " " + title + "\r\n\r\n", function(error) {
	if(error)
		return console.log("An error occurred: " + error);
});

function myTweets() {
	client.get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + twitterScreenName + "&count=" + twitterCount, 
	function(error, tweets, response) {
		if(error)
			return console.log("An error occurred: " + error);
		else{
			for(var i = 0; i < tweets.length; i++) {
				console.log(tweets[i].text);
				console.log(tweets[i].created_at);
				fs.appendFile("log.txt", tweets[i].text + "\r\n" + tweets[i].created_at + "\r\n", function(error) {
					if(error)
						return console.log("An error occurred: " + error);
				});
				if(i !== tweets.length - 1) {
					console.log("--------------------");
					fs.appendFile("log.txt", "--------------------\r\n", function(error) {
						if(error)
							return console.log("An error occurred: " + error);
					});
				}
				else {
					fs.appendFile("log.txt", "\r\n", function(error) {
						if(error)
							return console.log("An error occurred: " + error);
					});
				}
			}
		}
	});
}

function spotifyThisSong() {
	if(title === "")
		title = "The Sign";
	spotify.search({type: "track", query: title}, function(err, data) {
		if(err)
			return console.log("An error occurred: " + err);
		else {
			for(var i = 0; i < data.tracks.items.length; i++) {
				console.log("Artist(s): " + data.tracks.items[i].artists[0].name);
				console.log("Song: " + data.tracks.items[i].name);
				console.log("Preview Link: " + data.tracks.items[i].preview_url);
				console.log("Album: " + data.tracks.items[i].album.name);
				fs.appendFile("log.txt", "Artist(s): " + data.tracks.items[i].artists[0].name + 
					"\r\nSong: " + data.tracks.items[i].name + "\r\nPreview Link: " + 
					data.tracks.items[i].preview_url + "\r\nAlbum: " + data.tracks.items[i].album.name + "\r\n", function(error) {
					if(error)
						return console.log("An error occurred: " + error);
				});
				if(i !== data.tracks.items.length - 1) {
					console.log("--------------------");
					fs.appendFile("log.txt", "--------------------\r\n", function(error) {
						if(error)
							return console.log("An error occurred: " + error);
					});
				}
				else {
					fs.appendFile("log.txt", "\r\n", function(error) {
						if(error)
							return console.log("An error occurred: " + error);
					});
				}
			}
		}
	});
}

function movieThis() {
	if(title === "")
		title = "Mr. Nobody";
	request("https://www.omdbapi.com/?t=" + title + "&apikey=trilogy", function(error, response, body) {
		if(!error && response.statusCode === 200) {
			var movieObject = JSON.parse(body);
			console.log("Title: " + movieObject.Title);
			console.log("Release Year: " + movieObject.Year);
			console.log("IMDB Rating: " + movieObject.Ratings[0].Value);
			console.log("Rotten Tomatoes Rating: " + movieObject.Ratings[1].Value);
			console.log("Country/Countries of Production: " + movieObject.Country);
			console.log("Language(s): " + movieObject.Language);
			console.log("Plot: " + movieObject.Plot);
			console.log("Actors: " + movieObject.Actors);
			fs.appendFile("log.txt", "Title: " + movieObject.Title + 
				"\r\nRelease Year: " + movieObject.Year + "\r\nIMDB Rating: " + 
				movieObject.Ratings[0].Value + "\r\nRotten Tomatoes Rating: " + 
				movieObject.Ratings[1].Value + "\r\nCountry/Countries of Production: " + movieObject.Country + 
				"\r\nLanguage(s): " + movieObject.Language + "\r\nPlot: " + movieObject.Plot +
				"\r\nActors: " + movieObject.Actors + "\r\n\r\n", function(error) {
				if(error)
					return console.log("An error occurred: " + error);
			});
		}
		else
			return console.log("An error occurred");
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if(error)
			return console.log("An error occurred: " + error);
		else {
			var commandArray = data.split(",");
			if(commandArray.length > 0)
				command = commandArray[0];
			if(commandArray.length > 1)
				title = commandArray[1].substr(1, commandArray[1].length - 2);
			processRequest();
		}
	});
}

function processRequest() {
	if(command === "my-tweets")
		myTweets();
	else if(command === "spotify-this-song") {
		spotifyThisSong();
	}
	else if(command === "movie-this")
		movieThis();
	else if(command === "do-what-it-says")
		doWhatItSays();
}

processRequest();
