import Handsontable from 'handsontable/dist/handsontable.full.js'

function diagonalTableRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
        td.style.background = '#DDDDDD'
        td.style.fontWeight = 'bold'
        td.style.color = 'red'
        td.style.textAlign = 'center'
}

function normalTableRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.style.fontWeight = 'bold'
    td.style.textAlign = 'center'
}

Handsontable.renderers.registerRenderer('diagonalTableRenderer', diagonalTableRenderer);
Handsontable.renderers.registerRenderer('normalTableRenderer', normalTableRenderer);

export class GraphTable {
    constructor(elementID, graph) {
        this.graph = graph
        this.data = graph.mat
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
                callback(query === 0 || query === 1)
            },
            allowInvalid: false,
            type: 'numeric',
            cells: (row, col, prop) => {
                let cellProperties = {}
                if (row === col) {
                    cellProperties.readOnly = true
                    cellProperties.renderer = 'diagonalTableRenderer'
                    return cellProperties
                }
                cellProperties.renderer = 'normalTableRenderer'
                return cellProperties
            }
        })
        this.container.children.namedItem('buttonRefreshGraph').onclick = () => this.updateGraph()
        Handsontable.hooks.add('afterChange', this.tableChanged, this.hot)
    }
    showTable() {
        if (document.getElementById(this.elementID).style.display === 'none') {
            document.getElementById(this.elementID).style.display = 'block'
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


    getData() {
        return this.hot.getData()
    }

    updateGraph() {
        this.graph.recreateEdges()
    }

}