'use strict'

let gElCanvas
let gCtx
let gFocusedLineIdx = 0
let emojiIdx = 0
let gStartPos

function onInit() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')

    renderGallery()
    addMouseListeners()
    window.addEventListener('resize', resizeCanvas)

}

function onImgSelect(elImg) {
    document.querySelector('.gallery').classList.add('hide')
    document.querySelector('.meme-generator').classList.remove('hide')

    const imgId = elImg.getAttribute('data-id')
    setImg(imgId)

    getEmojies(renderEmojies)
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
function onSetLineSize(diff) {
    setLineSize(+diff, gFocusedLineIdx)
    renderMeme()
}
function onAddLine() {
    addLine()
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



// Render Funcs
function renderMeme() {
    const { selectedImgId, lines } = getMeme()

    drawImg(selectedImgId, lines)
}
function drawImg(selectedImgId, lines) {
    const img = new Image()
    img.src = `imgs/${selectedImgId}.jpg`
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        lines.forEach(({ txt, color, size, align, pos }) => {
            switch (align) {
                case 'left':
                    pos.x = 10;
                    drawText(txt, color, size, pos);
                    break;
                case 'center':
                    pos.x = gElCanvas.width / 2 - gCtx.measureText(txt).width / 2;
                    drawText(txt, color, size, pos);
                    break;
                case 'right':
                    pos.x = gElCanvas.width - gCtx.measureText(txt).width - 10;
                    drawText(txt, color, size, pos);
                    break;
            }
        });
    }
}
function drawText(txt, color, size, pos) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'brown'
    gCtx.fillStyle = color

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
    return pos
}

//Move Funcs
function onDown(ev) {
    console.log('Im from onDown')
    //Get the ev pos from mouse or touch
    const pos = getEvPos(ev)
    const {clickedItem, isClicked} = isItemClicked(pos)
    if (!isClicked) return
    setItemDrag(true,clickedItem)
    //Save the pos we start from 
    gStartPos = pos
    document.body.style.cursor = 'grabbing'

}

function onMove(ev) {
    console.log('Im from onMove')
    const clickedItem = getItemDrag()
    if (!clickedItem) return
    if(!clickedItem.isDrag) return
    const pos = getEvPos(ev)
    //Calc the delta , the diff we moved
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveClickedItem(dx, dy,clickedItem)
    //Save the last pos , we remember where we`ve been and move accordingly
    gStartPos = pos
    //The canvas is render again after every move
    renderMeme()

}

function onUp() {
    console.log('Im from onUp')
    setItemDrag(false)
    document.body.style.cursor = 'grab'
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    // gElCanvas.addEventListener('mouseup', onUp)
  }