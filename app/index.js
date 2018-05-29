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

storage.get('profil', function (error, data) {
    if (error)
        throw error;

    jQuery('body').find('[name=nom]').val(data.nom);
    jQuery('body').find('[name=prenom]').val(data.prenom);
    if(data.cadre){
        jQuery('body').find('[name=cadre]').attr("checked", "checked");
    }
    jQuery('body').find('[name=signature]').val(data.signature);
});

jQuery('#save').on("click", function () {

    if (jQuery('body').find('[name=date_debut]').val() && jQuery('body').find('[name=date_fin]').val()) {
        var isCadre = jQuery('body').find('[name=cadre]').is(':checked');
        switch (jQuery('body').find('[name=type]:checked').val()) {
            case 'conges'   : generateConges(isCadre); break;
            case 'rtt'      : generateRTT(isCadre); break;
        }
    } else {
        if (!jQuery('body').find('[name=date_debut]').val()) {
            jQuery('body').find('[name=date_debut]').addClass('error');
        }

        if (!jQuery('body').find('[name=date_fin]').val()) {
            jQuery('body').find('[name=date_fin]').addClass('error');
        }
    }
});

jQuery('body').find('[data-check]').on('change', function () {
    checkType();
});

initDatePicker();

checkType();

function generateConges(cadre) {
    var templatePath;
    if(cadre){
        templatePath = "/../files/conges-cadre.docx"
    }else{
        templatePath = "/../files/conges-non-cadre.docx"
    }

    var content = fs.readFileSync(__dirname + templatePath, "binary");

    var doc = new Docxtemplater(content);

    doc.attachModule(new ImageModule({
        centered: false,
        getImage: function (tagValue, tagName) {
            return fs.readFileSync(tagValue,'binary');
        },
        getSize: function (img, tagValue, tagName) {
            sizeOf = require('image-size');
            var dimensions = sizeOf(tagValue);
            return [dimensions.width, dimensions.height];
        }
    }));

    doc.setData({
        nom: jQuery('body').find('[name=nom]').val(),
        prenom: jQuery('body').find('[name=prenom]').val(),
        texte_absence: getTexteAbsence(),
        today: getToday(),
        signature: jQuery('body').find('[name=signature]').val(),
        conges_payes: getCongesPayes(),
        conges_exceptionnels: getCongesExceptionnels(),
        conges_sans_solde: getCongesSansSolde(),
        motif: jQuery('body').find('[name=motif]').val()
    });

    doc.render();

    var out = doc.getZip().generate({type: "blob"});

    FileSaver.saveAs(out, "Demande de congés.docx");
}

function generateRTT(cadre) {
    var templatePath;
    if(cadre){
        templatePath = "/../files/rtt-cadre.docx"
    }else{
        templatePath = "/../files/rtt-non-cadre.docx"
    }

    var content = fs.readFileSync(__dirname + templatePath, "binary");

    var doc = new Docxtemplater(content);

    doc.attachModule(new ImageModule({
        centered: false,
        getImage: function (tagValue, tagName) {
            return fs.readFileSync(tagValue,'binary');
        },
        getSize: function (img, tagValue, tagName) {
            sizeOf = require('image-size');
            var dimensions = sizeOf(tagValue);
            return [dimensions.width, dimensions.height];
        }
    }));

    doc.setData({
        nom: jQuery('body').find('[name=nom]').val(),
        prenom: jQuery('body').find('[name=prenom]').val(),
        texte_absence: getTexteAbsence(),
        today: getToday(),
        signature: jQuery('body').find('[name=signature]').val(),
    });

    doc.render();

    var out = doc.getZip().generate({type: "blob"});

    FileSaver.saveAs(out, "Demande de RTT.docx");
}

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

function getTexteAbsence() {
    return jQuery('body').find('[name=date_debut]').val() === jQuery('body').find('[name=date_fin]').val()
        ? 'Le ' + jQuery('body').find('[name=date_debut]').val()
        : 'Du ' + jQuery('body').find('[name=date_debut]').val() + ' (inclus) au ' + jQuery('body').find('[name=date_fin]').val() + ' (inclus)';
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

/**
 * 
 * @returns {undefined}
 */
function checkType() {
    var type = jQuery('body').find('[data-check]:checked').attr('data-check');
    var value = jQuery('body').find('[data-check]:checked').val();
    
    jQuery('body').find('[data-' + type + ']').hide();
    jQuery('body').find('[data-' + type + '=' + value + ']').show();
}

function getCongesPayes() {
    return jQuery('body').find('[name=type]:checked').val() !== 'rtt' && jQuery('body').find('[name=conges]:checked').val() === 'payes'
        ? __dirname + '/../files/checkbox-checked.png'
        : __dirname + '/../files/checkbox.png';
}

function getCongesExceptionnels() {
    return jQuery('body').find('[name=type]:checked').val() !== 'rtt' && jQuery('body').find('[name=conges]:checked').val() === 'exceptionnels'
        ? __dirname + '/../files/checkbox-checked.png'
        : __dirname + '/../files/checkbox.png';
}

function getCongesSansSolde() {
    return jQuery('body').find('[name=type]:checked').val() !== 'rtt' && jQuery('body').find('[name=conges]:checked').val() === 'sans solde'
        ? __dirname + '/../files/checkbox-checked.png'
        : __dirname + '/../files/checkbox.png';
}