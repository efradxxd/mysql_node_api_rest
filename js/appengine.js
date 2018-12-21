// Global Variables
var DocHex;

/* Forms for the info of the signers*/
var i = 0;
var currentSigner;
$(document).ready(function(){
  $("#addBtn").click(function(){
    i++;
    $("#forms").append('<div id="signer' + i + '"><h3>Signer ' + i + '</h3><label>eMail: </label><input type="text" id="email' + i + '"><br><label>Phone: </label><input type="text" id="phone' + i + '"><br><br></div>');
        currentSigner = '"#signer' + i + '"';
        console.log(currentSigner);
    });
    $("#removeBtn").click(function(){
        $("#signer" + i).remove();
        i--;
    });
});
/*calll to API on ECS form validate user's crential*/
function validatefirm(){
    var cert = document.getElementById("cert").value;
    var key = document.getElementById("key").value;
    var pass = document.getElementById("pass").value;
    var API_URL = "http://localhost:3000/api/" + cert + "/" + key + "/" + pass;
    alert(API_URL);
    $.ajax({
        type: 'GET',
        dataType: 'JSONP',
        contentType: 'application/javascript',
        jsonpCallback: 'callback',
        url: API_URL,
        crossDomain: true,
        jsonp: 'callback',
        xhrFields: {
            withCredentials: false
        },
        success: function (data) {
            console.log(data);
            $('#entries').html('<p>' + data.status + ' '+ data.userStatus +' '+data.firma+'</p>');
        }
        /*,
        error: function(error) {
            console.log("FAIL....=================",error);
        }*/
    });
};
/*convert to hex funtion's*/
function convertToBase64() {
    //Read File
    var selectedFile = document.getElementById("dochex").files;
    //Check File is not Empty
    if (selectedFile.length > 0) {
        // Select the very first file from list
        var fileToLoad = selectedFile[0];
        // FileReader function for read the file.
        var fileReader = new FileReader();
        var base64;
        // Onload of file read the file content
        fileReader.onload = function(fileLoadedEvent) {
            base64 = fileLoadedEvent.target.result;
            // Print data in console
            console.log(base64);
            DocHex = base64;
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);
    }
};

/*upload doc to s3 and dynamo*/
$('#subirDocumento').on('click',()=>{
    $.ajax({
        type: "POST", 
        url: 'https://6lrahj9123.execute-api.us-west-2.amazonaws.com/prod/upload-file-to-s3', 
        crossDomain: true,
        data: JSON.stringify(""+DocHex), 
        contentType: "application/json",
        dataType: "json", 
        success: function(data, status) {
            console.log(JSON.parse(this.data));
        }
    });
});