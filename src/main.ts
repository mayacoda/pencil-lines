import './style.scss'
import { Engine } from './engine/Engine'
import { PencilLines } from './pencil-lines/PencilLines'

new Engine({
  canvas: document.querySelector('#canvas') as HTMLCanvasElement,
  experience: PencilLines,
  info: {
    twitter: 'https://twitter.com/maya_ndljk',
    github: 'https://github.com/mayacoda/pencil-lines',
    description: 'Three.js postprocessing effect to mimic sketchy lines',
    documentTitle: 'Pencil Lines',
    title: 'Pencil Lines',
  },
})
