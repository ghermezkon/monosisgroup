var importData;
$(document).ready(function () {
    //var socket = io('http://monosisgroup.com');
    var socket = io('http://localhost:5001');
    socket.on('data', function (data) {
        importData = JSON.parse(data);
        $('#state').text(importData.body.State);
        $('#stateCode').text(importData.body.StateCode);
        $('#ResNum').text(importData.body.RefNum);
        $('#TraceNo').text(importData.body.TRACENO);
        $('#SecurePan').text(importData.body.SecurePan);
        $('#importMessage').text(importData.msg_ok);
        $('#SelfOrBlank').val(importData.body.ResNum.substr(49, 1));

        var SelfOrBlank = $('#SelfOrBlank').val();
        if (SelfOrBlank == 's')
            setInterval(function () { window.location.href = 'http://localhost:8100/#/confirm-price' }, 4000);
        else window.close();        
        socket.emit('disconnect'); socket.removeAllListeners();
        socket.close();
    });
})
