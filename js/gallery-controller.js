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
function renderFilters(){
    const keyWords = getKeyWordsMap()
    let keys = []
    let strHtmls = ''
    for (const key in keyWords) {
        keys.push(key)
    }
    strHtmls = keys.map(key => {
        return `<a href="#" onclick="onFilterBy()">${key}</a>`
    }).join(' ')
    document.querySelector('.common-words').innerHTML = strHtmls
    strHtmls=''
    
    strHtmls = keys.map(key => {
        return `<option>${key}</option>`
    }).join('')
    document.querySelector('.filters').innerHTML = strHtmls
}
function onFilterBy(elSearch){
    console.log(elSearch.value);
    filterBy(elSearch.value)
    renderGallery()
}