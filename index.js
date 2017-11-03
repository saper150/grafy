import 'handsontable/dist/handsontable.full.css'
import {Graph} from './graph'
import {UItable} from './UItables'
import {spawnParticles, startingParticles} from './particles'
import {initializeWorld, worldBounds} from './worldUtilis'
import './renderer'

let table, graph
graph = Graph.random(8, 0.3)
table = new UItable('AdjTable', graph.mat)
document.getElementById('buttonCreateAdjTable').onclick = () => table.showTable()
document.getElementById('buttonDeleteAdjTable').onclick = () => table.hideTable()

initializeWorld(0,-10)
document.getElementById('gravity').innerHTML = `Gravity: ${world.gravity.x}, ${world.gravity.y}`


worldBounds(-2,2,2,-2)
graph.spawn()

startingParticles([-1.5,1],[0.25,0.9],0.03)

