'use strict'

function renderGallery() {
    var strHtmls = ''
    for (var i = 1; i < 18; i++) {
        strHtmls += `<img onclick="onImgSelect(this)" data-id="${i}" src="imgs/${i}.jpg">`
    }
    document.querySelector('.gallery').innerHTML = strHtmls
}