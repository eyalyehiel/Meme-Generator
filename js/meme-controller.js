'use strict'

let gElCanvas
let gCtx
let gFocusedLineIdx = 0
let emojiIdx = 0
let gStartPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

function onInit() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')
    createKeyWordsMap()
    // getEmojies(renderEmojies)
    renderFilters()
    renderGallery()
    addEventListeners()
    window.addEventListener('resize', resizeCanvas)
}

function onImgSelect(elImg) {
    document.querySelector('.gallery').classList.add('hide')
    document.querySelector('.saved-memes').classList.add('hide')
    document.querySelector('.meme-generator').classList.remove('hide')

    const imgId = elImg.getAttribute('data-id')
    setImg(imgId)


    resizeCanvas()
    renderMeme()
    onSetLineFocus()
}
function onRenderRandomMeme() {
    document.querySelector('.gallery').classList.add('hide')
    document.querySelector('.meme-generator').classList.remove('hide')
    const imgId = getRandomIntInclusive(1, gImgs.length)
    setImg(imgId)

    const linesLength = getRandomIntInclusive(1, 2)
    getMeme().lines = []
    for (var i = 0; i < linesLength; i++) {
        var str = getRandomString()
        addLine(str)
        setLineColor(randomColor(), i)
        setLineBgColor(randomColor(), i)
        setLineSize(getRandomIntInclusive(3, 18), i)
    }

    resizeCanvas()
    renderMeme()
    onSetLineFocus()
}
// Meme manipultaions
function onSetLineText() {
    const text = document.querySelector('.text').value
    setLineText(text, gFocusedLineIdx)
    renderMeme()
}
function onSetLineColor() {
    const textColor = document.querySelector('.textColor').value
    setLineColor(textColor, gFocusedLineIdx)
    renderMeme()
}
function onSetLineBgColor() {
    const textBgColor = document.querySelector('.textBgColor').value
    setLineBgColor(textBgColor, gFocusedLineIdx)
    renderMeme()
}
function onSetLineSize(diff) {
    setLineSize(+diff, gFocusedLineIdx)
    renderMeme()
}
function onAddLine() {
    addLine()
    onSetLineFocus()
    renderMeme()
}
function onSetLineFocus() {
    const memeLines = getMeme().lines
    const linesMap = memeLines.length
    gFocusedLineIdx++
    if (gFocusedLineIdx === linesMap) gFocusedLineIdx = 0
    document.querySelector('.text').value = memeLines[gFocusedLineIdx].txt
}
function onSetTextAlign(alignment) {
    setTextAlign(alignment, gFocusedLineIdx)
    renderMeme()
}
function onMoveLine(diff) {
    moveLine(+diff, gFocusedLineIdx)
    renderMeme()
}
function onSetEmoji(elEmoji) {
    addLine(elEmoji.innerText)
    renderMeme()
}
function onDeleteLine() {
    deleteLine(gFocusedLineIdx)
    const linesLength = getMeme().lines.length
    if (linesLength === 0) {
        renderMeme()
        return
    }
    onSetLineFocus()
    renderMeme()
}
// Render Funcs
function renderMeme() {
    const { selectedImgId, lines } = getMeme()

    drawImg(selectedImgId, lines)
}
function drawImg(selectedImgId, lines) {
    const img = new Image()
    img.src = `css/imgs/${selectedImgId}.jpg`
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        lines.forEach(({ txt, color, size, bgColor, pos, align }) => {
            // switch (align) {
            //     case 'left':
            //         // pos.x = 10;
            //         drawText(txt, color, size, bgColor, pos);
            //         break;
            //     case 'center':
            //         // pos.x = gElCanvas.width / 2 - gCtx.measureText(txt).width / 2;
            //         drawText(txt, color, size, bgColor, pos);
            //         break;
            //     case 'right':
            //         // pos.x = gElCanvas.width - gCtx.measureText(txt).width - 10;
            //         drawText(txt, color, size, bgColor, pos);
            //         break;
            // }
            drawText(txt, color, size, bgColor,pos)
        });
    }
}
function drawText(txt, color, size, bgColor, pos) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = color
    gCtx.fillStyle = bgColor

    gCtx.font = `${size}px Arial`
    gCtx.fillText(txt, pos.x, pos.y)
    gCtx.strokeText(txt, pos.x, pos.y)
}
// Canvas
function resizeCanvas(ev) {
    const elContainer = document.querySelector('.canvas-place')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetWidth
    renderMeme()
}
// Emijies
function renderEmojies(res) {
    let strHtmls = ''
    for (var i = emojiIdx; i < emojiIdx + 3; i++) {
        strHtmls += `<div class="emoji-preview" onclick="onSetEmoji(this)">${res[i].character}</div>`
    }
    document.querySelector('.emojies-display').innerHTML = strHtmls
}
function onRenderEms(diff) {
    emojiIdx += diff
    getEmojies(renderEmojies)
}
//Drag and Drop
function getEvPos(ev) {

    //Gets the offset pos , the default pos
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (TOUCH_EVS.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault()
        //Gets the first touch point
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        pos = {
          x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
          y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
      }
    return pos
}
//Move Funcs
function onDown(ev) {

    //Get the ev pos from mouse or touch
    const pos = getEvPos(ev)
    const { clickedItem, isClicked } = isItemClicked(pos)
    // console.log(isClicked);
    if (!isClicked) return
    setItemDrag(true, clickedItem)
    //Save the pos we start from 
    gStartPos = pos
    document.querySelector('.canvas-place').style.cursor = 'grabbing'

}
function onMove(ev) {
    const clickedItem = getItemDrag()
    // console.log(clickedItem);
    if (!clickedItem) return
    if (!clickedItem.isDrag) return
    const pos = getEvPos(ev)
    //Calc the delta , the diff we moved
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveClickedItem(dx, dy, clickedItem)
    //Save the last pos , we remember where we`ve been and move accordingly
    gStartPos = pos
    //The canvas is render again after every move
    renderMeme()

}
function onUp() {

    const clickedItem = getItemDrag()
    if (!clickedItem) return
    setItemDrag(false, clickedItem)
    document.querySelector('.canvas-place').style.cursor = 'pointer'
}
function addEventListeners() {
    //Mouse events
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
    //Touch events
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}
//Save / Download / Share
function onSaveMeme() {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    saveMeme(imgContent)
}
function downloadMeme(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}
