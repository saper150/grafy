function twoStateName(condition, stateTrue, stateFalse, data) {
    if (condition)
        return `${stateTrue} ${data}`
    return `${stateFalse} ${data}`
}
function setTextInDiv(divName, content) {
    document.getElementById(divName).innerHTML = content
}
function createOption(name) {
    let option = document.createElement("option")
    option.text = name
    return option
}
const functions = {twoStateName, setTextInDiv, createOption}
export const htmlUtilis = functions