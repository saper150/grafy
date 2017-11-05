export default class HtmlUtilis {
    static twoStateName(condition, stateTrue, stateFalse, data) {
        if (condition)
            return `${stateTrue} ${data}`
        return `${stateFalse} ${data}`
    }
    static setTextInDiv(divName, content) {
        document.getElementById(divName).innerHTML = content
    }

}