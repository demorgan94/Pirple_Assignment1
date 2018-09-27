/*
* Assigment 1 of the Node Master Class
* Creat a RESTful API 
*/

'use strict'

// Dependencies
let http = require('http');
let https = require('https');
let url = require('url');
let config = require('./config');
let fs = require('fs');
let StringDecoder = require('string_decoder').StringDecoder;

// HTTPS Options Object
let httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem') 
};

// Instantiate the HTTP Server
let httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start the http server and show the port
httpServer.listen(config.httpPort, () => {
  console.log("Server listening on port: " + config.httpPort);
});

// Instantate the HTTPS Server
let httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// Start the https server and show the port
httpsServer.listen(config.httpsPort, () => {
  console.log("Server listening on port: " + config.httpsPort);
});

let unifiedServer = (req, res) => {
  // Get the URL and parse it
  let parseUrl = url.parse(req.url, true);
  
  // Get the path
  let path = parseUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the payload, if any
  let decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  
  req.on('end', () => {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found use the notFound handler
    let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    let data = {
      'welcome': welcomeMessage,
      'error': errorMessage
    }

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      let payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log("Returning this response:", statusCode, payloadString);
    });
  });
}

let handlers = {};

// Define the JSON Format message
let welcomeMessage = {
  'hello': 'Welcome to my first RESTful API!'
};

let errorMessage = {
  'error': 'This route does not exist'
}

handlers.hello = (data, callback) => {
  callback(200, data.welcome);
};

handlers.notFound = (data, callback) => {
  callback(404, data.error);
}

// Define the route
let router = {
  'hello': handlers.hello
}