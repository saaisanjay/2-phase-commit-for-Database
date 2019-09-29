var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var count = 0
var listOfPeople = []
//htpp message format
var httpH = "HTTP 1.x POST" +
                        "\nContent-Type: Message " +
                        "\nUser-agent: Client " +
                        "\nHost: http://localhost:5000 " +
                        "\nDate:";
//display saying "user connected"
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on("init", function (header,msg) {
    //display header
  	console.log(header)
    //display message
  	console.log(msg)
  	var xhttp = httpH + new Date() +"\n";
    //display the content length
  	xhttp = xhttp + "Content-Length:"+(count+"").length;
  	io.emit("init",xhttp,count+"")
  	listOfPeople.push(count)
    //incrementing count
  	count = count + 1
  })//election process
  socket.on("election", function(header,msg){
  	console.log(header)
  	var xhttp = httpH + new Date() +"\n";
  	xhttp = xhttp + "Content-Length:"+(listOfPeople[0]+"").length;
  	io.emit("AnyoneGreat",xhttp,listOfPeople[0])
  })//commit process
  socket.on("commit",function(header,msg){
  	  	console.log(header)
  	  	var xhttp = httpH + new Date() +"\n";
  		xhttp = xhttp + "Content-Length:"+(listOfPeople+"").length;
  	io.emit("toCoordinator", xhttp,listOfPeople, msg,"commit");
  })//abort process
  socket.on("abort",function(header,msg){
  	  	console.log(header)
var xhttp = httpH + new Date() +"\n";
  		xhttp = xhttp + "Content-Length:"+(listOfPeople+"").length;
  	io.emit("toCoordinator", xhttp,listOfPeople, msg,"abort");
  })//global commit process
  socket.on("GlobalCommit",function(header,msg){
  	  	console.log(header)
	var xhttp = httpH + new Date() +"\n";
  		xhttp = xhttp + "Content-Length:"+(msg+"").length;
  	io.emit("GlobalCommit",xhttp,msg);
  })//global abort process
  socket.on("GlobalAbort",function(header,msg){
  	  	console.log(header)
	var xhttp = httpH + new Date() +"\n";
  		xhttp = xhttp + "Content-Length:"+(msg+"").length;
  	io.emit("GlobalAbort",xhttp,msg)
  })
  socket.on("byebye",function(header,msg){
  	  	console.log(header)
//user gone and list the people in process
  	console.log("User Gone "+ msg)
  	var indexToDel = 0;
  	for(var i=0;i<listOfPeople.length;i++){
  		if(listOfPeople[i] == parseInt(msg)){
  			indexToDel = i;
  		}
  	}
  	console.log(listOfPeople)
  	listOfPeople.splice(indexToDel,1);
  	console.log(listOfPeople);

  })// in prepare state display header and date info
  socket.on('prepare', function(header,msg){
  	  	console.log(header)
  	  		var xhttp = httpH + new Date() +"\n";
  		xhttp = xhttp + "Content-Length:"+(msg+"").length;
  	io.emit('prepare',xhttp,msg);
  })
  //Display message "user gone"
  socket.on('disconnect', function(msg){
  	console.log("User Gone")
  })
});
//listening at the port 3000
http.listen(3000, function(){
  console.log('listening on *:3000');
});
