
module.exports = class Graph {
    constructor(vertexCount) {
        this.mat = Array.from(Array(vertexCount).keys())
            .map(y => Array(vertexCount).fill(0))
    }

    static random(vertexCount, edgeChance) {
        const graph = new Graph(vertexCount)
        for (let i = 0; i < vertexCount; i++) {
            for (let j = i + 1; j < vertexCount; j++) {
                if (Math.random() <= edgeChance) graph.addEdge(i, j)
            }
        }
        return graph
    }

    addEdge(a, b) {
        this.mat[a][b] = 1
        this.mat[b][a] = 1
    }

    spawn() {

        const circles = []
        for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / this.mat.length) {
            const x = (Math.sin(i) * 1.3) + 0
            const y = (Math.cos(i) * 1.3) + 2
            circles.push(createCircle([x, y]))
        }

        for (const [a, b] of this.edges()) {

            var djd = new b2DistanceJointDef;
            djd.bodyA = circles[a];
            djd.bodyB = circles[b];
            djd.frequencyHz = 2;
            djd.dampingRatio = 0.1;
            djd.length = 1
            world.CreateJoint(djd)
        }

    }
    edges() {
        const result = []
        for (let i = 0; i < this.mat.length; i++) {
            for (let j = i + 1; j < this.mat.length; j++) {
                if (this.mat[i][j] === 1) result.push([i, j])
            }
        }
        return result
    }

}
function createCircle([x, y]) {
    const bd = new b2BodyDef;
    bd.position.Set(x, y);
    bd.type = b2_dynamicBody;
    const body = world.CreateBody(bd);

    var circle = new b2CircleShape
    circle.radius = 0.1;
    body.CreateFixtureFromShape(circle, 1);
    return body
}