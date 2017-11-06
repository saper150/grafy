import 'handsontable/dist/handsontable.full.css'
import { Graph } from './graph'
import { spawnParticles, startingParticles } from './particles'
import { initializeWorld, worldBounds } from './worldUtilis'
import htmlUtilis from './htmlUtilis'
import './renderer'

initializeWorld(0, -10)
document.getElementById('gravity').innerHTML = `Gravity: ${world.gravity.x}, ${world.gravity.y}`

worldBounds(-5,4,5,-4)
startingParticles([0, 1], [0.55, 1.5], 0.08,7)

