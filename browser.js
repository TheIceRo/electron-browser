const remote = require('electron').remote;
var fs = require("fs");
var maximized = false;
var urlExists = require('url-exists');

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
    document.getElementById("search-field").addEventListener("keydown",function(event){
        if(event.keyCode==13){
            var searchTerm = document.getElementById("search-field").value;
            search(searchTerm);
        }
    });
    document.getElementById("search-button").addEventListener("click",function(event){
        var searchTerm = document.getElementById("search-field").value;
        search(searchTerm);
    });
}
function search(search){
    checkPage(correctTerms(search));
}
function correctTerms(text){    
    if(text.includes("https://")||text.includes("http://")){
        return(text);   
    }
    else{
        return("http://"+text);
    }
}
function loadPage(page){
    document.getElementById("browser").setAttribute("src",page);
}
function checkPage(page){
    urlExists(page, function(err, exists) {
        if(exists)
        loadPage(page);
    });
}
function start(){
    loadListeners();
}
document.addEventListener("DOMContentLoaded",function(){
    start();
})