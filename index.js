/**
 * Hello application
 * RESTApi
 * If path is 'hello' - statusCode 200 and object {payload : 'Hello world'}, if else - statusCode - 404 and payload {}
 * 
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

    // Get the path
    const path = parsedUrl.pathname;
    // Replace all '/' in start and finish by ''
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Choose handler
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    console.log('trimmedPath:',trimmedPath);
    
    // When request has finished
    chosenHandler((statusCode, payload = {})=>{
        // convert payload to string
        const payloadString = JSON.stringify(payload);           
        
        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);

        // Log
        console.log(`Response by route ${trimmedPath} with code ${statusCode} and payload ${payloadString}`);
    });        

 };
 
// Handlers
 const handlers = {};

 handlers.hello = (callback)=>{
    // Return 200 'OK' status code and a payload object
    console.log('ok');
    callback(200, {payload : 'Hello world!!!'});
 };

 handlers.notFound = (callback)=>{
    // Return 404 'NotFound' status code
    console.log('not found');
    callback(404);
 };
 
 // Router
 const router = {
     hello : handlers.hello
 };

 
 


