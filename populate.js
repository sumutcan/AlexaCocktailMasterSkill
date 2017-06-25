var extractor = require("./extractor.js");
var fs = require("fs");

var params = {
  maxDepth: 2,
  interval: 500,
  fetchRegex: "\/rezept"
};

var count = 0;
var cocktails = [];
function microdataParserCallback(err, result) {
  if (result["microdata"] !== undefined) {
    var annotations = result["microdata"]["@graph"];
    for (var i = 0; i < annotations.length; i++) {

      if (annotations[i]["@type"] == "Recipe") {
        console.log(annotations[i]["name"]["@value"]);
        count ++;
        console.log(count);
        cocktails.push(annotations[i]);

      }
    }
  }
}

function doneCallback()
{
  fs.writeFile(
    "cocktails.json",
    JSON.stringify(cocktails),
    function(err) {
      if (err) console.log(err);
    }
  );
}

function parserHandlerCallback(err, result) {
  console.log(JSON.stringify(result));
  if (result["jsonld"] !== undefined && result["jsonld"]["@type"] == "Recipe") {
    cocktailCount.push(result["jsonld"]["name"]);
    fs.writeFile(
      "data/" +
        result["jsonld"]["name"].replace("/\s+/g", "_") +
        "_" +
        sourceID +
        ".json",
      JSON.stringify(result["jsonld"]),
      function(err) {
        if (err) console.log(err);
      }
    );
  }
}



extractor.extract(
  "https://de.thebar.com/cocktail-rezepte?sort=Relevance&page=1&spirit=all&mixer=all&complexity=all&seeall=true&primaryFilter=null",
  params,
  microdataParserCallback,
  doneCallback
);
//extractor.extract("microdata","https://de.thebar.com/cocktail-rezepte?sort=Relevance&page=1&spirit=all&mixer=all&complexity=all&seeall=true&primaryFilter=null", "thebar", params);
