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
            width: 600,
            height: 450
        });

        Window.main.setMenu(Window.getMenu());

        Window.main.loadURL('file://' + __dirname + '/index.html');

        // Window.main.webContents.openDevTools();

        Window.main.on('closed', function () {
            Window.main = null;
        });
    },
    
    getMenu: function () {
        return electron.Menu.buildFromTemplate([
            {
                label: 'Configuration',
                submenu: [
                    {
                        label: 'Profil',
                        click: function () {
                            Window.main.loadURL('file://' + __dirname + '/profil.html');
                        }
                    }
                ]
            },
            {
                label: 'Quitter',
                click: function () {
                    electron.app.quit();
                }
            }
        ]);
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