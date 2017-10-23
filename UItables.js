const Handsontable = require('handsontable/dist/handsontable.full.js')

module.exports = class UItable {
    constructor(elementID, data) {
        this.data = data
        this.elementID = elementID
        this.hot = null
    }
    createTable() {
        if (this.hot != null) {
            return
        }
        this.container = document.getElementById(this.elementID)
        this.hot = new Handsontable(this.container, {
            data: this.data,
            rowHeaders: true,
            colHeaders: function (index) {
                return index + 1
            },
            validator: function edgeValidator(query, callback) {
                callback(query == 0 || query == 1)
            },
            allowInvalid: false
        })
        Handsontable.hooks.add('afterChange', this.tableChanged, this.hot)
        Handsontable.hooks.add('beforeChange', this.beforeTableChanged, this.hot)
    }

    deleteTable() {
        if (this.hot != null) {
            this.hot.destroy()
            this.hot = null
        }
    }
    tableChanged(changes, source) {
        //changes[0]: [0] row | [1] col | [2] before | [3] after
        //this - table core

        if (source != 'mirror') {
            this.setDataAtCell(changes[0][1], changes[0][0], changes[0][3], 'mirror')
        }
    }

    beforeTableChanged(changes, source) {
        if (changes[0][0] == changes[0][1]) {
            return false
        }
    }

    getData() {
        return this.hot.getData()
    }
}