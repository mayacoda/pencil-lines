import { ShaderMaterial, Vector2 } from 'three'
import fragmentShader from './shaders/pencil-lines.frag'
import vertexShader from './shaders/pencil-lines.vert'
import { GameEntity } from '../engine/GameEntity'
import { Engine } from '../engine/Engine'

export class PencilLinesShader extends ShaderMaterial implements GameEntity {
  constructor(private engine: Engine) {
    super({
      uniforms: {
        tDiffuse: { value: null },
        uResolution: {
          value: new Vector2(1, 1),
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
    console.log('resize')
    this.uniforms.uResolution.value = new Vector2(
      this.engine.sizes.width,
      this.engine.sizes.height
    )
  }
}
