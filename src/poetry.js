const CARD_DISPLAY_DELAY = 300

const poetryStorage = {}
const poemCardStorage = []


function generatePoetryHTML() {
    const poetryDivisoryElement = createElementWithId("div", "poetry-divisory")

    const poetryElement = createElementWithId("section", "poetry")

    const poetryTitleElement = createElementWithId("div", "poetry-title")
    const h2Element = createElementWithText("h2", "Poetry")
    const pElement = createElementWithText("p", "Although I do code, this portfolio is actually for my Poetry. Enjoy.")
    poetryTitleElement.append(h2Element, pElement)

    const poetryCardsElement = createElementWithId("div", "poetry-cards")
    poetryElement.append(poetryTitleElement, poetryCardsElement)

    const poetryShowcaseElement = createElementWithId("section", "poetry-showcase")
    poetryShowcaseElement.hidden = true
    poetryDivisoryElement.append(poetryElement, poetryShowcaseElement)

    contentStorage["poetry"] = poetryDivisoryElement
    document.getElementById("content").append(poetryDivisoryElement) // TODO: REMOVE THIS LINE WHEN DEFAULT CONTENT SHOWCASE IS "ABOUT"
}

function createPoemElementAndCard(text, fileName) {
    const lines = text.split(/\r?\n/);
    createAndSavePoemElement(lines, fileName)

    const poemElementCard = createElementWithId('div')
    const poemTitleElement = createElementWithText('h4', fileName)
    poemElementCard.appendChild(poemTitleElement)
    let textContent = ""
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (shouldStopWritingLines(line, i)) {
            textContent += "..."
            break
        }
        textContent += `${line}\n`
    }

    poemElementCard.append(createElementWithText("p", textContent))

    const anchorElement = createElementWithId("a")
    anchorElement.appendChild(poemElementCard)
    anchorElement.role = "button"
    anchorElement.classList.add("poem-card")
    anchorElement.href = "#"
    anchorElement.onclick = () => expandShowcase(fileName)

    anchorElement.classList.add("fade-in");
    return anchorElement
}

function createAndSavePoemElement(lines, fileName) {
    const poemElement = document.createElement('div')
    poemElement.classList.add("poem")

    const poemTitleElement = createElementWithText('h2', fileName)
    poemElement.appendChild(poemTitleElement)

    let textContent = ""
    lines.forEach(line => textContent += `${line}\n`);

    poemElement.append(createElementWithText("p", textContent))

    poetryStorage[poemTitleElement.textContent] = poemElement
}

async function expandShowcase(fileName) {
    const showcaseElement = document.getElementById("poetry-showcase")

    if (showcaseElement.hasChildNodes()) hideElement(showcaseElement, fileName)
    else showElement(showcaseElement, fileName)
}

function shouldStopWritingLines(line, index) {
    return index >= MAX_LINE_FOR_CARD || (line == "" && index > 4)
}

document.addEventListener('DOMContentLoaded', async () => {

    // This block locally loads a default from LOCAL_FILE_NAMES in script.js
    // Otherwise, manifest.json contains all file names in ./assets/poems/
    await fetch("manifest.json")
        .then(response => {
            if (!response.ok) return LOCAL_FILE_NAMES
            else return response.json().then()
        })
        .then(data => FILE_NAMES.push(...data))
        .then(() => generatePoetryHTML())
        .then(() => Promise.all(FILE_NAMES.map(async fileName => {
            const filePath = `${POEMS_FOLDER_PATH}${fileName}`
            return fetch(filePath)
                .then(response => response.text())
                .then(text => createPoemElementAndCard(text, fileName))
                .then(poemCard => {
                    poemCard.hidden = true
                    document.getElementById('poetry-cards').append(poemCard)
                })
        })))
        .then(async () => {
            const cards = document.getElementById('poetry-cards').childNodes
            for (const card of cards) {
                card.hidden = false
                await sleep(CARD_DISPLAY_DELAY)
            }
        })

});