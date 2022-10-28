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
    renderEmojies()
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
function onSetLineFont(elSelect){
    console.log(elSelect);
    setLineFont(elSelect,gFocusedLineIdx)
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
        lines.forEach(({ txt, color, size, bgColor, pos, font }) => {
            drawText(txt, color, size, bgColor,pos,font)
        });
    }
}
function drawText(txt, color, size, bgColor, pos,font) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = color
    gCtx.fillStyle = bgColor

    gCtx.font = `${size}px ${font}`
    gCtx.fillText(txt, pos.x, pos.y)
    gCtx.strokeText(txt, pos.x, pos.y)
}
// Canvas
function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-place')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetWidth
    renderMeme()
}
// Emojies
function renderEmojies() {
    let emojisDisplay = document.querySelector('.emojies-display')
    var emojies =getEmojies()
    let strHtmls = ''
    for (var i = emojiIdx; i < emojiIdx + 3; i++) {
        strHtmls += `<button class="emoji-preview" onclick="onSetEmoji(this)">${emojies[i]}</button>`
    }
    emojisDisplay.innerHTML = strHtmls
}
function onRenderEms(diff) {
    emojiIdx += diff
    renderEmojies()
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
    const pos = getEvPos(ev)
    const { clickedItem, isClicked } = isItemClicked(pos)
    if (!isClicked) return

    gFocusedLineIdx = gMeme.lines.findIndex(line => line === clickedItem)
    document.querySelector('.text').value = gMeme.lines[gFocusedLineIdx].txt

    setItemDrag(true, clickedItem)
    gStartPos = pos
    document.querySelector('.canvas-place').style.cursor = 'grabbing'

}
function onMove(ev) {
    const clickedItem = getItemDrag()

    if (!clickedItem) return
    if (!clickedItem.isDrag) return

    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y

    moveClickedItem(dx, dy, clickedItem)
    gStartPos = pos
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
// Modal
function onCloseModal(){
    document.querySelector('.share-modal').style.transform = 'translateX(50%) translateY(-100%)'
}