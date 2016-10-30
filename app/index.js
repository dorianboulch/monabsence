/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var fs = require('fs');
var Docxtemplater = require('docxtemplater');
var FileSaver = require('file-saver');

var storage = require('electron-json-storage');

var content = fs.readFileSync(__dirname + "/../files/input.docx", "binary");

storage.get('profil', function(error, data) {
    if (error) throw error;

    jQuery('body').find('[name=nom]').val(data.nom);
    jQuery('body').find('[name=prenom]').val(data.prenom); 
});

jQuery('#save').on("click", function () {

    var doc = new Docxtemplater(content);

    doc.setData({
        title       : getTitle(),
        nom         : jQuery('body').find('[name=nom]').val(),
        prenom      : jQuery('body').find('[name=prenom]').val(),
        date_debut  : jQuery('body').find('[name=date_debut]').val(),
        date_fin    : jQuery('body').find('[name=date_fin]').val(),
        today       : getToday()
    });

    doc.render();

    var out = doc.getZip().generate({type: "blob"});

    FileSaver.saveAs(out, "Demande de " + jQuery('body').find('[name=type]:checked').val() + ".docx");
});

function getTitle() {
    switch (jQuery('body').find('[name=type]:checked').val()) {
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
