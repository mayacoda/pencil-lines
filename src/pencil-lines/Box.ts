import * as THREE from 'three'

export class Box extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)

    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
    })

    super(geometry, material)
  }
}
