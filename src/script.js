const FILE_NAMES = ["The Belated Gift", "Bridled", "The Belated Gift copy", "The Belated Gift copy 2", "The Belated Gift copy 3", "The Belated Gift copy 4", "The Belated Gift copy 5", "The Belated Gift copy 6", "The Belated Gift copy 7"]
const MAX_LINE_FOR_CARD = 4
const POEMS_FOLDER_PATH = "assets/poems/"

const contentStorage = {}

function swapSection(elementId) {
    const contentElement = document.getElementById("content")
    contentElement.childNodes.forEach(element => { element.hidden = true })
    document.getElementById(elementId).hidden = false
}