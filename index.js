import 'handsontable/dist/handsontable.full.css'
import './style.css'
import { Graph } from './graph'
import { spawnWater, particleSystemSetup } from './particles'
import { initializeWorld, worldBounds } from './worldUtilis'
import htmlUtilis from './htmlUtilis'
import './renderer'

initializeWorld(0, -10)
particleSystemSetup({radius: 0.08})
document.getElementById('gravity').innerHTML = `Gravity: ${world.gravity.x}, ${world.gravity.y}`

worldBounds(-5,4,5,-4)

