import * as THREE from 'three'

export class Box extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32)

    const material = new THREE.MeshBasicMaterial({
      color: 0x99dd99,
    })

    super(geometry, material)
  }
}
