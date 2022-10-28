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
var gSavedMemes = []

var gKeywordSearchCountMap = {}
// { 'funny': 12, 'cat': 16, 'baby': 2 }
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
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red',
            bgColor: 'red',
            pos: { x: 10, y: 50 },
            isDrag: false
        }
    ]
}

function addLine(str) {
    gMeme.lines.push({
        txt: str || 'TEXT',
        size: 20,
        color: 'red',
        bgColor: 'red',
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
    switch(alignment){
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
    const keyWords = gKeywordSearchCountMap
    let keys = []
    for (const key in keyWords) {
        keys.push(key)
    }
    keys = keys.filter(key => key.toLowerCase().includes(gFilterBy.toLowerCase()))
    if(gFilterBy === '') return gImgs

    var imgs = gImgs.filter(img=> img.keywords.includes(keys[0]))

    return imgs
}

// Emojies Api Request
function getEmojies(cb) {
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState === XMLHttpRequest.DONE && XHR.status === 200) {
            var res = JSON.parse(XHR.responseText)
            cb(res)
        }
    }

    XHR.open('GET', 'https://emoji-api.com/emojis?access_key=b4b7a789646e16e7dce1e4dac3102e7c0f1aade6')
    XHR.send()
}
// Service Move Funcs
function isItemClicked(clickedPos) {
    const memeLines = gMeme.lines

    let clickedItem = memeLines.find(({ txt, pos, size }) => {
        const distance = Math.sqrt((pos.x - clickedPos.x) ** 2)
        const distanceY = Math.sqrt((pos.y - clickedPos.y) ** 2)

        return distance + pos.x >= pos.x && distance <= gCtx.measureText(txt).width && distanceY + pos.y >= pos.y && distanceY + pos.y <= pos.y + size

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
    let img = new Image()
    img.src = imgContent

    gSavedMemes.push(gMeme)

    saveToStorage(SAVED_MEMES, gSavedMemes)
}

//gallery funcs
function createKeyWordsMap() {
    const imgs = gImgs
    imgs.forEach(({ keywords }) => {
        keywords.forEach(keyword => {
            if (gKeywordSearchCountMap[keyword]) gKeywordSearchCountMap[keyword]++
            else gKeywordSearchCountMap[keyword] = 1
        })
    })
    console.log(gKeywordSearchCountMap);
}
function getKeyWordsMap() {
    return gKeywordSearchCountMap
}
function filterBy(text) {
    gFilterBy = text
}