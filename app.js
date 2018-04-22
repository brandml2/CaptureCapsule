var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var jsonfile = require("jsonfile");

var identifiers = [];
var file_paths = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/CaptureCapsule.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  var files = [];

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    files.push(path.join(__dirname, 'uploads', file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    file_paths.push(files);
    console.log(file_paths)
    res.end('success');
  });

  form.on('field', function(name, value) {
    //this takes all name and value pairs
    console.log(name, value)
    var date = new Date(Number(value.substring(0, 4)), Number(value.substring(5, 7))-1, Number(value.substring(8)), 11, 50, 0);
    //Uses hashing to have a unique ID associated with the person's images
    var need_hash = name+value+Date.now();
    var hash = crypto.createHash("sha256");
    hash = hash.update(need_hash).digest("hex").substring(0, 10);
    identifiers.push(hash);
    console.log(hash);
    //Create website with images associated to the hashed number


    var j = schedule.scheduleJob(date, function() {
      //CaptureCapsule2018@gmail.com
      //CitrusHacks2018
      //Domain.com password: CitrusHacks2018!

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'CaptureCapsule2018@gmail.com',
          pass: 'CitrusHacks2018'
        }
      });

      var mailOptions = {
        from: 'CaptureCapsule2018@gmail.com',
        to: name,
        subject: "It's time to view your CaptureCapsule!",
        text: String(hash)
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      j.cancel()
    });
  });

  // parse the incoming request containing the form data
  form.parse(req, function() {
    console.log(identifiers, file_paths);
    var file = "public/data.json";
    var obj = {};
    for (var i = 0; i < identifiers.length; i++) {
      obj[identifiers[i]] = file_paths[i];
    }
    jsonfile.writeFile(file, obj, function(err) {
      console.error(err)
    });
  });

});

var server = app.listen(80, function(){
  console.log('Server listening on port 80');
});