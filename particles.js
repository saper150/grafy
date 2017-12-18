export function particleSystemSetup(settings) {
    const psd = new b2ParticleSystemDef()
    psd.radius = settings.radius
    psd.dampingStrength = 0.4
    const particleSystem = world.CreateParticleSystem(psd)
}

/**
 * 
 * @param {object} settings settings {width, height, x, y, count}
 */
export function addWaterToWorld(settings) {
    if (!settings.count)
        settings.count = 7

    const polygonShape = new b2PolygonShape
    polygonShape.SetAsBoxXYCenterAngle(settings.width, settings.height, new b2Vec2(settings.x - (settings.count - 1) * settings.width, settings.y), 0)



    const pd = new b2ParticleGroupDef()
    pd.shape = polygonShape
    pd.flags = b2_colorMixingParticle
    let particleCount = 0;
    for (let i = 0; i < settings.count; i++) {
        pd.position.Set(i * settings.width * 2, 0)
        pd.color.Set(0, 255 - i * 40, 255 - i * 20, 255);
        const group = world.particleSystems[0].CreateParticleGroup(pd)
        particleCount += group.GetParticleCount()
    }

    return particleCount
}
