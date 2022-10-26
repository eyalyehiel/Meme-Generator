'use strict'

function renderGallery() {
    var strHtmls = ''
    for (var i = 1; i < 18; i++) {
        strHtmls += `<img onclick="onImgSelect(this)" data-id="${i}" src="css/imgs/${i}.jpg">`
    }
    document.querySelector('.gallery').innerHTML = strHtmls
}

function changeDisplay(to){
    switch(to){
        case 'gallery':
            document.querySelector('.gallery').classList.remove('hide')
            document.querySelector('.meme-generator').classList.add('hide')
            break;
            case 'memes':
            document.querySelector('.gallery').classList.add('hide')
            document.querySelector('.meme-generator').classList.add('hide')
            break;
    }
}