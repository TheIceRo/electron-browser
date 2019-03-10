const {BrowserWindow} = require("electron").remote;
const remote = require('electron').remote;
const nativeImage = require('electron').nativeImage; 
let image = nativeImage.createEmpty(); 
var fs = require("fs");
var urlExists = require('url-exists');
var webview;
var searchBar;
var currTab = 0;




var page = {
    "link":"google.com",

}
var userPrefs = {
    "homepage":"https://google.com",
}

function correctTerms(text){    
    if(text.includes("https://")||text.includes("http://")){
        return(text);   
    }
    if(text.includes(".")){
        return("http://"+text);
    }
    else{
        return("https://google.com/search?q="+text.replace(/ /g, "+"))
    }
}
function checkPage(page){
    urlExists(page, function(err, exists) {
        if(exists)
        loadPage(page);
    });
}
function loadPage(page){
    webview.setAttribute("src",page);
}
function search(search){
    checkPage(correctTerms(search));
}
function snipTitle(text){
    if(text.length > 20){
        return text.substring(0,20)+"...";
    }
    return text;
}


function loadListeners(){
    var window = remote.getCurrentWindow();
    document.getElementById("close").addEventListener("click",function(){
        window.close()
    });
    document.getElementById("minimize").addEventListener("click",function(){
        window.minimize();
    });
    document.getElementById("maximize").addEventListener("click",function(){
        if(window.isMaximized()){
            window.restore();
        }
        else{
            window.maximize();
        }
    });
    searchBar.addEventListener("keydown",function(event){
        if(event.keyCode==13){
            search(searchBar.value);
        }
    });
    document.getElementById("search-button").addEventListener("click",function(event){
        search(searchBar.value);
    });
    document.getElementById("home-button").addEventListener("click",function(event){
        search(userPrefs.homepage);
    });
    document.getElementById("refresh-button").addEventListener("click",function(event){
        webview.reload();
    });
    document.getElementById("nav-back").addEventListener("click",function(event){
        if(webview.canGoBack())
        webview.goBack();
    });
    document.getElementById("nav-forward").addEventListener("click",function(event){
        if(webview.canGoForward())
        webview.goForward();
    });
}
function addWebviewListeners(wview){
    wview.addEventListener("did-start-loading",function(){
        document.getElementsByClassName("tab")[currTab].innerHTML = "Loading...";
    });
    wview.addEventListener("dom-ready",function(){
        document.getElementsByClassName("tab")[currTab].innerHTML = snipTitle(wview.getTitle());
        searchBar.value = wview.getURL();
    });
    wview.addEventListener("did-stop-loading",function(){
        document.getElementsByClassName("tab")[currTab].innerHTML = snipTitle(wview.getTitle());
        searchBar.value = wview.getURL();
    });
    wview.addEventListener('new-window', (e) => {
        const protocol = require('url').parse(e.url).protocol;
        if (protocol === 'http:' || protocol === 'https:') 
        {
            let win = new BrowserWindow({width:900,height:720,frame:true,resizable:true,backgroundColor:"#383c4a",icon:image});
            win.setMenuBarVisibility(false);
            win.on('close', ()=>{win=null});
            win.loadURL(e.url);
            win.show();
        }
    })
}

function start(){
    webview = document.getElementsByClassName("browser")[0];
    searchBar = document.getElementById("search-field");
    loadListeners();
    addWebviewListeners(webview);
}
document.addEventListener("DOMContentLoaded",function(){
    start();
})