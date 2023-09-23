
const iframe = document.getElementById("myFrame");

let previousFileLength = 0;

async function readAndSendLines() {
    file.readTextFile()
    .then((result) => {
        if (result.success) {
            const fileContents = result.fileContents;
            const lines = fileContents.split('\n');
            const currentFileLength = lines.length;
            if (currentFileLength !== previousFileLength) {
                for (let i=0;i<lines.length;i++) {
                    if (i==currentFileLength-1) {
                        iframe.contentWindow.postMessage(lines[i-1], "*");
                        previousFileLength = currentFileLength;
                    }
                }
            }
        } else {
            console.error('Error reading the file:', result.error);
        }
    });
    
}

setInterval(() => {
    readAndSendLines()
  }, 1000);





iframe.onload = () => {
    readAndSendLines()
};


window.addEventListener("message", (event) => {
    if (event.data==="_start_")
    {
        iframe.contentWindow.postMessage("Loading...\n", "*");
        const receivedmsg = event.data;
        const res=exe.runExe({
            receivedmsg
        })
    }else{
        const receivedmsg = event.data;
        const res=language.createNoteLanguages({
            receivedmsg
        })
    }
});