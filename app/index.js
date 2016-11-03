/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var fs = require('fs');
var Docxtemplater = require('docxtemplater');
var FileSaver = require('file-saver');

var storage = require('electron-json-storage');

var ImageModule = require('docxtemplater-image-module');

var content = fs.readFileSync(__dirname + "/../files/input.docx", "binary");

storage.get('profil', function (error, data) {
    if (error)
        throw error;

    jQuery('body').find('[name=nom]').val(data.nom);
    jQuery('body').find('[name=prenom]').val(data.prenom);
    jQuery('body').find('[name=signature]').val(data.signature);
});

jQuery('#save').on("click", function () {

    var doc = new Docxtemplater(content);
    
    doc.attachModule(new ImageModule({
        centered: false,
        getImage: function (tagValue, tagName) {
            return fs.readFileSync(tagValue,'binary');
        },
        getSize: function (img, tagValue, tagName) {
            return [150,150];
        }
    }));

    doc.setData({
        title: getTitle(),
        nom: jQuery('body').find('[name=nom]').val(),
        prenom: jQuery('body').find('[name=prenom]').val(),
        date_debut: jQuery('body').find('[name=date_debut]').val(),
        date_fin: jQuery('body').find('[name=date_fin]').val(),
        today: getToday(),
        signature: jQuery('body').find('[name=signature]').val()
    });

    doc.render();

    var out = doc.getZip().generate({type: "blob"});

    FileSaver.saveAs(out, "Demande de " + jQuery('body').find('[name=type]:checked').val() + ".docx");
});

initDatePicker();

/**
 * 
 * @returns {undefined}
 */
function initDatePicker() {
    var nowTemp = new Date();
    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

    var DatePickerDebut = jQuery('.datepicker_debut').fdatepicker({
        language: 'fr',
        format: 'dd/mm/yyyy',
        onRender: function (date) {
            return date.valueOf() < now.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function (ev) {
        if (ev.date.valueOf() > DatePickerFin.date.valueOf()) {
            var newDate = new Date(ev.date);
            newDate.setDate(newDate.getDate());
            DatePickerFin.update(newDate);
        }
        DatePickerDebut.hide();
        jQuery('.datepicker_fin')[0].focus();
    }).data('datepicker');

    var DatePickerFin = jQuery('.datepicker_fin').fdatepicker({
        language: 'fr',
        format: 'dd/mm/yyyy',
        onRender: function (date) {
            return date.valueOf() < DatePickerDebut.date.valueOf() ? 'disabled' : '';
        }
    }).on('changeDate', function (ev) {
        DatePickerFin.hide();
    }).data('datepicker');
}

/**
 * 
 * @returns {String}
 */
function getTitle() {
    switch (jQuery('body').find('[name=type]:checked').val()) {
        case 'CP'  :
            return 'Demande de congés';
            break;
        case 'RTT' :
            return 'Demande de jours de RTT pour Non-Cadre';
            break;
    }
}

/**
 * 
 * @returns {getToday.today|String|Date}
 */
function getToday() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = dd + '/' + mm + '/' + yyyy;

    return today;
}
