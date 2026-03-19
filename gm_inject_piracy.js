var fancyVersion = "1.0.0";

var i = document.createElement("iframe");
i.style.display = "none";
document.body.appendChild(i);
selfConsole = i.contentWindow.console;

function ViewInjector() {
  this.injectors = {
    pirateFortress: piracyStuff,
    default: function (v) {
      selfConsole.log("No Injector defined for view: " + v);
    },
  };
}

ViewInjector.prototype.inject = function (v, b) {
  selfConsole.log("Injected View: " + v);
  if (this.injectors[v] !== undefined) {
    this.injectors[v](b);
  } else {
    this.injectors["default"](v);
  }

  var backgroundView = getBackgroundView();
};

var viewInjector = new ViewInjector();

function isViewAvailable() {
  return ikariam && ikariam.templateView && ikariam.templateView.id;
}

function getBackgroundView() {
  return ikariam?.controller?.ikariam?.backgroundView?.id || "";
}

try {
  ajax.Responder._parseResponse = ajax.Responder.parseResponse;
  ajax.Responder.parseResponse = function (r) {
    //selfConsole.log(JSON.parse(r));
    ajax.Responder._parseResponse(r);

    //if (isViewAvailable()){
    try {
      var view = ikariam?.templateView?.id || "";
      viewInjector.inject(view, r);
    } catch (e) {
      selfConsole.log("Failed to inject view:", e);
    }
    //}
  };

  viewInjector.inject("newPageLoad");

  var jIkariamVersion = jQuery("#GF_toolbar .version span");
  jIkariamVersion.html(jIkariamVersion.html() + ` (GM: ${fancyVersion})`);
} catch (e) {
  selfConsole.log(e);
}

/* Injector Functions */
function piracyStuff(resp) {
  var resp = JSON.parse(resp);
  var highscore = JSON.parse(resp[2][1]["load_js"]["params"])["highscore"];

  var i = 0;
  $("#pirateHighscore li").each(function () {
    var place = $(this)["0"].getElementsByTagName("span")[0];
    console.log(highscore[i]);
    oldPlace = highscore[i]["oldPlace"];
    place.innerHTML =
      '<a href="/?view=island&cityId=' +
      highscore[i]["cityId"] +
      '">' +
      place.innerHTML;
    place.innerHTML +=
      '</a> <small style="font-size: 11px;">[' + oldPlace + "]</small>";
    i++;
  });

  if (window.location.host === "s74-de.ikariam.gameforge.com") {
    jQuery(".pirateHighscoreNextCalc").after(
      "<div align='center'><a class='button' id='gm_sync_score'>Sync Score</a></div>",
    );
    jQuery("#gm_sync_score").on("click", function () {
            $.ajax({
        type: "POST",
        url: "https://mediasolutionsdemo6.service-now.com/api/x_29168_ikariam/piracy/postScore",
        data: JSON.stringify(highscore),
        dataType: "json",            // fix
        contentType: "application/json",
        success: function (response) {
          console.log("Score synced successfully:", response);
          alert("Score synced successfully!");
        },
        error: function(jqxhr, textStatus, errorThrown) {
          console.error("AJAX error", textStatus, errorThrown, jqxhr.responseText);
          alert("Sync failed: " + textStatus);
        }
      });
    });
  }
}
