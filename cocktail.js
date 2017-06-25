module.change_code = 1;
("use strict");

var alexa = require("alexa-app");
var app = new alexa.app("cocktail-master-skill");
var fs = require("fs");

var db = null;

app.launch(function(request, response) {
  response
    .say("Wilkommen zu Bartender")
    .reprompt("Alles tip top.")
    .shouldEndSession(false);
  db = JSON.parse(
    fs.readFileSync("apps/AlexaCocktailMasterSkill/cocktails.json", "utf8")
  );
});

app.error = function(exception, request, response) {
  console.log(exception);
  console.log(request);
  console.log(response);
  response.say("Leider gibt es ein Fehler: " + error.message);
};

app.intent(
  "cocktailByName",
  {
    slots: { name: "NAME" },
    utterances: [
      "gib mir das Rezept von {name}",
      "erzaehl mir das Rezept von  {name}",
      "Was ist das Rezept von {name}"
    ]
  },
  function(request, response) {
    if (!db)
      db = JSON.parse(
        fs.readFileSync("apps/AlexaCocktailMasterSkill/cocktails.json", "utf8")
      );

    var name = request.slot("name");

    for (var i = 0; i < db.length; i++) {
      //console.log(JSON.stringify(db[i]));
      if (db[i]["name"]["@value"].toLowerCase().indexOf(name.toLowerCase()) > -1) {
        if (db[i]["recipeInstructions"]) {
					response.say("Das Rezept von " + db[i]["name"]["@value"]+": ");
          response.say(JSON.stringify(db[i]["recipeInstructions"]["@value"]));
          return;
        }
      }
    }
    response.say("Leider konnte ich keine Cocktail Rezepte finden.");
    //  response.say("Das Rezept von "+name+" ist sehr geil.");
  }
);

module.exports = app;
