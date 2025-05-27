const CARD_DISPLAY_DELAY = 300
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const poemCardController = new AbortController();
let shouldStopLoadingCards = false

const poetryStorage = {}
const poemCardStorage = []


function generatePoetryHTML() {
    // Title section
    const poetryDivisoryElement = createElementWithId('div', 'poetry-divisory')

    const poetryElement = createElementWithId('section', 'poetry')

    const poetryTitleElement = createElementWithId('div', 'poetry-title')
    const h2Element = createElementWithText('h2', 'Poetry')
    const pElement = createElementWithText('p', 'Although I do code, this portfolio is actually for my Poetry. Enjoy.')

    poetryTitleElement.append(h2Element, pElement)

    // Filter section
    const poetryFilterElement = createAndPopulateFilterElement()

    // Content section
    const poetryCardsElement = createElementWithId('div', 'poetry-cards')
    poetryElement.append(poetryTitleElement, poetryFilterElement, poetryCardsElement)

    const poetryShowcaseElement = createElementWithId('section', 'poetry-showcase')
    poetryShowcaseElement.hidden = true
    poetryDivisoryElement.append(poetryElement, poetryShowcaseElement)

    contentStorage['poetry'] = poetryDivisoryElement
    document.getElementById('content').append(poetryDivisoryElement) // TODO: REMOVE THIS LINE WHEN DEFAULT CONTENT SHOWCASE IS 'ABOUT'
}

function createPoemElementAndCard(text, fileName) {
    createAndSavePoemElement(text, fileName)

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

function createAndSavePoemElement(text, fileName) {
    const poemElement = document.createElement('div')
    poemElement.classList.add('poem')

    const poemTitleElement = createElementWithText('h2', fileName)
    poemElement.appendChild(poemTitleElement)

    poemElement.append(createElementWithText('p', text))

    poetryStorage[poemTitleElement.textContent] = poemElement
}

async function expandShowcase(fileName) {
    const showcaseElement = document.getElementById('poetry-showcase')

    if (showcaseElement.hasChildNodes()) hideAndReShowElement(showcaseElement, fileName)
    else showElement(showcaseElement, fileName)
}

function shouldStopWritingLines(line, index) {
    return index >= MAX_LINE_FOR_CARD || (line == '' && index > 4)
}

function createAndPopulateFilterElement() {
    const poetryFilterElement = createElementWithId('div', 'poetry-filter')
    const filterLimits = [
        ['A', 'F'],
        ['G', 'L'],
        ['M', 'R'],
        ['S', 'Z']
    ]


    const buttonClass = "filter-toggle-btn"

    filterLimits.forEach((pair, index) => {
        const [fromLetter, toLetter] = pair
        const buttonElement = createElementWithText('button', `${fromLetter}-${toLetter}`)
        buttonElement.classList.add(buttonClass)
        buttonElement.id = `filter-button-${index}`

        buttonElement.addEventListener('click', () => {
            shouldStopLoadingCards = true
            poetryFilterElement.childNodes.forEach(b => { if (b != buttonElement) b.classList.remove('active') });
            buttonElement.classList.toggle('active')

            poetryFilterElement.querySelector(".active") == null ? handlePoemFilteringAction("A", "Z") : handlePoemFilteringAction(fromLetter, toLetter)
        })

        poetryFilterElement.append(buttonElement)
    })

    return poetryFilterElement
}

async function handlePoemFilteringAction(fromLetter, toLetter) {
    const poetryCardsElement = document.getElementById('poetry-cards')
    const possibleCharacters = ALPHABET.substring(ALPHABET.indexOf(fromLetter), ALPHABET.indexOf(toLetter) + 1)
    console.log("handlingFilter")

    // So that fadeIn animation plays when all relevant elements are shown
    poetryCardsElement.childNodes.forEach(element => element.hidden = true)
    // Fix for pressing same filter twice and elements not playing fadeIn animation. Very strange interaction
    await sleep(1)

    poetryCardsElement.childNodes.forEach(element => {
        element.hidden = !possibleCharacters.includes(
            element             // <a>
                .childNodes[0]  // <div>
                .childNodes[0]  // <h4>
                .textContent[0]
        )
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    // This block locally loads a default from LOCAL_FILE_NAMES in script.js
    // Otherwise, manifest.json contains all file names in ./assets/poems/
    await fetch('manifest.json', { signal: poemCardController.signal })
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