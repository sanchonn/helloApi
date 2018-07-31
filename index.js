/**
 * Hello application
 * RESTful JSON API
 * Listen port 3000
 * When someone POST his name in name='someone', APP return a welcome message in JSON format
 */

 //Dependencies
 const http = require('http');
 const https = require('https');
 const url = require('url');
 const fs = require('fs');
 
 // Import config
 const config = require('./config');

 // Create HTTP server
 const httpServer = http.createServer((req,res)=>{
    unifiedServer(req,res);
 });

 // Start HTTP server
 httpServer.listen(config.httpPort, ()=>{
    console.log(`HTTP server is listening on ${config.httpPort} in config environment ${config.envName} mode`);
 });

 // Create HTTPS server
 const httpsServerOptions = {
     key : fs.readFileSync('./https/key.pem'),
     cert : fs.readFileSync('./https/cert.pem')
 };
 
 const httpsServer = https.createServer(httpsServerOptions, (req,res)=>{
    unifiedServer(req,res);
 });

 // Start HTTPS server
 httpsServer.listen(config.httpsPort, ()=>{
    console.log(`HTTPS server is listening on ${config.httpsPort} in config environment ${config.envName} mode`);
 });

 // All the server logic for both http and https server
 const unifiedServer = (req,res) =>{
    // Get the URL and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the method
    const method = req.method;

    // Get the query
    const query = parsedUrl.query;

    // Get the path
    const path = parsedUrl.pathname;
    // Replace all '/' in start and finish by ''
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get data from frontend
    const data = {};

    // Get the name of user and put it in the data object
    data.name = typeof(query.name) !=='undefined' ? query.name : 'anonymouse';
    
    // Choose handler
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    if (method == 'POST'){
        // When request has finished
        chosenHandler(data,(statusCode, payload = {})=>{
            // convert payload to string
            const payloadString = JSON.stringify(payload);           
            
            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log
            console.log(`Response by route ${trimmedPath} with code ${statusCode} and payload ${payloadString}`);
        });        
    }
    else {
        res.end('use POST request\n');
    }
 };
  
 // Handlers
 const handlers = {};
 
 /**
  * Hello handler
  * data - contain a user name 
  * callback - function
 */
 handlers.hello = (data,callback)=>{
    // Return 200 'OK' status code and a payload object
    callback(200, {payload : `Hello, ${data.name}`});
 };

 handlers.notFound = (name,callback)=>{
    // Return 404 'NotFound' status code
    callback(404);
 };
 
 // Router
 const router = {
     hello : handlers.hello
 };

 
 


