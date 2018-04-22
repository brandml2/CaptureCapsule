$('#upload_input').click(function(){
  var files = $('#file_input').get(0).files
  var email = $('#email_input').val()
  var date = $('#date_input').val()

  //Output to console files, email, date
  console.log(files)
  console.log(email)
  console.log(date)

  if (files.length > 0){
    // One or more files selected, process the file upload

    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }
    //formData.append('email', email);
    //formData.append('date', date);
    formData.append(email, date);



    $.ajax({
  	  url: '/upload',
  	  type: 'POST',
  	  data: formData,
  	  processData: false,
  	  contentType: false,
  	  success: function(data){
  	      console.log('upload successful!');
        }
	  });

  }

});

/*
$("#find_button").click(function() {
  var key = $('#key').val();
  var mydata = JSON.parse(data);
  console.log(mydata)
});
*/

function findPictures() {
  $.get('data.json', function(data) {
    var mydata = JSON.parse(data);
    var key = $("#key").val();
    alert(mydata[key]);
  }, 'text');
}