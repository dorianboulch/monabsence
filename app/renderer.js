/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var $ = require("jquery");

var fs = require('fs');
var Docxtemplater = require('docxtemplater');
var FileSaver = require('file-saver');

var content = fs.readFileSync(__dirname + "/../files/input.docx", "binary");

document.getElementById('save').addEventListener("click", function () {

    var doc = new Docxtemplater(content);

    doc.setData({
        title       : getTitle(),
        nom         : $('#form').find('[name=nom]').val(),
        prenom      : $('#form').find('[name=prenom]').val(),
        date_debut  : $('#form').find('[name=date_debut]').val(),
        date_fin    : $('#form').find('[name=date_fin]').val(),
        today       : getToday()
    });

    doc.render();

    var out = doc.getZip().generate({type: "blob"});

    FileSaver.saveAs(out, "Demande de " + $('#form').find('[name=type]:checked').val() + ".docx");
});

function getTitle() {
    switch ($('#form').find('[name=type]:checked').val()) {
        case 'CP'  : return 'Demande de congés'; break;
        case 'RTT' : return 'Demande de jours de RTT pour Non-Cadre'; break;
    }
}

function getToday() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd < 10) {
        dd='0' + dd;
    } 

    if(mm < 10) {
        mm='0' + mm;
    } 

    today = dd + '/' + mm + '/' + yyyy;
    
    return today;
}
