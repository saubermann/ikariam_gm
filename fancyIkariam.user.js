// ==UserScript==
// @name        Fancy Ikariam Addons
// @namespace   Fancy Ikariam Addons
// @include			https://s*.ikariam.gameforge.*/*
// @version     1
// @grant       none
// ==/UserScript==

var i = document.createElement('iframe');
i.style.display = 'none';
document.body.appendChild(i);
var selfConsole = i.contentWindow.console;

function addScript(src) {
  	selfConsole.log("Adding script: " + src);
    var scr = document.createElement('script');
    scr.type = 'text/javascript';
    scr.src  = src;
    document.getElementsByTagName('body')[0].appendChild(scr);
}

//addScript('http://localhost/ikariam/gm_inject.js?4');
addScript('https://saubermann.github.io/ikariam_gm/gm_inject.js');