const Handsontable = require('handsontable/dist/handsontable.full.js')

module.exports = class UItable {
    constructor(elementID, data) {
        this.data = data
        this.elementID = elementID
        this.hot = null
        this.createTable()
    }


    createTable() {
        if (this.hot != null) {
            return
        }
        document.getElementById(this.elementID).style.display = 'none'
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
    showTable() {
        if (document.getElementById(this.elementID).style.display === 'none') {
            document.getElementById(this.elementID).style.display = 'block'
            return
        }
    }
    hideTable() {
        document.getElementById('AdjTable').style.display = 'none'
    }
    tableChanged(changes, source) {
        //changes[0]: [0] row | [1] col | [2] before | [3] after
        //this - table core

        if (source != 'mirror') {
            this.setDataAtCell(changes[0][1], changes[0][0], changes[0][3], 'mirror')
        }
    }

    beforeTableChanged(changes, source) {
        if (changes[0][0] === changes[0][1]) {
            return false
        }
    }

    getData() {
        return this.hot.getData()
    }
}