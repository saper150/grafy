import 'handsontable/dist/handsontable.full.css'
import { Graph } from './graph'
import { GraphTable } from './UItables'
import { spawnParticles, startingParticles } from './particles'
import { initializeWorld, worldBounds } from './worldUtilis'
import htmlUtilis from './htmlUtilis'
import './renderer'

let table, graph
graph = Graph.random(8, 0.3)
table = new GraphTable('AdjTable', graph)
let show = true
document.getElementById('buttonCreateAdjTable').onclick = function () {
    show = !show
    this.firstChild.data = htmlUtilis.twoStateName(show, 'Show', 'Hide', 'table')
    if (show)
        table.hideTable()
    else
        table.showTable()
}

let connectivityDiv = document.getElementById('graphIsConnected')
document.getElementById('buttonConnectivity').onclick = () => connectivityDiv.innerHTML = `is connected: ${graph.isGraphConnected()}`

initializeWorld(0, -10)
document.getElementById('gravity').innerHTML = `Gravity: ${world.gravity.x}, ${world.gravity.y}`


worldBounds(-2, 2, 2, -2)
graph.spawn()

startingParticles([-1.5, 1], [0.25, 0.9], 0.04)

