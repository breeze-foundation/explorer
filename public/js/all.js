$('#overlay').hide();
setTimeout(() => {
    $('#overlay').hide();
    $('#container').show();
}, 3000);
$('#overlay').show();
$('#container').hide()
function Link(val) {
    //alert(val)
    for (let i = 1; i <= 4; i++) {
        if (val == i) {
            document.getElementById(`tag${i}`).style.borderBottom = '5px solid #4598ff';
        } else {
            document.getElementById(`tag${i}`).style.borderBottom = 'none';
        }
    }

}