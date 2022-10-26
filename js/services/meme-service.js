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
            color: 'red'
        }
    ]
}
function addLine(){
    gMeme.lines.push({
        txt: 'TEXT',
        size: 20,
        align: 'left',
        color: 'red'
    })
}

function setLineText(text,idx){
    gMeme.lines[idx].txt = text
}
function setLineColor(color,idx){
    gMeme.lines[idx].color = color
}
function setLineSize(diff,idx){
    gMeme.lines[idx].size += diff

}
function setTextAlign(alignment,idx){
    gMeme.lines[idx].align =alignment
}
function moveLine(diff,idx){
    
}


function setImg(imgId){
    gMeme.selectedImgId = imgId
}

function getMeme(){
    return gMeme
}


function getEmojies(cb) {
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState === XMLHttpRequest.DONE && XHR.status === 200) {
            var res = JSON.parse(XHR.responseText)
            res = prepareData(res)
            cb(res)
        }
    }

    XHR.open('GET', 'https://api.mojilala.com/v1/stickers/search?q=cat&api_key=dc6zaTOxFJmzC ')
    XHR.send()
}

function prepareData(res){
    var data = res.data
    console.log(data);
    data = data.map(sticker => {
        if(!sticker.images.fixed_height.apng) return
        return sticker.images.fixed_height.apng
    })
    return data
}