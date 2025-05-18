const FILE_NAMES = ["The Belated Gift", "Bridled"]
const MAX_LINE_FOR_CARD = 4
const POEMS_FOLDER_PATH = "assets/poems/"
const BR_ELEMENT = document.createElement("br")

const poetryStorage = {}
const poemCardStorage = []

async function generateHTMLFromPoems() {
    console.log("startOfGenerateHTML")
    for (const fileName of FILE_NAMES) {
        console.log("startOf"+fileName)
        const filePath = `${POEMS_FOLDER_PATH}${fileName}`
        await fetch(filePath)
            .then(response => response.text())
            .then(text => {
                const poemElementCard = createPoemElementAndCard(text, fileName)
                console.log("hi from generating cards")
                poemCardStorage.push(poemElementCard)
            })
        console.log(`✅ Poem generated: ${fileName}`);
    }

    console.log(`✅ Poems Section Loaded!`);
}


function createPoemElementAndCard(text, fileName) {
    const lines = text.split(/\r?\n/);
    createAndSavePoemElement(lines, fileName)

    const poemElementCard = document.createElement('div')

    const poemTitleElement = document.createElement('h3')
    poemTitleElement.textContent = fileName

    poemElementCard.appendChild(poemTitleElement)

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line == "" || i == MAX_LINE_FOR_CARD) break

        const lineElement = document.createElement("p")
        lineElement.textContent = line
        poemElementCard.appendChild(lineElement)
    }

    const etcLineElement = document.createElement("p")
    etcLineElement.textContent = "..."
    poemElementCard.append(etcLineElement)

    const anchorElement = document.createElement("a")
    anchorElement.appendChild(poemElementCard)
    anchorElement.href = "#"
    anchorElement.role = "button"
    anchorElement.classList.add("poem-card")
    anchorElement.onclick = () => expandShowcase(fileName)

    anchorElement.classList.add("fade-in");
    return anchorElement
}

function createAndSavePoemElement(lines, fileName) {
    const poemElement = document.createElement('div')

    const poemTitleElement = document.createElement('h3')
    poemTitleElement.textContent = fileName

    poemElement.appendChild(poemTitleElement)

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const lineElement = document.createElement("p")
        lineElement.textContent = line
        poemElement.appendChild(lineElement)
        if (line == "") poemElement.appendChild(BR_ELEMENT)
    }

    poemElement.classList.add("poem")
    poetryStorage[poemTitleElement.textContent] = poemElement
}

function expandShowcase(fileName) {
    document.getElementById("poetry-cards").hidden = true
    document.getElementById("poetry-showcase").appendChild(poetryStorage[fileName])
}

async function loadPoemCardElements() {
    const poetryCardsElement = document.getElementById('poetry-cards')

    for (const card of poemCardStorage) {
        console.log(card)
        poetryCardsElement.appendChild(card)
        await sleep(300)
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function swapSection(elementId) {
    const contentElement = document.getElementById("content")
    contentElement.childNodes.forEach(element => { element.hidden = true })
    document.getElementById(elementId).hidden = false
}

document.addEventListener('DOMContentLoaded', async () => {

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadPoemCardElements(); // call your custom function
                console.log("inside OBSERVER")
                observer.unobserve(entry.target); // optional: only trigger once
            }
        });
    }, {
        threshold: 0.1 // adjust sensitivity (0 to 1)
    });

    generateHTMLFromPoems()
        .then(() => observer.observe(document.getElementById("poetry-cards")))
});