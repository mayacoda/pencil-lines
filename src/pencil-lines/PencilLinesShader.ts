import { ShaderMaterial, Vector2 } from 'three'
import fragmentShader from './shaders/pencil-lines.frag'
import vertexShader from './shaders/pencil-lines.vert'
import { GameEntity } from '../engine/GameEntity'
import { Engine } from '../engine/Engine'

export class PencilLinesShader extends ShaderMaterial implements GameEntity {
  constructor(private engine: Engine) {
    super({
      uniforms: {
        uDiffuse: { value: null },
        uResolution: {
          value: new Vector2(1, 1),
        },
        uDepthBuffer: { value: null },
        uSurfaceBuffer: { value: null },
        uCameraNear: { value: engine.camera.instance.near },
        uCameraFar: { value: engine.camera.instance.far },

        uColorTexture: {
          value: engine.resources.getItem('colorNoiseTexture'),
        },
        uCloudTexture: {
          value: engine.resources.getItem('cloudTexture'),
        },
      },
      fragmentShader,
      vertexShader,
    })

    this.uniforms.uResolution.value = new Vector2(
      this.engine.sizes.width,
      this.engine.sizes.height
    )
  }

  update() {}

  resize() {
    this.uniforms.uResolution.value = new Vector2(
      this.engine.sizes.width,
      this.engine.sizes.height
    )
  }
}
