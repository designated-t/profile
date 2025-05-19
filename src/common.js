

function showElement(el, fileName) {
    el.classList.remove("fade-out")
    el.classList.add("fade-in")
    el.replaceChildren(poetryStorage[fileName])
    el.hidden = false

    console.log("show")
}

function hideElement(el, fileName) {
    el.classList.remove("fade-in")
    el.classList.add("fade-out")
    console.log("hide")

    el.addEventListener("animationend", function handleFadeOut() {
        showElement(el, fileName)
        el.removeEventListener("animationend", handleFadeOut); // cleanup
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}