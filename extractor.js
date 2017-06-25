var metaparser = require('htmlmetaparser');
var htmlparser =  require('htmlparser2');

var simplecrawler = require("simplecrawler");


// setparams
var crawlerParams = {
  interval : 1000,
  maxDepth : 3,
  fetchRegex : ""
};

var markupType = "jsonld";
var rootURL = "";
var sourceID = "";

//begin crawling and extracting

var url ="";


function extract(rooturl, crawlerParams, parserHandlerCallback, doneCallback)
{
  this.markupType = markupType;
  this.rootURL = rooturl;
  this.sourceID = sourceID;
  this.crawlerParams = crawlerParams;

  var  crawler = new simplecrawler(this.rootURL);

  crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
    console.log("Fetched the resource %s", queueItem.url);
    url = queueItem.url;

    const handler = new metaparser.Handler(parserHandlerCallback,
      {
        url // The HTML pages URL is used to resolve relative URLs.
      }
    );


  const parser = new htmlparser.Parser(handler, { decodeEntities: true })
  parser.write(responseBuffer);
  parser.done();
  });

  crawler.addFetchCondition(function(queueItem, referrerQueueItem, callback) {
    if (crawlerParams["fetchRegex"] !== "")
      callback(null, queueItem.path.match(crawlerParams["fetchRegex"])); //"de\/drinks"
  });

  crawler.on("complete", doneCallback);


  crawler.interval = crawlerParams["interval"];
  crawler.maxDepth = crawlerParams["maxDepth"];



  crawler.start();
  console.log("Crawler started with: " + this.rootURL);

}

exports.extract = extract;
