import { Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder } from 'babylonjs';
import nominatim from 'nominatim-browser';

export default class HoroscopeScene extends Scene {
  constructor(engine) {
    super(engine);

    this.camera = new ArcRotateCamera('camera', 0, 1.2, 5, Vector3.Zero(), this);
    this.camera.attachControl(engine.getRenderingCanvas());

    this.light = new HemisphericLight('light0', new Vector3(0, 1, 0), this);

    this.earth = MeshBuilder.CreateSphere('earth', { segments: 12, diameter: 1 }, this);

    nominatim.geocode({ city: 'sao paulo' })
      .then(r => console.log(r))
      .catch(e => console.error(e));
  }
}
