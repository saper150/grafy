
module.exports.createCircle = function(){
    const bd = new b2BodyDef;
    bd.position.Set(x, y);
    bd.type = b2_dynamicBody;
    const body = world.CreateBody(bd);

    var circle = new b2CircleShape
    circle.radius = 50;
    body.CreateFixtureFromShape(circle, 1);
    return body
}