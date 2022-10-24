//joopinho 01062022 inject css & js into siebel page
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = chrome.runtime.getURL("injected.js");
document.body.appendChild(script);
var style = document.createElement('link');
style.type = 'text/css';
style.rel = 'stylesheet';
style.href = chrome.runtime.getURL("jjj_inspect.css");
document.head.appendChild(style);