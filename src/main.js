import { Scene, Engine, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from 'babylonjs';
import nominatim from 'nominatim-browser';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);
  const camera = new FreeCamera('camera', new Vector3(0, 5, -10), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, false);
  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
  const sphere = MeshBuilder.CreateSphere('sphere', { segments: 16, diameter: 2 }, scene);
  nominatim.geocode({
    city: 'sao paulo',
  }).then(r => console.log(r[0])).catch(e => console.error(e));
  engine.runRenderLoop(() => scene.render());
  window.addEventListener('resize', () => engine.resize());
});
