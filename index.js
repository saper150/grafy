import 'handsontable/dist/handsontable.full.css'
import { Graph } from './graph'
import { GraphTable } from './UItables'
import { spawnParticles, startingParticles } from './particles'
import { initializeWorld, worldBounds } from './worldUtilis'
import './renderer'

let table, graph
graph = Graph.random(8, 0.3)
table = new GraphTable('AdjTable', graph)
document.getElementById('buttonCreateAdjTable').onclick = () => table.showTable()
document.getElementById('buttonDeleteAdjTable').onclick = () => table.hideTable()

let connectivityDiv = document.getElementById('graphIsConnected')
document.getElementById('buttonConnectivity').onclick = () => connectivityDiv.innerHTML = `is connected: ${graph.isGraphConnected()}`

initializeWorld(0, -10)
document.getElementById('gravity').innerHTML = `Gravity: ${world.gravity.x}, ${world.gravity.y}`


worldBounds(-2, 2, 2, -2)
graph.spawn()

startingParticles([-1.5, 1], [0.25, 0.9], 0.03)

