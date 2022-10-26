'use strict'

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }];

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            align: 'left',
            color: 'red',
            bgColor: 'red',
            pos: { x: 10, y: 50 },
            isDrag: false
        }
    ]
}

function addLine(emoji) {
    gMeme.lines.push({
        txt: emoji || 'TEXT',
        size: 20,
        align: 'left',
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
function setLineBgColor(bgColor,idx){
    gMeme.lines[idx].bgColor = bgColor
}
function setLineSize(diff, idx) {
    gMeme.lines[idx].size += diff

}
function setTextAlign(alignment, idx) {
    gMeme.lines[idx].align = alignment
}
function moveLine(diff, idx) {
    let currPosY = gMeme.lines[idx].pos.y
    if (currPosY + diff < 25 || currPosY + diff > gElCanvas.height - 25) return
    gMeme.lines[idx].pos.y += diff
}
function deleteLine(idx){
    gMeme.lines.splice(idx,1)
}


function setImg(imgId) {
    gMeme.selectedImgId = imgId
}
function getMeme() {
    return gMeme
}


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


function isItemClicked(clickedPos) {
    const memeLines = gMeme.lines

    let clickedItem = memeLines.find(({ txt, pos, size }) => {
        const distance = Math.sqrt((pos.x - clickedPos.x) ** 2)
        const distanceY = Math.sqrt((pos.y - clickedPos.y) ** 2)

        return distance + pos.x >= pos.x && distance + pos.x <= gCtx.measureText(txt).width && distanceY + pos.y >= pos.y && distanceY + pos.y <= pos.y + size

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

    clickedItem.pos.y += dy
    clickedItem.pos.x += dx

}
