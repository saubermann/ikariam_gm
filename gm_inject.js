var fancyVersion = "1.3";

var i = document.createElement('iframe');
i.style.display = 'none';
document.body.appendChild(i);
selfConsole = i.contentWindow.console;

function ViewInjector (){
	this.injectors = {
    warehouse: warehouseStuff,
    dump: warehouseStuff,
    buildingDetail: buildingDetailStuff,
	//	barbarianVillage: barbarenStuff,
		//militaryAdvisor: militaryAdvisorStuff,
		pirateFortress: piracyStuff,
    wonder: wonderStuff,
    highscore: highscoreStuff,
    highscoreAlly: highscoreStuff,
		default: function(v){
			selfConsole.log("No Injector defined for view: " + v);
			}
	}
}

ViewInjector.prototype.inject = function(v, b){
	selfConsole.log("Injected View: " + v);
	if (this.injectors[v] !== undefined){
		this.injectors[v](b);
	} else{
		this.injectors["default"](v);
	}

  var backgroundView = getBackgroundView();

  if(v && backgroundView == "city"){
    generalBuildingStuff();
  }

  if (backgroundView == 'island'){
      generalIslandStuff();
  }
}

var viewInjector = new ViewInjector();

function isViewAvailable(){
  return ikariam && ikariam.templateView && ikariam.templateView.id;
}

function getBackgroundView(){
  return ikariam?.controller?.ikariam?.backgroundView?.id || ''; 
}

try { 
  ajax.Responder._parseResponse = ajax.Responder.parseResponse;
  ajax.Responder.parseResponse = function(r){
    //selfConsole.log(JSON.parse(r));
    ajax.Responder._parseResponse(r);
    
    //if (isViewAvailable()){
      try{
        var view = ikariam?.templateView?.id || '';
        viewInjector.inject(view, r);
      } catch(e){
        selfConsole.log("Failed to inject view:", e);
      }
    //}    
  }

  viewInjector.inject('newPageLoad');

  var jIkariamVersion = jQuery("#GF_toolbar .version span");
  jIkariamVersion.html(jIkariamVersion.html() + ` (GM: ${fancyVersion})`);

} catch(e){
  selfConsole.log(e);
}


/* Injector Functions */

function highscoreStuff(){
  jQuery(".table01.highscore td.score").each(function (){
    var data = jQuery(this).attr("title");
    if(data){
     jQuery(this).html(data);
    }
 });
}

function generalIslandStuff(){
  var cities = ikariam.controller.ikariam.backgroundView.screen.data.cities;
  cities.forEach(function (city, i){
        var jCity = jQuery("#js_cityLocation" + i + "TitleText");
        var cityName = city.name + " [<b>" + city.ownerName + "</b>]";
        jCity.html(cityName);
      });
}

function generalBuildingStuff(){
  var jBuilding = jQuery("#buildingUpgrade");
  if(jBuilding.length > 0 && jQuery('#accordionResourceContainer').length == 0){
    var jResource = jQuery("#buildingUpgrade").find(".resources");
    var wood = parseResource('wood');
    var wine = parseResource('wine');
    var marble = parseResource('marble');
    var crystal = parseResource('crystal');
    var sulfur = parseResource('sulfur');
    var total = 5;
    
    var container = getResourceContainer(wood,wine,marble,crystal,sulfur,total);
    jQuery("#sidebarWidget li:first-child.accordionItem").after(container);

    function parseResource(resource){
      var text = jResource.find("." + resource).attr("title");
  
      if(text){
        text = text.split(":");
        return text.length > 1? text[1].trim(): "0";
      }
  
      return "0";
    }

    function getResourceContainer(wood, wine, marble, crystal, sulfur){
      var total = [wood, wine, marble, crystal, sulfur].map(x => parseInt(x.replace(/\./g, '')));
      total = total.reduce((a, b) => a + b, 0).toLocaleString("de-DE");
    
      var container = `<li id="accordionResourceContainer" class="accordionItem"><a class="accordionTitle active">Benötigte Rohstoffe<span class="indicator"></span></a>
        <div class="accordionContent">
            <div id="informationSidebar" class="dynamic">
                <table class="sidebar_table">
                    <tbody>
                        <tr>
                            <th>Rohstoff</th>
                            <th style="text-align:right">Anzahl</th>
                        </tr>
                        <tr>
                            <td class="resource"><img src="//gf2.geo.gfsrv.net/cdn19/c3527b2f694fb882563c04df6d8972.png"
                                    title="Baumaterial" alt="Baumaterial"></td>
                            <td class="amount" style="text-align:right">${wood}</td>
                        </tr>
                        <tr>
                            <td class="resource"><img src="//gf1.geo.gfsrv.net/cdnc6/94ddfda045a8f5ced3397d791fd064.png"
                                    title="Wein" alt="Wein"></td>
                            <td class="amount" style="text-align:right">${wine}</td>
                        </tr>
                        <tr>
                            <td class="resource"><img src="//gf3.geo.gfsrv.net/cdnbf/fc258b990c1a2a36c5aeb9872fc08a.png"
                                    title="Marmor" alt="Marmor"></td>
                            <td class="amount" style="text-align:right">${marble}</td>
                        </tr>
                        <tr>
                            <td class="resource"><img src="//gf2.geo.gfsrv.net/cdn1e/417b4059940b2ae2680c070a197d8c.png"
                                    title="Kristallglas" alt="Kristallglas"></td>
                            <td class="amount" style="text-align:right">${crystal}</td>
                        </tr>
                        <tr>
                            <td class="resource"><img src="//gf1.geo.gfsrv.net/cdn9b/5578a7dfa3e98124439cca4a387a61.png"
                                    title="Schwefel" alt="Schwefel"></td>
                            <td class="amount" style="text-align:right">${sulfur}</td>
                        </tr>
                        <tr>
                            <td class="resource"<b>Gesamt</b></td>
                            <td class="amount" style="text-align:right"><b>${total}</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </li>`;
    
    return container;
    }
  }
}

function wonderStuff(){
  var totalPercentage = jQuery("#wonderOtherPlayers .table01 tr td:nth-child(6)").map(function(){
    var percentage = jQuery(this).html().replace("%", "").replace(",", ".");
    return parseFloat(percentage);
  }).toArray().reduce((a, b) => a + b, 0);

  jQuery("#wonderOtherPlayers .table01 tbody").append("<tr><td></td><td></td><td></td><td></td><td><b>Total:</b></td><td><b>" + totalPercentage.toString().replace(".", ",") + "%</b></td></tr>");
}

function warehouseStuff(resp){
  jQuery("[id^=js_total_],[id^=js_capacity_],[id^=js_plunderable_]").each(function (){
     var data = jQuery(this).find(".tooltip").html();
     if(data){
      jQuery(this).html(data);
     }
  });
}

function buildingDetailStuff(resp){
  jQuery("#buildingDetail table.table01 td.costs div").each(function (){
    var data = jQuery(this).find(".tooltip").html();
    if(data){
     jQuery(this).html(data);
    }
 });
}

function piracyStuff(resp) {
  var resp = JSON.parse(resp);
  var highscore = JSON.parse(resp[2][1]['load_js']['params'])['highscore'];
    
  var i = 0;
  $('#pirateHighscore li').each(function() {
    var place = $(this)['0'].getElementsByTagName('span')[0];
		console.log(highscore[i]);
    oldPlace = highscore[i]['oldPlace'];
		place.innerHTML = '<a href="/?view=island&cityId=' + highscore[i]['cityId'] + '">' + place.innerHTML;
    place.innerHTML += '</a> <small style="font-size: 11px;">[' + oldPlace + ']</small>';
    i++;                     
  });
}