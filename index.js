require('handsontable/dist/handsontable.full.css')
const Graph = require('./graph.js')
const UItable = require('./UItables.js')
let table, graph
graph = Graph.random(8, 0.3)
table = new UItable('AdjTable', graph.mat)
document.getElementById('buttonCreateAdjTable').onclick = () => table.showTable()
document.getElementById('buttonDeleteAdjTable').onclick = () => table.hideTable()

require('./renderer')

window.world = new b2World(new b2Vec2(0, -10))
window.scaleMulti = 100

graph.spawn()
const bodyDef = new b2BodyDef()
const ground = world.CreateBody(bodyDef)

const chainShape = new b2ChainShape();
chainShape.vertices.push(new b2Vec2(-2, -2))
chainShape.vertices.push(new b2Vec2(2, -2))
chainShape.vertices.push(new b2Vec2(2, 2))
chainShape.vertices.push(new b2Vec2(-2, 2))

chainShape.CreateLoop()
ground.CreateFixtureFromShape(chainShape, 0)




const polygonShape = new b2PolygonShape
polygonShape.SetAsBoxXYCenterAngle(0.25, 0.5, new b2Vec2(-1.5, 1), 0)

const psd = new b2ParticleSystemDef()
psd.radius = 0.03
psd.dampingStrength = 0.4
const particleSystem = world.CreateParticleSystem(psd)

const pd = new b2ParticleGroupDef()
pd.shape = polygonShape
pd.flags = b2_colorMixingParticle
for (let i = 0; i < 7; i++) {
    pd.position.Set(i/2, 0)
    pd.color.Set(  0,  255-i * 40, 255- i* 20, 255);
    const group = particleSystem.CreateParticleGroup(pd)
}

//debug info
console.log(world)
console.log(`Partcles: ${world.particleSystems[0].GetParticleCount()/2}`)
