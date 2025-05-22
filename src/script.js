const LOCAL_FILE_NAMES = ["The Belated Gift", "Bridled"]
const FILE_NAMES = []
const MAX_LINE_FOR_CARD = 6
const POEMS_FOLDER_PATH = "assets/poems/"

const contentStorage = {}

function swapSection(elementId) {
    const contentElement = document.getElementById("content")
    contentElement.childNodes.forEach(element => { element.hidden = true })
    document.getElementById(elementId).hidden = false
}