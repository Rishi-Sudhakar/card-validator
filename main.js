const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

function validateCreditCard(cardNumber, callback) {
  console.log('Starting validation for card number:', cardNumber);
  const cardValidator = spawn(path.join(__dirname, 'card-validator'), ['--single']);

  cardValidator.stdin.write(cardNumber + '\n');
  cardValidator.stdin.end();

  let output = '';
  let errorOutput = '';

  const MAX_OUTPUT_LENGTH = 1000; // Set a reasonable limit for the output length

  cardValidator.stdout.on('data', (data) => {
    console.log('Received data:', data.toString());
    if (output.length + data.length > MAX_OUTPUT_LENGTH) {
      callback('Error: Output too large');
      cardValidator.kill(); // Kill the process if the output is too large
    } else {
      output += data.toString();
    }
  });

  cardValidator.stderr.on('data', (data) => {
    console.error('Received error data:', data.toString());
    errorOutput += data.toString();
  });

  cardValidator.on('close', (code) => {
    console.log('Process closed with code:', code);
    if (code !== 0) {
      callback(`Process exited with code ${code}: ${errorOutput}`);
    } else {
      callback(output.trim());
    }
  });

  cardValidator.on('error', (err) => {
    console.error('Process error:', err.message);
    callback(`Failed to start subprocess: ${err.message}`);
  });
}

ipcMain.on('validate-card', (event, cardNumber) => {
  validateCreditCard(cardNumber, (result) => {
    event.sender.send('validation-result', result);
  });
});
