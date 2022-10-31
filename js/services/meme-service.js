'use strict'
const SAVED_MEMES = 'memesDB'
var gRandomStrings = [
    'I’m jealous of my parents, I’ll never have a kid as cool as them',
    'Do people talk about you behind your back? Simply fart',
    'I’m never late. The others are just too early!',
    'Doing nothing is hard, you never know when you’re done',
    'Don’t drink while driving – you might spill the beer.',
    '“Stressed” is just “desserts” spelled backwards',
    'Stupidity knows no boundaries, but it knows a lot of people.',
    'Television is a medium – anything well done is rare.'
]
var gSavedMemes
var gEmojis = `😃😄😁😆😅😂🤣🥲😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓😎🥸🤩🥳😏😒😞😔😟😕🙁`
var gKeywordSearchCountMap = {}
var gFilterBy = ''
var gImgs = [
    { id: 1, url: 'css/imgs/1.jpg', keywords: ['donald', 'trump', 'president'] },
    { id: 2, url: 'css/imgs/2.jpg', keywords: ['dog', 'puppies'] },
    { id: 3, url: 'css/imgs/3.jpg', keywords: ['dog', 'baby', 'sleep'] },
    { id: 4, url: 'css/imgs/4.jpg', keywords: ['cat', 'keyboard'] },
    { id: 5, url: 'css/imgs/5.jpg', keywords: ['baby', 'angry'] },
    { id: 6, url: 'css/imgs/6.jpg', keywords: ['funny', 'cat'] },
    { id: 7, url: 'css/imgs/7.jpg', keywords: ['baby', 'funny'] },
    { id: 8, url: 'css/imgs/8.jpg', keywords: ['funny', 'clown'] },
    { id: 9, url: 'css/imgs/9.jpg', keywords: ['baby', 'grass'] },
    { id: 10, url: 'css/imgs/10.jpg', keywords: ['obama', 'president'] },
    { id: 11, url: 'css/imgs/11.jpg', keywords: ['funny', 'kiss'] },
    { id: 12, url: 'css/imgs/12.jpg', keywords: ['old', 'tv'] },
    { id: 13, url: 'css/imgs/13.jpg', keywords: ['hollywood', 'tv', 'actor'] },
    { id: 14, url: 'css/imgs/14.jpg', keywords: ['hollywood', 'tv', 'actor'] },
    { id: 15, url: 'css/imgs/15.jpg', keywords: ['tv', 'actor'] },
    { id: 16, url: 'css/imgs/16.jpg', keywords: ['movie', 'funny', 'actor'] },
    { id: 17, url: 'css/imgs/17.jpg', keywords: ['president', 'putin', 'russia'] },
    { id: 18, url: 'css/imgs/18.jpg', keywords: ['funny', 'movie', 'kids'] },
];

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Text here',
            font: 'Impact',
            size: 20,
            color: 'black',
            bgColor: 'white',
            pos: { x: 10, y: 50 },
            isDrag: false
        }
    ]
}

function addLine(str) {
    gMeme.lines.push({
        txt: str || 'TEXT',
        font: 'Impact',
        size: 20,
        color: 'black',
        bgColor: 'white',
        pos: { x: 10, y: 50 },
        isDrag: false
    })
}
function setLineText(text, idx) {
    gMeme.lines[idx].txt = text
}
function setLineColor(color, idx) {
    gMeme.lines[idx].color = color
}
function setLineBgColor(bgColor, idx) {
    gMeme.lines[idx].bgColor = bgColor
}
function setLineSize(diff, idx) {
    gMeme.lines[idx].size += diff

}
function setTextAlign(alignment, idx) {
    let currLine = gMeme.lines[idx]
    switch (alignment) {
        case 'left': currLine.pos.x = 10; break;
        case 'right': currLine.pos.x = gElCanvas.width - gCtx.measureText(currLine.txt).width - 10; break;
        case 'center': currLine.pos.x = gElCanvas.width / 2 - gCtx.measureText(currLine.txt).width / 2; break;
    }
    gStartPos = currLine.pos
}
function moveLine(diff, idx) {
    let currPosY = gMeme.lines[idx].pos.y
    if (currPosY + diff < 25 || currPosY + diff > gElCanvas.height - 25) return
    gMeme.lines[idx].pos.y += diff
}
function deleteLine(idx) {
    gMeme.lines.splice(idx, 1)
}
function setLineFont(value, idx) {
    gMeme.lines[idx].font = value
}


function setImg(imgId) {
    gMeme.selectedImgId = imgId
}
function getMeme() {
    return gMeme
}
function getRandomString() {
    return gRandomStrings[getRandomIntInclusive(0, gRandomStrings.length - 1)]
}
function getImgs() {
    var imgs = gImgs.filter(img => filterKeyWords(img.keywords))
    return imgs
}
function filterKeyWords(keywords) {
    return keywords.some(keyword => keyword.toLowerCase().includes(gFilterBy.toLowerCase()))
}

// Emojies
function getEmojies() {
    return gEmojis.split(/(?:)/u)
}
// Service Move Funcs
function isItemClicked(clickedPos) {
    const memeLines = gMeme.lines

    let clickedItem = memeLines.find(({ txt, pos, size }) => {
        const distance = Math.sqrt((pos.x - clickedPos.x) ** 2)
        const distanceY = Math.sqrt((pos.y - clickedPos.y) ** 2)
        gCtx.font = ` ${size}px`
        gCtx.font ='40px'

        return distance + pos.x >= pos.x && distance <= ((gCtx.measureText(txt).width)*(size/20)) && distanceY + pos.y >= pos.y && distanceY + pos.y <= pos.y + size
    })
    if (clickedItem) return { clickedItem, isClicked: true }
    return false
}
function setItemDrag(isDrag, clickedItem) {
    clickedItem.isDrag = isDrag
}
function getItemDrag() {
    var line = gMeme.lines.find((line) => {
        return line.isDrag === true
    })

    return line
}
function moveClickedItem(dx, dy, clickedItem) {
    // console.log('clickedItem',clickedItem)
    clickedItem.pos.y += dy
    clickedItem.pos.x += dx

}

//Save func
function saveMeme(imgContent) {
    gSavedMemes=loadFromStorage(SAVED_MEMES)

    if((!gSavedMemes)||(!gSavedMemes[0])) gSavedMemes=[]
    gMeme['data-url'] = imgContent

    gSavedMemes.push(gMeme)

    saveToStorage(SAVED_MEMES, gSavedMemes)
}
function setGMeme(meme){
    gMeme = meme
}
//Upload funcs
function uploadImg() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg")

    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        console.log(encodedUploadedImgUrl)
        document.querySelector('.share-modal').innerHTML += `<button class="close-btn" onclick="onCloseModal()">X</button>`
        document.querySelector('.user-msg').innerText = `Your photo is available here: ${uploadedImgUrl}`
        document.querySelector('.share-container').innerHTML = `
          <a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
             Share in facebook  
          </a>`
        document.querySelector('.share-modal').style.transform = 'translateX(50%) translateY(0)'
    }
    doUploadImg(imgDataUrl, onSuccess)
}
function doUploadImg(imgDataUrl, onSuccess) {
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}





//gallery funcs
function createKeyWordsMap() {
    const imgs = gImgs
    imgs.forEach(({ keywords }) => {
        keywords.forEach(keyword => {
            // if (gKeywordSearchCountMap[keyword]) gKeywordSearchCountMap[keyword]++
            // else gKeywordSearchCountMap[keyword] = 1
            gKeywordSearchCountMap[keyword] = 0
        })
    })
}
function getKeyWordsMap() {
    return gKeywordSearchCountMap
}
function filterBy(text) {
    gFilterBy = text
}
function updateKeywordsSearchCountMap(keyword) {
    gKeywordSearchCountMap[keyword]++
}