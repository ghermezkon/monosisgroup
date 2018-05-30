$(document).ready(function () {
    var socket = io('http://monosisgroup.com');
    socket.on('data', function (data) {
        console.log(data);
    });

})
$("body").ready(onBodyLoaded);
//------------------------------------------------------
function onBodyLoaded() {
    console.log('Body');
    //$('#loader').show();
}
