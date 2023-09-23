const { app, BrowserWindow,ipcMain } = require('electron');
const path=require('path');
const fs = require('fs');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    icon: path.join(__dirname,'src','icon.ico'),
    width: 500,
    height: 650,
    autoHideMenuBar: true,
    webPreferences: {
        preload: path.join(__dirname,'preload.js')
      }
  });
  

  ipcMain.handle('languages-file',(req,data)=>{
    const tempDir = process.env.TEMP || process.env.TMP;
    const filePath = tempDir+'/app_languages.txt';
    const receivedmessage=data.receivedmsg;
    const language1=receivedmessage.split("_")[0];
    const language2=receivedmessage.split("_")[1];
    fs.writeFileSync(filePath,language1+"\n"+language2);
    return {sucess:true,filePath};
  })
  



  ipcMain.handle('read-text-file', (event) => {
    try {
      const tempDir = process.env.TEMP || process.env.TMP;
      const filePath = tempDir+'/app_translated_text.txt';
      const fileContents = fs.readFileSync(filePath, 'utf-8');
      return { success: true, fileContents };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });



  ipcMain.handle('run-exe',(req,data)=>{
    console.log("__run__");
    const programName = 'translator_s3.exe';
    const command = 'tasklist';
    exec(command, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error run command: ${error}`);
          return;
      }
      if (stdout.includes(programName)) {
          console.log(`${programName} is running`);
      } else {
          console.log(`${programName} is not running.`);
          ejecutarPrograma();
      }
    });
    function ejecutarPrograma() {
      exec(programName, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error run transcriber_main.exe: ${error}`);
            return;
        }   
        console.log(`Result: ${stdout}`);
        setTimeout(() => {
            console.log("10 seconds later");
        }, 10000);
      });
    }
  })


  win.loadFile('src/index.html');
}

app.on('ready', () => {
  createWindow();
})

app.on('window-all-closed', () => {
  const content = 'Init';
  const tempDir = process.env.TEMP || process.env.TMP;
  const transcriptionPath= tempDir+"/app_translated_text.txt";
  try {
    fs.writeFileSync(transcriptionPath, content);
  } catch (error) {
    console.error(`Error creating the file "${transcriptionPath}": ${error.message}`);
  }

  const { exec } = require('child_process');
  const programName = 'translator_s3.exe';
  const command = `taskkill /F /IM "${programName}"`;
  exec(command, (error, stdout, stderr) => {
  if (error) {
      console.error(`Error on close ${programName}: ${error.message}`);
      app.quit();
      return;
  }
  if (stderr) {
      console.error(`Standar error on close ${programName}: ${stderr}`);
      return;
  }
                
  console.log(`${programName} has been closed`);
  app.quit();
  }); 
})
