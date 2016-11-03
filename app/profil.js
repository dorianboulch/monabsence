/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var electron = require('electron');
var remote = electron.remote;
var fs = remote.require('fs');

var storage = require('electron-json-storage');

storage.get('profil', function(error, data) {
    if (error) throw error;

    jQuery('body').find('[name=nom]').val(data.nom);
    jQuery('body').find('[name=prenom]').val(data.prenom);
    jQuery('body').find('[name=signature]').val(data.signature);
    jQuery('#signature_visuel').append(jQuery('<img />').attr('src', data.signature));
});

jQuery('#save').on("click", function () {
    storage.set('profil', {
        nom         : jQuery('body').find('[name=nom]').val(),
        prenom      : jQuery('body').find('[name=prenom]').val(),
        signature   : jQuery('body').find('[name=signature]').val()
    });
    
    window.location.href = 'index.html';
});

jQuery('#signature').on("click", function () {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        title: "Selectionnez votre signature",
        properties: ['openFile']
    }, function (filenames) {
        jQuery('body').find('[name=signature]').val(filenames[0]);
        jQuery('#signature_visuel').empty();
        jQuery('#signature_visuel').append(jQuery('<img />').attr('src', filenames[0]));
    });
});
