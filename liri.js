require("dotenv").config();
var fs = require("fs");
// Require Inquirer
var inquirer = require("inquirer");
// Require Axios
var axios = require("axios");
// Require Moment
var moment = require("moment");
// Require keys
var keys = require("./keys");


// Questions via prompt
inquirer
    .prompt([
        // Here we create a basic text prompt.
        {
            type: "input",
            message: '\n\nTo search for a song, type "spotify". \nTo search for a movie, type "movie". \nTo search for a band, type "band". \nTo read log.txt, type "read".\n',
            name: "option"
        }
    ])
    .then(function (inquirerResponse) {
        //  SPOTIFY SECTION
        if (inquirerResponse.option.trim().toUpperCase() == "SPOTIFY") {

            inquirer
                .prompt([
                    // Text prompt.
                    {
                        type: "input",
                        message: 'What song would you like to look up?\n',
                        name: "option"
                    }
                ])
                .then(function (inquirerResponse) {
                    if (inquirerResponse.option == "") {
                        inquirerResponse.option = "The Sign";
                    }
                    //NPM package: https://www.npmjs.com/package/node-spotify-api
                    var Spotify = require('node-spotify-api');

                    var spotify = new Spotify(keys.spotify);

                    spotify.search({
                            type: 'track',
                            query: inquirerResponse.option
                        })
                        .then(function (response) {
                            console.log("Artist: " + response.tracks.items[0].artists[0].name);
                            console.log("Song name: " + response.tracks.items[0].name);
                            console.log("Preview URL: " + response.tracks.items[0].preview_url);
                            console.log("Album: " + response.tracks.items[0].external_urls.spotify);
                        })
                })
                .catch(function (err) {
                    console.log('Error occurred: ' + err);
                });


            // OMDB via axios
        } else if (inquirerResponse.option.trim().toUpperCase() == "MOVIE") {
            inquirer
                .prompt([
                    // Text prompt.
                    {
                        type: "input",
                        message: 'What movie would you like to look up?\n',
                        name: "option"
                    }
                ])
                .then(function (inquirerResponse) {
                    if (inquirerResponse.option == "") {
                        inquirerResponse.option = "seven pounds";
                    }
                    var movieName = inquirerResponse.option.split(' ').join('+');
                    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

                    axios.get(queryUrl)
                        .then(
                            function (response) {
                                console.log("Title: " + response.data.Title);
                                console.log("Year: " + response.data.Year);
                                console.log("IMDB Rating: " + response.data.Rated);
                                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[0].Value);
                                console.log("Country in which produced: " + response.data.Country);
                                console.log("Language: " + response.data.Language);
                                console.log("Plot: " + response.data.Plot);
                                console.log("Actors: " + response.data.Actors);
                            })
                })
                .catch(function (error) {
                    if (error.response) {
                        // Error code information
                        console.log("Data:");
                        console.log(error.response.data);
                        console.log("Status:");
                        console.log(error.response.status);
                        console.log("Status:");
                        console.log(error.response.headers);
                    } else if (error.request) {
                        // Request not received:
                        console.log(error.request);
                    } else {
                        // Other error
                        console.log("Error", error.message);
                    }
                    console.log(error.config);
                });


            // Bands search via Axios
        } 
        else if (inquirerResponse.option.trim().toUpperCase() == "BAND") {
            inquirer
                .prompt([
                    // Text prompt.
                    {
                        type: "input",
                        message: 'What artist/band would you like to look up?\n',
                        name: "option"
                    }
                ])
                .then(function (inquirerResponse) {
                    if (inquirerResponse.option == "") {
                        inquirerResponse.option = "disturbed";
                        console.log("Band Name: " + inquirerResponse.option);
                    }
                    var artist = inquirerResponse.option.split(' ').join('+');
                    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

                    axios.get(queryUrl)
                        .then(
                            function (response) {
                                console.log("Venue: " + response.data[0].venue.name);
                                console.log("Venue Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region);
                                var testDate = response.data[0].datetime;
                                console.log("Event date: " + moment(testDate).format('MM/DD/YYYY'));
                            })
                })
                .catch(function (error) {
                    if (error.response) {
                        // Error code information
                        console.log("Data:");
                        console.log(error.response.data);
                        console.log("Status:");
                        console.log(error.response.status);
                        console.log("Status:");
                        console.log(error.response.headers);
                    } else if (error.request) {
                        // Request not received
                        console.log(error.request);
                    } else {
                        // Other error
                        console.log("Error", error.message);
                    }
                    console.log(error.config);
                });
        };
    });