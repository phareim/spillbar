/**
 *
 * check out the reference for the google-feed-library:
 * http://code.google.com/apis/ajaxfeeds/documentation/reference.html#JSON
 *
 **/

google.load("feeds", "1");

var RN = {}; 
RN.interval = 10000;  //milliseconds between each feed check
RN.unread = 0;
var telegraph_feed;

// Window initialization code. Set up the various event handlers
window.addEventListener("load", function() {
	chrome.notifications.onClicked.addListener(notificationClicked);
});

function telegraph_feed(){
	return telegraph_feed;
}

function test(){
	pop(telegraph_feed.entries[0]);
}

function notificationClicked(noteID) {
	console.log("The notification '" + noteID + "' was clicked");
	window.open(noteID);
}

function pop(entry){
	var opt = {
        type: "basic",
        title: entry.title,
        message: unescape(entry.contentSnippet),
        iconUrl: 'http://forum.spilltelegrafen.no/themes/Spilltelegrafen/design/images/authors/'+entry.author+'.png',
		isClickable: true
      }
	  
	var callbackfunc = function(noteID) {
		console.log("Created note " + noteID);
	}

	opt.iconUrl = chrome.runtime.getURL("/images/" + entry.author + ".png");
	
	//Using link as note id, will be read when notification is clicked.
	chrome.notifications.create(entry.link, opt, callbackfunc);
}

//Load the list of posts we've seen  
RN.seen = localStorage["seen"];
if(!RN.seen){
    RN.seen = [];
}
else{
    RN.seen = JSON.parse(RN.seen);
}

function setUnread(num){
	RN.unread = num;
	chrome.browserAction.setBadgeText({"text":""+RN.unread});
}

//Add a post to the list of posts we've seen
function addSeen(id){
    RN.seen.push(id);
    localStorage["seen"] = JSON.stringify(RN.seen);
}

//List of feeds

//Initialize the list of feeds
function initializeFeeds(){
	RN.feed = (new google.feeds.Feed("http://forum.spilltelegrafen.no/discussions/comments/all/feed.rss"));
}

function onFeedLoad(result){
		telegraph_feed = result.feed;
    console.log("Checking feed...");
    if(!result.error){
        var container = document.getElementById("feed");
        for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            //If we have not seen this post
            if(RN.seen.indexOf(entry.link) < 0){
            		setUnread(RN.unread+1);
                pop(entry);
                addSeen(entry.link);
            }
        }
    }
    else{
        console.error("There was an error loading the feed.")
    }
}

//Load a feed and check it for new posts
function loadFeed(){
		RN.feed.setNumEntries(RN.unread > 5? RN.unread: 5);
    RN.feed.load(onFeedLoad);
    //Run again next interval
    setTimeout(loadFeed, RN.interval);
}

//Initialize the feeds and start the regular monitoring
function start(){
    initializeFeeds();
    loadFeed();
    console.log("Started checking feeds...");
}

//Once the Google Feeds API starts check the feeds
google.setOnLoadCallback(start);
