export function startingParticles([x, y], [width, height], radius){
    const polygonShape = new b2PolygonShape
    polygonShape.SetAsBoxXYCenterAngle(0.25, 0.9, new b2Vec2(-1.5, 1), 0)
    
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
}

export function spawnParticles([x, y], [width, height], radius) {
    const polygonShape = new b2PolygonShape
    polygonShape.SetAsBoxXYCenterAngle(width, height, new b2Vec2(x, y), 0)

    const particleSystem = world.particleSystems[0]

    const pd = new b2ParticleGroupDef()
    pd.shape = polygonShape
    pd.flags = b2_colorMixingParticle
    pd.color.Set(0, 20, 240, 255);
    const group = particleSystem.CreateParticleGroup(pd)
}
