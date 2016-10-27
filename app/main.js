var electron = require('electron');

var Window = {
    
    main: null,
    
    init: function () {
        if (Window.main === null) {
            Window.create();
        }
    },
    
    create: function () {
        Window.main = new electron.BrowserWindow({
            width: 1400,
            height: 800
        });

        Window.main.loadURL('file://' + __dirname + '/index.html');

        Window.main.webContents.openDevTools();

        Window.main.on('closed', function () {
            Window.main = null;
        });
    }
    
};

electron.app.on('ready', Window.create);

electron.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      electron.app.quit();
    }
});

electron.app.on('activate', function () {
    Window.init();
});