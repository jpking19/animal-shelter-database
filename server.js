var http = require('http'),
fs = require('fs'),
url = require('url'),
path = require('path'),
qs = require('querystring'),
port = 8000;
// For connecting to Postgres
const { Client } = require('pg');


// db setup
const client = new Client({
  connectionString: 'postgres://hjxnvsrqrnlmdu:4b21f0ed4248cc69fc625ff2bfbb50b82a85faaa2ef6b389f5dfcdec1343e605@ec2-174-129-225-9.compute-1.amazonaws.com:5432/d8j0qsghq908nu',
  ssl: true,
});

// Establish connection to db
client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('connected')
  }
});

// TODO remove this
client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
});

// server setup
var server = http.createServer(function(req, res) {
var uri = url.parse(req.url)
if (req.method === 'GET') {
  var s = uri.pathname;
  if (s.includes('?')) {
    s = s.substring(0, s.indexOf('?'));
  }
  console.log(s);
  switch (s) {
    case '/':
      sendFile(res, 'public/results.html')
      break;
    case '/results.html':
      sendFile(res, 'public/results.html')
      break;
    case '/form.html' :
      sendFile(res, 'public/form.html')
      break;
    case '/edit.html' :
      sendFile(res, 'public/edit.html')
      break;
    case '/css/style.css':
      sendFile(res, 'public/css/style.css', 'text/css')
      break;
    case '/js/scripts.js':
      sendFile(res, 'public/js/scripts.js', 'text/javascript')
      break;
    case '/animals':
      var animals = [];
      // Query db for all animals
      client.query('SELECT * FROM myschema.animals;', (err, dbResponse) => {
        if (err) throw err;

        // Compile all animals into array
        for (let row of dbResponse.rows) {
          animals.push(row);
        }

        // Response
        res.writeHead(200, {'Content-type': 'text/plain'});
        res.end(JSON.stringify(animals));
      });
      break;
    default:
      res.end('404 not found');
  }
} else if (req.method === 'POST') {
  switch (uri.pathname) {
    case '/animals':
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();

        console.log(body);
        animal = JSON.parse(body);

        // Create animal with given information in db
        query = `INSERT INTO myschema.animals
                 (id, name, breed, gender, age, fromhere, startdate)
                 VALUES ('${animal.id}',
                   '${animal.name}',
                   '${animal.breed}',
                   ${animal.gender},
                   ${animal.age},
                   '${animal.from}',
                   '${animal.date}');
                   `;
        client.query(query, (err, dbResponse) => {
          if (err) throw err;
          console.log(dbResponse);
          // Response
          res.writeHead(200, {'Content-type': 'text/plain'});
          res.end();
        });
      })
      break;
    default:
      res.end('404 not found');
  }
  // var body = '';
  // req.on('data', function(data) {
  //   body += data;
  // });
  // req.on('end', function() {
  //   var formData = JSON.parse(body);
  //   doAPICall(res, formData)
  // });
} else if (req.method === 'PUT') {
  // put to db
  switch (uri.pathname) {
    case '/animals':

      break;
    default:
      res.end('404 not found');
  }
} else if (req.method === 'DELETE') {
  switch (uri.pathname) {
    case '/animals':
      // Store the request body (id of animal) as a string
      let body = [];
      req.on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();

        console.log(body);
        jsonID = JSON.parse(body);

        // Delete animal of given id in db
        query = `DELETE FROM myschema.animals
                 WHERE id = '${jsonID.id}';
        `;
        client.query(query, (err, dbResponse) => {
          if (err) throw err;
          console.log(dbResponse);
          // Response
          res.writeHead(200, {'Content-type': 'text/plain'});
          res.end();
        });
      })
      break;
    default:
      res.end('404 not found');
  }
} else {
  get404(req, res);
}
})

// Launch server
server.listen(process.env.PORT || port);
console.log('listening on 8000')

// Helper functions
function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })
}
