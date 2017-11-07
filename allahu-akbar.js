

export function allahuAkbar({ center, particleCount = 100, blastPower = 200 }) {

    const bodies = []
    setTimeout(function() {
        for (const b of bodies) { 
            world.DestroyBody(b)
        }
    }, 500);
    for (let i = 0; i < particleCount; i++) { 
        const angle = (i / particleCount) * Math.PI * 2;
        
        let dir = new b2Vec2(Math.sin(angle), Math.cos(angle))
        let velocity = new b2Vec2
        b2Vec2.MulScalar(velocity, dir, blastPower)

        const bodyDef = new b2BodyDef
        bodyDef.type = b2_dynamicBody;
        bodyDef.fixedRotation = true; // rotation not necessary
        bodyDef.bullet = true; // prevent tunneling at high speed
        bodyDef.linearDamping = 10; // drag due to moving through air
        bodyDef.gravityScale = 0; // ignore gravity
        bodyDef.position = center; // start at blast center
        bodyDef.linearVelocity = velocity;
    
        const body = world.CreateBody(bodyDef)
        bodies.push(body)

        const circleShape = new b2CircleShape;
        circleShape.m_radius = 0.05; // very small
    
        const fixture = new b2FixtureDef;
        fixture.shape = circleShape;
        fixture.density = 60 / particleCount; // very high - shared across all particles
        fixture.friction = 0; // friction not necessary
        fixture.restitution = 0.99; // high restitution to reflect off obstacles
        fixture.filter.groupIndex = -1; // particles should not collide with each other
        
        body.CreateFixtureFromDef(fixture)
    }
}