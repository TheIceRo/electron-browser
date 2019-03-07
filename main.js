const electron = require('electron');
const url = require('url');
const path = require('path');

const {app,BrowserWindow,Menu,IncomingMessage} = electron;

let window;

// Listen for app ready
app.on("ready",function(){

    window = new BrowserWindow({width:1280,height:720,minHeight:650,minWidth:500,frame:false,title:"Loading...",resizable:true,backgroundColor:"#404552"})
    window.loadURL(url.format({
        pathname: path.join(__dirname,"index.html"),
        protocol: 'file',
        slashes:true
    }));
});
