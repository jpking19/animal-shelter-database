var http = require('http'),
fs = require('fs'),
url = require('url'),
path = require('path'),
qs = require('querystring'),
// XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
port = 8000;

var server = http.createServer(function(req, res) {
var uri = url.parse(req.url)
if (req.method === 'GET') {
  switch (uri.pathname) {
    case '/':
      sendFile(res, 'public/index.html')
      break;
    case '/index.html':
      sendFile(res, 'public/index.html')
      break;
    case '/results.html':
      sendFile(res, 'public/results.html')
      break;
    case '/css/style.css':
      sendFile(res, 'public/css/style.css', 'text/css')
      break;
    case '/js/scripts.js':
      sendFile(res, 'public/js/scripts.js', 'text/javascript')
      break;
    case '/data':
      res.writeHead(200, {'Content-type': 'text/plain'})
      res.end(JSON.stringify(results))
      break;
    default:
      res.end('404 not found')
  }
} else if (req.method === 'POST') {
  console.log("POST request");
  var body = '';
  req.on('data', function(data) {
    body += data;
  });
  req.on('end', function() {
    var formData = JSON.parse(body);
    doAPICall(res, formData)
  });

} else if (req.method === 'PUT') {
  // put to db
} else if (req.method === 'DELETE') {
  get404(req, res);
} else {
  get404(req, res);
}
})

server.listen(process.env.PORT || port);
console.log('listening on 8000')


//   // The whole response has been received. Print out the result.
//   resp.on('end', () => {
//     //console.log(data);
//     parsedData = JSON.parse(data);
//     callback(res, alcLow, alcHigh, parsedData);
//   });
// }).on("error", (err) => {
//   console.log("Error: " + err.message);
// });
// }

// function processResponse(res, alcLow, alcHigh, parsedData) {
// console.log(parsedData.nhits);
// var alcByVolumeList = [];
// for (var x = 0; x < parsedData.nhits; x++) {
//   if (parsedData.records[x].fields.abv >= alcLow && parsedData.records[x].fields.abv <= alcHigh) {
//     alcByVolumeList.push(parsedData.records[x]);
//   }
// }
//
// // Get random beer from returned list
// var beer = alcByVolumeList[Math.floor(Math.random()*alcByVolumeList.length)];
//
// // Add beer to results array to be stored in memory
// results.push(beer);
//
// // Send response back to client with recommended beer
// res.writeHead(200, {'Content-Type': 'application/x-www-form-urlencoded'});
// res.end(JSON.stringify(beer));
// }
//
// function get404(req, res) {
// //fill in
// }
//
// function chooseDrink(res){
// var drinks = ["Skim Milk",
//               "1% Milk",
//               "2% Milk",
//               "Whole Milk",
//               "Chocolate Milk",
//               "Apple Juice",
//               "Orange Juice",
//               "Cranberry Juice",
//               "La Croix Seltzer"];
// var rand = drinks[Math.floor(Math.random() * drinks.length)];
// res.writeHead(200, {'Content-Type': 'text/plain'});
// res.end(rand);
// }

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })
}
