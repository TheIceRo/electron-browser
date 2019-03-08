const remote = require('electron').remote;
var fs = require("fs");
var maximized = false;
var urlExists = require('url-exists');
var webview;
var searchBar;
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



function loadListeners(){
    var window = remote.getCurrentWindow();
    document.getElementById("close").addEventListener("click",function(){
        window.close()
    });
    document.getElementById("minimize").addEventListener("click",function(){
        window.minimize();
    });
    document.getElementById("maximize").addEventListener("click",function(){
        if(maximized){
            window.restore();
            maximized = false;
        }
        else{
            maximized = true;
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
    document.getElementById("nav-back").addEventListener("click",function(event){
        if(webview.canGoBack())
        webview.goBack();
    });
    document.getElementById("nav-forward").addEventListener("click",function(event){
        if(webview.canGoForward())
        webview.goForward();
    });
    webview.addEventListener("did-stop-loading",function(){
        document.getElementsByClassName("tab")[0].innerHTML = webview.getTitle();
        searchBar.value = webview.getURL();
    });
}

function start(){
    webview = document.getElementById("browser");
    searchBar = document.getElementById("search-field");
    loadListeners();
}
document.addEventListener("DOMContentLoaded",function(){
    start();
})