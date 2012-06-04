// ==UserScript==
// @name         Discord Counter
// @namespace    macil
// @description  Counters certain moderator trolling on 4chan.
// @author       Macil
// @include      http*://boards.4chan.org/*/*
// @updateURL    https://raw.github.com/Macil/DiscordCounter/master/DiscordCounter.user.js
// @version      1.0
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function dcmain() {
    var showTimer = null;
    var queuedMessages = null;

    function prepareCSS() {
        var dcCSS = $("<style/>");
        dcCSS.html(".dcMessage { color: red; }");
        dcCSS.appendTo(document.body);
    }

    function showMessages() {
        if(queuedMessages != null) {
            alert(queuedMessages);
            queuedMessages = null;
        }
        showTimer = null;
    }

    function queueMessage(message) {
        if(queuedMessages == null) {
            queuedMessages = message;
        } else {
            queuedMessages += "\n" + message;
        }
        if(showTimer == null) {
            showTimer = setTimeout(showMessages, 200);
        }
    }

    function discordHandler(tag) {
        var tagtype = tag.nodeName.toLowerCase();
        var posttag = $(tag).closest(".post");
        $(tag).remove();
        var postnumber = posttag.attr("id").slice(1);
        queueMessage("Removed "+tagtype+" tag from post "+postnumber);
        var contenttag = $(".postMessage", posttag);
        var messagetag = $("<div/>").insertBefore(contenttag).addClass("dcMessage");
        messagetag.text("Discord Counter: Removed "+tagtype+" tag from this post.");
    }

    function cleanPosts() {
        var badtags = $(".post script, .post style, .post iframe");
        badtags.each(function() {
            discordHandler(this);
        });
    }

    prepareCSS();
    cleanPosts();
}

addJQuery(dcmain);
