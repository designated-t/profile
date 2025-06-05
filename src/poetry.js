const CARD_DISPLAY_DELAY = 300
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let shouldStopLoadingCards = false

const poetryStorage = {}


function generatePoetryHTML() {
    // Title section
    const poetryDivisoryElement = createElementWithId('div', 'poetry-divisory')

    const poetryElement = createElementWithId('section', 'poetry')

    const poetryTitleElement = createElementWithId('div', 'poetry-title')
    const h2Element = createElementWithText('h2', 'Poetry')
    const pElement = createElementWithText('p', 'Although I do code, this portfolio is actually for my Poetry. Enjoy.')

    poetryTitleElement.append(h2Element, pElement)

    const poemSearchElement = createSearchElement()

    // Content section
    const poetryCardsElement = createElementWithId('div', 'poetry-cards')
    poetryElement.append(poetryTitleElement, poemSearchElement, poetryCardsElement)

    const poetryShowcaseElement = createElementWithId('section', 'poetry-showcase')
    poetryShowcaseElement.hidden = true
    poetryDivisoryElement.append(poetryElement, poetryShowcaseElement)

    contentStorage['poetry'] = poetryDivisoryElement
    document.getElementById('content').append(poetryDivisoryElement) // TODO: REMOVE THIS LINE WHEN DEFAULT CONTENT SHOWCASE IS 'ABOUT'
}

function createPoemElementAndCard(text, fileName) {
    const poemElement = createPoemElement(text, fileName)
    poetryStorage[fileName] = poemElement

    const poemElementCard = createElementWithId('div')
    const poemTitleElement = createElementWithText('h4', fileName)
    poemElementCard.appendChild(poemTitleElement)

    const lines = text.split(/\r?\n/);
    let textContent = ''
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (shouldStopWritingLines(line, i)) {
            textContent += '...'
            break
        }
        textContent += `${line}\n`
    }

    poemElementCard.append(createElementWithText('p', textContent))

    const anchorElement = createElementWithId('a')
    anchorElement.appendChild(poemElementCard)
    anchorElement.role = 'button'
    anchorElement.classList.add('poem-card')
    anchorElement.href = '#'
    anchorElement.onclick = () => expandShowcase(fileName)

    anchorElement.classList.add('fade-in');
    return anchorElement
}

function createPoemElement(text, fileName) {
    const poemElement = document.createElement('div')
    poemElement.classList.add('poem')

    const poemTitleElement = createElementWithText('h2', fileName)
    poemElement.appendChild(poemTitleElement)

    poemElement.append(createElementWithText('p', text))

    return poemElement
}

async function expandShowcase(fileName) {
    const showcaseElement = document.getElementById('poetry-showcase')

    if (showcaseElement.hasChildNodes()) hideAndReShowElement(showcaseElement, fileName)
    else showElement(showcaseElement, fileName)
}

function shouldStopWritingLines(line, index) {
    return index >= MAX_LINE_FOR_CARD || (line == '' && index > 4)
}

function createSearchElement() {
    const poetrySearchElement = createElementWithId('input', 'poetry-search')
    poetrySearchElement.placeholder = "Search for poems..."
    
    poetrySearchElement.addEventListener("input", async (event) => {
        shouldStopLoadingCards = true
        const poetryCardsElement = document.getElementById("poetry-cards")
        poetryCardsElement.childNodes.forEach((node) => node.hidden = true)
        await sleep(1)
        poetryCardsElement.childNodes.forEach((node) => {
            const titleElement = node.childNodes[0]
            if (titleElement.textContent.toLowerCase().includes(event.target.value.toLowerCase()))
                node.hidden = false
        })
    })

    return poetrySearchElement
}

document.addEventListener('DOMContentLoaded', async () => {
    // This block locally loads a default from LOCAL_FILE_NAMES in script.js
    // Otherwise, manifest.json contains all file names in ./assets/poems/
    await fetch('manifest.json')
        .then(response => {
            if (!response.ok) return LOCAL_FILE_NAMES
            else return response.json().then()
        })
        .then(data => FILE_NAMES.push(...data))
        .then(() => generatePoetryHTML())
        .then(async () => {
            const poetryCardsElement = document.getElementById('poetry-cards')
            await Promise.all(FILE_NAMES.map(async fileName => {
                const filePath = `${POEMS_FOLDER_PATH}${fileName}`
                return fetch(filePath)
                    .then(response => response.text())
                    .then(text => createPoemElementAndCard(text, fileName))
                    .then(poemCard => {
                        poemCard.hidden = true
                        poetryCardsElement.append(poemCard)
                    })
            }))
        })
        .then(async () => {
            const cards = document.getElementById('poetry-cards').childNodes
            for (const card of cards) {
                card.hidden = false
                await sleep(CARD_DISPLAY_DELAY) // If modified or removed, consider also POEM-PRE-DISPLAY(comment).
                if (shouldStopLoadingCards) break;
            }
        })
});