import {
  Animation,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from 'babylonjs';
import nominatim from 'nominatim-browser';

export default class HoroscopeScene extends Scene {
  constructor(engine) {
    super(engine);

    this.camera = new ArcRotateCamera('camera', 0, 1.2, 10, Vector3.Zero(), this);
    this.camera.attachControl(engine.getRenderingCanvas());
    this.light = new HemisphericLight('light0', new Vector3(1, 0, 0), this);
    const sun = new Animation('sun', 'direction', 30, Animation.ANIMATIONTYPE_VECTOR3);
    sun.setKeys([
      {
        frame: 0,
        value: new Vector3(1, 0, 0),
        outTangent: new Vector3(0, 0, 1),
      },
      {
        frame: 15,
        value: new Vector3(0, 0, 1),
        outTangent: new Vector3(-1, 0, 0),
      },
      {
        frame: 30,
        value: new Vector3(-1, 0, 0),
        outTangent: new Vector3(0, 0, -1),
      },
      {
        frame: 45,
        value: new Vector3(0, 0, -1),
        outTangent: new Vector3(1, 0, 0),
      },
      {
        frame: 60,
        value: new Vector3(1, 0, 0),
      },
    ]);
    this.beginDirectAnimation(this.light, [sun], 0, 120, true);

    this.earth = MeshBuilder.CreateSphere('earth', {}, this);
    const wireframe = new StandardMaterial('wireframe', this);
    wireframe.wireframe = true;
    const diameter = 5;
    this.celestial = MeshBuilder.CreateSphere('celestial', { diameter }, this);
    this.celestial.material = wireframe;
    this.zodiac = MeshBuilder.CreateCylinder('zodiac', {
      diameter,
      height: 0.5,
      tessellation: 12,
    }, this);
    this.zodiac.material = wireframe;

    nominatim.geocode({ city: 'sao paulo' })
      .then(r => console.log(r))
      .catch(e => console.error(e));
  }
}
