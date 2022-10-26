'use strict'

let gElCanvas
let gCtx
let gFocusedLineIdx = 0
let emojiIdx = 0

function onInit() {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d')

    renderGallery()
    window.addEventListener('resize', resizeCanvas)

}

function onImgSelect(elImg) {
    document.querySelector('.gallery').classList.add('hide')
    document.querySelector('.meme-generator').classList.remove('hide')

    const imgId = elImg.getAttribute('data-id')
    setImg(imgId)

    resizeCanvas()
    renderMeme()
}

function onSetLineText() {
    const text = document.querySelector('.text').value
    setLineText(text,gFocusedLineIdx)
    renderMeme()
}
function onSetLineColor() {
    const textColor = document.querySelector('.textColor').value
    setLineColor(textColor,gFocusedLineIdx)
    renderMeme()
}
function onSetLineSize(diff) {
    setLineSize(+diff,gFocusedLineIdx)
    renderMeme()
}
function onAddLine() {
    addLine()
    renderMeme()
}
function onSetLineFocus(){
    const memeLines = getMeme().lines
    const linesMap = memeLines.length
    gFocusedLineIdx++
    if(gFocusedLineIdx === linesMap) gFocusedLineIdx = 0
    document.querySelector('.text').value = memeLines[gFocusedLineIdx].txt
}
function onSetTextAlign(alignment){
    setTextAlign(alignment,gFocusedLineIdx)
    renderMeme()
}
function onMoveLine(diff){
    moveLine(diff,gFocusedLineIdx)
}


function renderMeme() {
    const { selectedImgId, lines } = getMeme()

    drawImg(selectedImgId, lines)
}
function drawImg(selectedImgId, lines) {
    const img = new Image()
    img.src = `imgs/${selectedImgId}.jpg`
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        lines.forEach(({ txt, color, size ,align}) => {
            switch(align){
                case 'left': drawText(txt, color, size, 10, 50); break;
                case 'center': drawText(txt, color, size, gElCanvas.width/2 - gCtx.measureText(txt).width/2, 50); break;
                case 'right': drawText(txt, color, size, gElCanvas.width - gCtx.measureText(txt).width - 10, 50); break;
            }
        });
    }
}
function drawText(txt, color, size, x, y) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'brown'
    gCtx.fillStyle = color

    gCtx.font = `${size}px Arial`
    gCtx.fillText(txt, x, y)
    gCtx.strokeText(txt, x, y)
}

function resizeCanvas(ev) {
    console.log(ev);
    const elContainer = document.querySelector('.canvas-place')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetWidth
    renderMeme()
}

function onOpenColorPicker(){
    let colorpick = document.querySelector('.c22').select()
    console.log(colorpick);
}