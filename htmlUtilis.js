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
function setupButtonWithClick(settings){
    document.getElementById(settings.name).onclick = settings.action
}
function setupSelectWithOptions(settings) {
    let selectClickOption = document.getElementById(settings.name)
    settings.options.forEach(x => selectClickOption.add(htmlUtilis.createOption(x)))
    return selectClickOption
}
const functions = {twoStateName, setTextInDiv, createOption, setupButtonWithClick, setupSelectWithOptions}
export const htmlUtilis = functions