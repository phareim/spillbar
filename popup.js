var bg = chrome.extension.getBackgroundPage();

function OnLoad() {
  presentFeed(chrome.extension.getBackgroundPage().telegraph_feed); 
  bg.setUnread(0);
}

//setInterval(presentFeed(chrome.extension.getBackgroundPage().telegraph_feed), 10000);

google.setOnLoadCallback(OnLoad);

function presentFeed(result) {
  if (!result.error) {
    var container = document.getElementById("content");
  	container.innerHTML = '';
    for (var i = result.entries.length - 1; i >= 0; i--) {
    	container.appendChild(createPopUpEntry( result.entries[i]) );
    };

    var clear = document.createElement('div');
    clear.setAttribute('class','clear');
    container.appendChild(clear);
  }
}

function createPopUpEntry(entry){
	var ent = document.createElement("div");
	ent.setAttribute('class','popup-entry rounded');
	var a = document.createElement('a');
	a.title = entry.title;
	a.setAttribute('class','popup-title');
	a.innerHTML = entry.author +": "+entry.title;
	a.href = entry.link;
	a.setAttribute('target','_blank');
	ent.appendChild(a);
	ent.appendChild(document.createElement('br'));
	/*var createddate = document.createElement('p');
	createddate.innerHTML = entry.pubDate;
	ent.appendChild(document.createElement('br'));*/
	var image = document.createElement("img");
	image.setAttribute('class','popup-avatar');
	image.setAttribute('src','images/'+entry.author+'.png');
    image.onerror = function(){this.src='images/64.png'};
	ent.appendChild(image);
	var content = document.createElement("div");
	content.setAttribute('class','popup-content');
	//var snippet = document.createElement('p');
	//snippet.setAttribute('class','snippet');
	//snippet.innerHTML = unescape(entry.contentSnippet);
	content.innerHTML = unescape(entry.contentSnippet);
	//var mouseover = document.createElement('div');
	//mouseover.setAttribute('class','mouseover');
	//mouseover.innerHTML = entry.content;
	//content.appendChild(snippet);
	//content.appendChild(mouseover);
	ent.appendChild(content);
	return ent;
}