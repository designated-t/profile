const poetryStorage = {}
const poemCardStorage = []


async function generatePoetryHTML() {
    const poetryTitleElement = document.createElement("div")
    poetryTitleElement.id = "poetry-title"
    const h2Element = document.createElement("h2")
    h2Element.textContent = "Poetry"
    const pElement = document.createElement("p")
    pElement.textContent = "Although I do code, this portfolio is actually for my Poetry. Enjoy."
    poetryTitleElement.append(h2Element, pElement)

    const poetryCardsElement = document.createElement("div")
    poetryCardsElement.id = "poetry-cards"

    const poetryElement = document.createElement("section")
    poetryElement.id = "poetry"
    poetryElement.append(poetryTitleElement, poetryCardsElement)

    const poetryShowcaseElement = document.createElement("section")
    poetryShowcaseElement.id = "poetry-showcase"
    poetryShowcaseElement.hidden = true

    const poetryDivisoryElement = document.createElement("div")
    poetryDivisoryElement.id = "poetry-divisory"
    poetryDivisoryElement.append(poetryElement, poetryShowcaseElement)

    contentStorage["poetry"] = poetryDivisoryElement
    document.getElementById("content").append(poetryDivisoryElement) // TODO: REMOVE THIS LINE WHEN DEFAULT CONTENT SHOWCASE IS "ABOUT"

    for (const fileName of FILE_NAMES) {
        const filePath = `${POEMS_FOLDER_PATH}${fileName}`
        await fetch(filePath)
            .then(response => response.text())
            .then(text => {
                const poemElementCard = createPoemElementAndCard(text, fileName)
                poemCardStorage.push(poemElementCard)
            })
    }
}

function createPoemElementAndCard(text, fileName) {
    const lines = text.split(/\r?\n/);
    createAndSavePoemElement(lines, fileName)

    const poemElementCard = document.createElement('div')

    const poemTitleElement = document.createElement('h4')
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
        if (line == "") poemElement.appendChild(document.createElement("br"))
    }

    poemElement.classList.add("poem")
    poetryStorage[poemTitleElement.textContent] = poemElement
}

async function expandShowcase(fileName) {
    const showcaseElement = document.getElementById("poetry-showcase")

    if (showcaseElement.hasChildNodes()) hideElement(showcaseElement, fileName)
    else showElement(showcaseElement, fileName)
}

async function loadPoemCardElements() {
    const poetryCardsElement = document.getElementById('poetry-cards')

    for (const card of poemCardStorage) {
        console.log(card)
        poetryCardsElement.appendChild(card)
        await sleep(200)
    }

    console.log(`✅ Poems Section Loaded!`);
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

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadPoemCardElements();
                observer.unobserve(entry.target); // single trigger cleanup
            }
        });
    }, {
        threshold: 0.1
    });

    generatePoetryHTML()
        .then(() => observer.observe(document.getElementById("poetry-cards")))
});