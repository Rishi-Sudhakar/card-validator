const { ipcRenderer } = require('electron');

document.getElementById('validate-button').addEventListener('click', () => {
  const cardNumber = document.getElementById('card-number').value;
  ipcRenderer.send('validate-card', cardNumber);
});

ipcRenderer.on('validation-result', (event, result) => {
  document.getElementById('result').textContent = result;
});
