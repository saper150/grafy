//const { Graph } = require('./graph.js')
const Graph = require('./graph.js')
const UItable = require('./UItables.js')
// global.box2d = require('box2dweb-commonjs')
require('handsontable/dist/handsontable.full.css')
require('./sketch.js')
let table, graph
graph = Graph.random(8, 0.5)
// console.log(graph)
table = new UItable('AdjTable', graph.mat)
document.getElementById('buttonCreateAdjTable').onclick = () => table.createTable()
document.getElementById('buttonDeleteAdjTable').onclick = () => table.hideTable()

let Box2D = require('box2dweb')
let gravity = new Box2D.Common.Math.b2Vec2(0,-100)

//TODO: find a way to send world to p5 draw()
global.world = new Box2D.Dynamics.b2World(gravity)
const circle = require('./worldElements/circle.js')
let elements = []
for(let i = -50; i < 50; i+=20){
    for(let j = 20; j<200;j+=20 )
    elements.push(new circle(world, [i, j], 10))
}
elements.push(new circle(world, [1,1], 10))
elements.push(new circle(world, [50,1], 10))
elements.push(new circle(world, [-100,1], 10))

let rectangle = require('./worldElements/rectangle')
elements.push(new rectangle(world, [0,-100], true))


console.log(world)