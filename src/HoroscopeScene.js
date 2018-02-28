import { Scene, FreeCamera, Vector3, HemisphericLight, MeshBuilder } from 'babylonjs';
import nominatim from 'nominatim-browser';

export default class HoroscopeScene extends Scene {
  constructor(engine) {
    super(engine);

    this.camera = new FreeCamera('camera', new Vector3(0, 5, -10), this);
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(engine.getRenderingCanvas());

    this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this);

    this.sphere = MeshBuilder.CreateSphere('sphere', { segments: 12, diameter: 1 }, this);

    nominatim.geocode({ city: 'sao paulo' })
      .then(r => console.log(r))
      .catch(e => console.error(e));
  }
}
