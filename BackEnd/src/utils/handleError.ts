const fs = require('fs');
const path = require('path');
const date = new Date();
export default async function reportError(error:any, errorAt:string){
    
    // lưu lỗi vào log
    const logFilePath = path.join(__dirname, 'log', `Errorlog.txt`);
    const logEntry = `
==============================
🕒 Time: ${date}
📍 Location: ${errorAt}
🔸 Name: ${error.name}
🔹 Message: ${error.message}
📄 Stacks: ${error.stack}
==============================
`;
fs.appendFileSync(logFilePath, logEntry, 'utf8');
console.log("Đã Lưu Lỗi Vào Log")
}