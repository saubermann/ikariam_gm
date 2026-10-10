// ==UserScript==
// @name     IkariamLobby
// @version  1
// @include  https://lobby.ikariam.gameforge.com/*
// @grant    none
// ==/UserScript==

var i = document.createElement('iframe');
i.style.display = 'none';
document.body.appendChild(i);
var selfConsole = i.contentWindow.console;

//selfConsole.log("Running");

function updateServerNames() {
  //selfConsole.log("Updating Names " + document.querySelectorAll("#myAccounts .rt-tr-group").length);
  
  document.querySelectorAll("#myAccounts .rt-tr-group").forEach((row) => {
  //  selfConsole.log(row);
    const playerCell = row.querySelector(".player-cell");
    const serverName = row.querySelector(".server-name-cell > div");

    if (!playerCell || !serverName) return;

    const player = playerCell.textContent.trim();
    const nameTextNode = Array.from(serverName.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE
    );

    if (!player || !nameTextNode) return;

    const originalName =
      serverName.dataset.originalName ?? nameTextNode.nodeValue.trim();

    serverName.dataset.originalName = originalName;
    nameTextNode.nodeValue = `${originalName} (${player})`;
  });
}

setTimeout(updateServerNames, 1000);

/*

if (document.readyState === "complete") {
  updateServerNames();
} else {
  window.addEventListener("load", updateServerNames, { once: true });
}
*/
