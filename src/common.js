

function createElementWithId(elementType, id) {
    const element = document.createElement(elementType)
    if (id) element.id = id
    return element
}

function createElementWithText(elementType, textContent) {
    const element = document.createElement(elementType)
    if (textContent) element.textContent = textContent
    return element
}

function createElement(elementType) {
    return document.createElement(elementType)
}

function showElement(el, fileName) {
    el.classList.remove("fade-out")
    el.classList.add("fade-in")
    el.replaceChildren(poetryStorage[fileName])
    el.hidden = false
}

function hideElement(el, fileName) {
    el.classList.remove("fade-in")
    el.classList.add("fade-out")

    el.addEventListener("animationend", function handleFadeOut() {
        showElement(el, fileName)
        el.removeEventListener("animationend", handleFadeOut); // cleanup
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}