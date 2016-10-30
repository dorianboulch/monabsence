/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var fs = require('fs');

var storage = require('electron-json-storage');

jQuery('#save').on("click", function () {
    storage.set('profil', {
        nom     : jQuery('body').find('[name=nom]').val(),
        prenom  : jQuery('body').find('[name=prenom]').val()
    });
    
    window.location.href = 'index.html';
});
