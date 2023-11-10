const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs')
const path = require('path')

let favouritesWindow;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });


// and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('storeFileData', (event, fileData) => {
  const dataFilePath = path.join(app.getPath('userData'), 'createdFiles.json');
  let storedData = [];
  
  try {
    storedData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
  } catch (err) {
    console.log(err);
  }

  storedData.push(fileData);
  fs.writeFileSync(dataFilePath, JSON.stringify(storedData));

  const fileList = document.querySelector('ul');
  fileList.innerHTML = ''; // Clear the existing list

  storedData.forEach((fileData) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `Name: ${fileData.name}<br>Description: ${fileData.description}`;
    fileList.appendChild(listItem);
  });
  event.sender.send('updateFileList', storedData);
});

ipcMain.on('requestStoredFileData', (event) => {
  const dataFilePath = path.join(app.getPath('userData'), 'createdFiles.json');
  let storedData = [];

  try {
    storedData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
  } catch (err) {
    console.log(err);
  }

  event.reply('storedFileData', storedData);
});


ipcMain.on('open-favourites', () => {
  if (!favouritesWindow) {
    favouritesWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    favouritesWindow.loadFile(path.join(__dirname, 'favourites.html'));
    favouritesWindow.webContents.openDevTools();

    ipcMain.on('fileCreated', (event, fileData) => {
      favouritesWindow.webContents.send('displayCreatedFiles', fileData);
    });

    
  }
});


ipcMain.on('fileModified', (event, { action, name, description }) => {
  const dataFilePath = path.join(app.getPath('userData'), 'createdFiles.json');
  let storedData = [];

  try {
    storedData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
  } catch (err) {
    console.log(err);
  }

  if (action === 'createOrUpdate') {
    const existingFileIndex = storedData.findIndex((file) => file.name === name);
    if (existingFileIndex !== -1) {
      storedData[existingFileIndex].description = description;
    } else {
      storedData.push({ name, description });
    }
  } 
  else if (action === 'delete') {
    const deletedIndex = storedData.findIndex((file) => file.name.toLowerCase() === name.toLowerCase());

    if (deletedIndex !== -1) {
      storedData.splice(deletedIndex, 1);
    }

    // Notify the 'favourites.html' window to refresh the displayed files
    if (favouritesWindow) {
      favouritesWindow.webContents.send('refreshFileList', storedData);
      console.log('refreshFileList event sent');
    }
  }

  fs.writeFileSync(dataFilePath, JSON.stringify(storedData));
});

ipcMain.handle('clearStoredData', (event) => {
  const dataFilePath = path.join(app.getPath('userData'), 'createdFiles.json');
  let storedData = [];

  // Clear the contents of storedData by assigning an empty array
  storedData = [];

  // Write the empty array back to the file
  fs.writeFileSync(dataFilePath, JSON.stringify(storedData));

  // Notify the 'favourites.html' window to refresh the displayed files
  if (favouritesWindow) {
    favouritesWindow.webContents.send('refreshFileList', storedData);
    console.log('refreshFileList event sent');
  }

  // You can also notify other windows or components if needed
  // event.sender.send('clearedStoredData', storedData);
});



