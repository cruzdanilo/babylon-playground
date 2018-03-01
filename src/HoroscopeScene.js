import {
  Animation,
  ArcRotateCamera,
  Axis,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  Space,
  StandardMaterial,
  Vector3,
} from 'babylonjs';
import nominatim from 'nominatim-browser';

export default class HoroscopeScene extends Scene {
  constructor(engine) {
    super(engine);

    this.camera = new ArcRotateCamera('camera', 0, 1.2, 10, Vector3.Zero(), this);
    this.camera.lowerRadiusLimit = 2;
    this.camera.upperRadiusLimit = 100;
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
    const radius = 3;
    const wireframe = new StandardMaterial('wireframe', this);
    wireframe.wireframe = true;
    this.equator = MeshBuilder.CreateCylinder('equator', {
      diameter: radius * 2,
      height: 0.001,
    }, this);
    this.equator.parent = this.earth;
    this.equator.material = wireframe;
    this.axis = MeshBuilder.CreateLines('axis', {
      points: [new Vector3(0, -radius, 0), new Vector3(0, radius, 0)],
    }, this);
    this.axis.parent = this.earth;
    this.zodiac = MeshBuilder.CreateTube('zodiac', {
      radius,
      path: [new Vector3(0, -0.2, 0), new Vector3(0, 0.2, 0)],
      sideOrientation: Mesh.DOUBLESIDE,
    }, this);
    this.zodiac.rotate(Axis.X, 23.5 * (Math.PI / 180), Space.LOCAL);

    nominatim.geocode({ city: 'sao paulo' })
      .then(r => console.log(r))
      .catch(e => console.error(e));
  }
}
