const http = require('http');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
//app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

// default URL for website
app.use('/', function(req,res){
    //res.sendFile(path.join(__dirname+'/index.html'));
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
const server = http.createServer(app);
const port = 5000;

server.listen(port);
console.debug('Server listening on port ' + port);
