import 'pepjs';
import { Engine } from 'babylonjs';
import HoroscopeScene from './HoroscopeScene';

window.addEventListener('DOMContentLoaded', () => {
  const engine = new Engine(document.getElementById('canvas'), true);
  const scene = new HoroscopeScene(engine);
  engine.runRenderLoop(() => scene.render());
  window.addEventListener('resize', () => engine.resize());
});
