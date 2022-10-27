'use strict'

function renderGallery() {
    const imgs = getImgs()
    const strHtmls = imgs.map(({id,url}) => {
        return `<img onclick="onImgSelect(this)" data-id="${id}" src="${url}">`
    }).join('')
    document.querySelector('.gallery-list').innerHTML = strHtmls
}

function changeDisplay(to){
    switch(to){
        case 'gallery':
            document.querySelector('.gallery').classList.remove('hide')
            document.querySelector('.meme-generator').classList.add('hide')
            document.querySelector('.saved-memes').classList.add('hide')
            break;
            case 'memes':
            document.querySelector('.gallery').classList.add('hide')
            document.querySelector('.meme-generator').classList.add('hide')
            document.querySelector('.saved-memes').classList.remove('hide')
            break;
    }
}