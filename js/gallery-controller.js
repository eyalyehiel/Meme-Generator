'use strict'


function renderGallery() {
    const imgs = getImgs()
    const strHtmls = imgs.map(({ id, url }) => {
        return `<img onclick="onImgSelect(this)" data-id="${id}" src="${url}">`
    }).join('')
    document.querySelector('.gallery-list').innerHTML = strHtmls
}
function changeDisplay(to) {
    switch (to) {
        case 'gallery':
            document.querySelector('.gallery').classList.remove('hide')
            document.querySelector('.meme-generator').classList.add('hide')
            document.querySelector('.saved-memes').classList.add('hide')
            document.querySelector('.gallery-link').classList.add('active')
            document.querySelector('.memes-link').classList.remove('active')
            break;
            case 'memes':
                document.querySelector('.gallery').classList.add('hide')
                document.querySelector('.meme-generator').classList.add('hide')
                document.querySelector('.saved-memes').classList.remove('hide')
                document.querySelector('.gallery-link').classList.remove('active')
                document.querySelector('.memes-link').classList.add('active')
            break;
    }
}
function renderFilters() {
    const keyWords = getKeyWordsMap()
    let keys = []
    let strHtmls = ''
    for (const key in keyWords) {
        keys.push(key)
    }
    var idx = 0;
    strHtmls = keys.map(key => {
        if(idx === 5) return
        idx++
        return `<a href="#" class="gallery-links ${key}" onclick="onFilterBy(this,event)">${key}</a>`
    }).join(' ')
    document.querySelector('.common-words').innerHTML = strHtmls
    strHtmls = ''
    strHtmls = keys.map(key => {
        return `<option>${key}</option>`
    }).join('')
    document.querySelector('.filters').innerHTML = strHtmls
}
function onFilterBy(elSearch, ev) {
    if (ev.type === 'click') {
        filterBy(elSearch.innerText)
        document.querySelector('.search').value = elSearch.innerText
        updateKeywordsSearchCountMap(elSearch.innerText)
        renderKeywords()
    }
    else {
        filterBy(elSearch.value)
    }
    renderGallery()
}

function renderKeywords(){
    let keywords = getKeyWordsMap()
    console.log(keywords);
    for (const key in keywords) {
        if(keywords[key] === 0) return
        // document.querySelector(`.${key}`).style.fontSize = '50px'
        console.log(document.querySelector(`.${key}`));
    }
}