const {BrowserWindow} = require("electron").remote;
const remote = require('electron').remote;
const nativeImage = require('electron').nativeImage; 
let image = nativeImage.createEmpty(); 
const shell = require('electron').shell;
var fs = require("fs");
var urlExists = require('url-exists');
const url = require('url');
const path = require('path');
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
    if(text.includes("file:///")){
        return(text);
    }    
    if(text.includes("C:/")){
        return("file:///"+text);
    }
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
    if(page.includes("file:///")){
        loadPage(page);
    }
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
function closeWindow(){
    var window = remote.getCurrentWindow();
    window.close();
}
function minimizeWindow(){
    var window = remote.getCurrentWindow();
    window.minimize();
}
function toggleMaximizeWindow(){
    var window = remote.getCurrentWindow();
    if(window.isMaximized()){
        window.restore();
    }
    else{
        window.maximize();
    }
}
function loadListeners(){
    document.getElementById("close").addEventListener("click",function(){
        closeWindow();
    });
    document.getElementById("minimize").addEventListener("click",function(){
        minimizeWindow();
    });
    document.getElementById("maximize").addEventListener("click",function(){
        toggleMaximizeWindow();
    });
    searchBar.addEventListener("keydown",function(event){
        if(event.keyCode==13){
            search(searchBar.value);
        }
    });
    document.getElementById("search-button").addEventListener("click",function(event){
        search(searchBar.value);
    });
    document.getElementById("options-button").addEventListener("click",function(event){
        setToggle("options-panel");
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
function newWindow(){
    let win = new BrowserWindow({width:1200,height:720,frame:false,resizable:true,backgroundColor:"#404552",icon:image});
    win.on('close', ()=>{win=null});
    win.loadURL(url.format({
        pathname: path.join(__dirname,"index.html"),
        protocol: 'file',
        slashes:true
    }));
    win.show();
}
function inspectWebview(){
    webview.openDevTools();
}
function openExt(page){
    shell.openExternal(page);
}
function newTab(){
    var tab = document.getElementsByClassName("tab")[0];
    var tabContainer = document.getElementsByClassName("tab-container")[0];
    var tab_clone = tab.cloneNode(true);
    let browser = document.getElementsByClassName("browser")[0].cloneNode(true);
    document.getElementsByTagName("body").appendChild(browser);
    tab_clone.addEventListener("click",function(event){
        disableWebviews();
        browser.classList.remove("hidden");
    });
    tabContainer.appendChild(tab_clone);
}
function disableWebviews(){
    let browser = document.getElementsByClassName("browser");
    for(var i;i<browser.length;i++){
        if(!browser.classList.contains("hidden"))
        browser[i].classList.add("hidden");
    }
}
function setToggle(menu){
    option = document.getElementsByClassName(menu)[0];
    if(option.classList.contains("toggle")){
        option.classList.remove("toggle");
    }
    else{
        option.classList.add("toggle");
    }
}
function toggleOn(menu){
    option = document.getElementsByClassName(menu)[0];
    if(!option.classList.contains("toggle"))
        option.classList.add("toggle");
}
function toggleOff(menu){
    option = document.getElementsByClassName(menu)[0];
    if(option.classList.contains("toggle"))
        option.classList.remove("toggle");
}
function addWebviewListeners(wview){
    wview.addEventListener("did-start-loading",function(){
        document.getElementsByClassName("tab-title")[1].innerHTML = "Loading...";
    });
    wview.addEventListener("dom-ready",function(){
        document.getElementsByClassName("tab-title")[1].innerHTML = snipTitle(wview.getTitle());
        searchBar.value = wview.getURL();
    });
    wview.addEventListener("did-stop-loading",function(){
        document.getElementsByClassName("tab-title")[1].innerHTML = snipTitle(wview.getTitle());
        searchBar.value = wview.getURL();
    });
    wview.addEventListener('new-window', (e) => {
        openNewWindow(e.url);
    });
}
function openNewWindow(link){
    const protocol = require('url').parse(e.url).protocol;
    if (protocol === 'http:' || protocol === 'https:') 
    {
        let win = new BrowserWindow({width:900,height:720,frame:true,resizable:true,backgroundColor:"#383c4a",icon:image});
        win.setMenuBarVisibility(false);
        win.on('close', ()=>{win=null});
        win.loadURL(link);
        win.show();
    }
}

function start(){
    webview = document.getElementsByClassName("browser")[1];
    searchBar = document.getElementById("search-field");
    loadListeners();
    addWebviewListeners(webview);
}
document.addEventListener("DOMContentLoaded",function(){
    start();
})