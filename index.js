const { graph } = require('./graph')


window.world = new b2World(new b2Vec2(0, -10)) // liquid z jakiegoś powodu wymaga żeby world był globaly

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
psd.radius = 0.025
psd.dampingStrength = 0.2

const particleSystem = world.CreateParticleSystem(psd)

const pd = new b2ParticleGroupDef()
pd.shape = polygonShape;
const group = particleSystem.CreateParticleGroup(pd)




const timeStep = 1 / 60
const velocityIterations = 5
const positionIterations = 5

function run() {
    world.Step(timeStep, velocityIterations, positionIterations)
    console.log(particleSystem.GetPositionBuffer())
    console.log(body.GetLinearVelocity())
    console.log(body.GetPosition())
    console.log(group)
    requestAnimationFrame(run)
}

run()