/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var $ = require("jquery");

var fs = require('fs');

$('#save').on("click", function () {
    fs.writeFile("profil.json", JSON.stringify({
        nom     : $('#form').find('[name=nom]').val(),
        prenom  : $('#form').find('[name=prenom]').val()
    }));
    
    window.location.href = 'index.html';
});
