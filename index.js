require('handsontable/dist/handsontable.full.css')
const Graph = require('./graph.js')
const UItable = require('./UItables.js')
const {spawnParticles, startingParticles} = require('./particles')

let table, graph
graph = Graph.random(8, 0.3)
table = new UItable('AdjTable', graph.mat)
document.getElementById('buttonCreateAdjTable').onclick = () => table.showTable()
document.getElementById('buttonDeleteAdjTable').onclick = () => table.hideTable()
require('./renderer')
const gravity = new b2Vec2(0, -10)
window.world = new b2World(gravity)
document.getElementById('gravity').innerHTML = `Gravity: ${gravity.x}, ${gravity.y}`

window.scaleMulti = 100

graph.spawn()
worldBounds(-2,2,2,-2)

startingParticles([-1.5,1],[0.25,0.9],0.03)

function worldBounds(left,top,rigth,bottom){
    const bodyDef = new b2BodyDef()
    const ground = world.CreateBody(bodyDef)
    
    const chainShape = new b2ChainShape();
    chainShape.vertices.push(new b2Vec2(left, bottom))
    chainShape.vertices.push(new b2Vec2(rigth, bottom))
    chainShape.vertices.push(new b2Vec2(rigth, top))
    chainShape.vertices.push(new b2Vec2(left, top))
    
    chainShape.CreateLoop()
    ground.CreateFixtureFromShape(chainShape, 0)
}


