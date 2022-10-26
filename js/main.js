'use strict'

function onInit() {

    renderGallery()

}

function renderGallery(){
    var strHtmls = ''
    for (var i = 1; i < 18; i++) {
        strHtmls += `<img src="imgs/${i}.jpg">`
    }
    document.querySelector('.gallery').innerHTML = strHtmls
}