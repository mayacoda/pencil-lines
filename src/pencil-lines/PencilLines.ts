import type { Experience } from '../engine/Experience'
import type { Resource } from '../engine/Resources'
import type { Engine } from '../engine/Engine'
import * as THREE from 'three'
import { Box } from './Box'
import { PencilLinesPass } from './PencilLinesPass'

export class PencilLines implements Experience {
  resources: Resource[] = [
    {
      name: 'colorNoiseTexture',
      type: 'texture',
      path: 'textures/color-noise.png',
    },
    {
      name: 'cloudTexture',
      type: 'texture',
      path: 'textures/cloud-noise.png',
    },
  ]
  pencilLinesPass!: PencilLinesPass

  constructor(private engine: Engine) {}

  init() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    )

    plane.rotation.x = -Math.PI / 2
    plane.receiveShadow = true

    this.engine.scene.add(plane)
    this.engine.scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    let directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.castShadow = true
    directionalLight.position.set(2, 2, 2)
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048

    this.engine.scene.add(directionalLight)

    const box = new Box()
    box.castShadow = true
    box.rotation.y = Math.PI / 4
    box.position.set(0, 0.5, 0)

    this.engine.scene.add(box)

    this.pencilLinesPass = new PencilLinesPass(this.engine)
    this.engine.renderEngine.composer.addPass(this.pencilLinesPass)
  }

  update() {}
}
