require('handsontable/dist/handsontable.full.css')
//const { Graph } = require('./graph.js')
const Graph = require('./graph.js')
const UItable = require('./UItables.js')
require('./sketch.js')
let table, graph
graph = Graph.random(8, 0.5)
// console.log(graph)
table = new UItable('AdjTable', graph.mat)
document.getElementById('buttonCreateAdjTable').onclick = () => table.createTable()
document.getElementById('buttonDeleteAdjTable').onclick = () => table.hideTable()


window.world = new b2World(new b2Vec2(0, -10))

const bodyDef = new b2BodyDef();
const ground = world.CreateBody(bodyDef);

const chainShape = new b2ChainShape();
chainShape.vertices.push(new b2Vec2(-2, 0))
chainShape.vertices.push(new b2Vec2(2, 0))
chainShape.vertices.push(new b2Vec2(2, 4))
chainShape.vertices.push(new b2Vec2(-2, 4))

chainShape.CreateLoop()
ground.CreateFixtureFromShape(chainShape, 0)

const shape = new b2PolygonShape
shape.SetAsBoxXYCenterAngle(1.5, 1, new b2Vec2(0, 1), 0)


const bd = new b2BodyDef;
bd.position.Set(0, 1000);
bd.type = b2_dynamicBody;
const body = world.CreateBody(bd);

var circle = new b2CircleShape
circle.radius = 0.1;
body.CreateFixtureFromShape(circle, 1);



const polygonShape = new b2PolygonShape
polygonShape.SetAsBoxXYCenterAngle(1.5, 1, new b2Vec2(0, 1), 0)

const psd = new b2ParticleSystemDef()
psd.radius = 0.11
psd.dampingStrength = 0.4

const particleSystem = world.CreateParticleSystem(psd)

const pd = new b2ParticleGroupDef()
pd.shape = polygonShape;
const group = particleSystem.CreateParticleGroup(pd)

const timeStep = 1 / 60
const velocityIterations = 5
const positionIterations = 5
console.log(world)

    console.log(particleSystem)
    console.log(world.particleSystems[0].GetPositionBuffer())
    console.log(world.particleSystems[0].GetParticleCount())
    console.log(body.GetLinearVelocity())
    console.log(body.GetPosition())
    console.log(group)