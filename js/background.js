var values = [];
var indextracker = 1;
var record=false;//TODOfixed: Need to fix this flag from popup js
console.log("I am background js");
//TODOdone: Background js should have a tag controlled from UI whether to record or not and decide if to send values to popup of not
$(document).ready(function() {
    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.windows.create({
            'url': '/html/index.html',
            'type': 'normal',
            'state':'maximized'
        }, function(window) {
            console.log('hi');
        });
    });
    chrome.runtime.onMessage.addListener(function(msg, sender, response) {
        if ((msg.from === 'popup') && (msg.subject === 'getdata')) {
            console.log("i got getdata from popup");
            console.log(values);
            response(values);
        }
    });
    //TODOdone : Add event listener from popupjs to check if recording enabled or not and set a boolean flag

    chrome.runtime.onMessage.addListener(function(msg, sender, response) {
        if ((msg.from === 'popup') && (msg.subject === 'enable/disable')) {
            console.log("i got enable/disable message from popup");
            record=!record;
            response({ statusofrecorder : record});
        }
    });

    //addinglistener for resetdatarequest
    chrome.runtime.onMessage.addListener(function(msg, sender, response) {
        if ((msg.from === 'popup') && (msg.subject === 'reset')) {
            console.log("i got reset message from popup");
            values=[];
            indextracker = 1;
            record=false;
            response({ status : record});
        }
    });

    chrome.runtime.onMessage.addListener(function(msg, sender, response) {
        if ((msg.from === 'content') && (msg.subject === 'capturedelement')) {
            console.log(msg.absxpath, msg.Action);
            if(record){
                //only if enabled in main UI this will be sent added and kept track of
                values.push({
                    index: indextracker,
                    Url: msg.Url,
                    TagName: msg.TagName,
                    pagename: msg.pagename,
                    ObjectName: msg.ObjectName,
                    RelativeXpath: msg.RelativeXpath,
                    AbsoluteXpath: msg.AbsoluteXpath,
                    CssSelector: msg.CssSelector,
                    Action: msg.Action,
                    ValueIfAny: msg.ValueIfAny,
                    IsRequired: msg.IsRequired
                });
                indextracker += 1;
                response({
                    success: true
                });
          }else{
                response({
                    success: false
                });
          }
        }
    });
});
