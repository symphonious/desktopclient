const {contextBridge,ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('language',{
    title:"languages",
    createNoteLanguages: (data)=>ipcRenderer.invoke('languages-file',data)
})

contextBridge.exposeInMainWorld('file', {
    readTextFile: async () => {
      try {
        const result = await ipcRenderer.invoke('read-text-file');
        return result;
      } catch (error) {
        console.error('Error to invoke IPC:', error);
        return { success: false, error: error.message };
      }
    }
  });

  contextBridge.exposeInMainWorld('exe',{
    title:"exe",
    runExe: (data)=>ipcRenderer.invoke('run-exe',data)
})