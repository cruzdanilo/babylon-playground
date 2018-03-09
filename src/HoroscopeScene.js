import {
  Animation,
  ArcRotateCamera,
  Axis,
  Color3,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  Space,
  StandardMaterial,
  Texture,
  Vector3,
} from 'babylonjs';
import earth from './assets/earth.jpg';

export default class HoroscopeScene extends Scene {
  constructor(engine) {
    super(engine);

    this.camera = new ArcRotateCamera('camera', 0, 1.2, 10, Vector3.Zero(), this);
    this.camera.lowerRadiusLimit = 2;
    this.camera.upperRadiusLimit = 100;
    this.camera.attachControl(engine.getRenderingCanvas());
    this.light = new HemisphericLight('light0', new Vector3(1, 0, 0), this);

    this.earth = MeshBuilder.CreateSphere('earth', {}, this);
    this.earth.material = new StandardMaterial('earth', this);
    this.earth.material.diffuseTexture = new Texture(earth, this);
    this.earth.scaling.x = -1;
    this.earth.scaling.y = -1;

    const radius = 3;
    const width = 0.02;

    this.equator = MeshBuilder.CreateTube('equator', {
      radius,
      path: [new Vector3(0, -width / 2, 0), new Vector3(0, width / 2, 0)],
      sideOrientation: Mesh.DOUBLESIDE,
    }, this);

    this.axis = MeshBuilder.CreateLines('axis', {
      points: [new Vector3(0, -radius, 0), new Vector3(0, radius, 0)],
    }, this);

    for (let i = 0; i < 6; i += 1) {
      const meridian = MeshBuilder.CreateTube(`meridian${0}`, {
        radius,
        path: [new Vector3(0, 0, -width / 2), new Vector3(0, 0, width / 2)],
        sideOrientation: Mesh.DOUBLESIDE,
      }, this);
      meridian.rotate(Axis.Y, i * (Math.PI / 6), Space.LOCAL);
    }

    this.zodiac = MeshBuilder.CreateTube('zodiac', {
      radius,
      path: [new Vector3(0, -0.2, 0), new Vector3(0, 0.2, 0)],
      sideOrientation: Mesh.DOUBLESIDE,
    }, this);
    this.zodiac.rotate(Axis.X, 23.5 * (Math.PI / 180), Space.LOCAL);

    this.sun = MeshBuilder.CreateSphere('sun', { diameter: 0.2 }, this);
    this.sun.parent = this.zodiac;
    this.sun.material = new StandardMaterial('sun', this);
    this.sun.material.diffuseColor = Color3.Yellow();
    const animation = new Animation('sun', 'position', 30, Animation.ANIMATIONTYPE_VECTOR3);
    const keys = [];
    for (let i = 0; i < 12; i += 1) {
      const a = i * (Math.PI / 6);
      keys.push({
        frame: i * 10,
        value: new Vector3(radius * Math.cos(a), 0, radius * Math.sin(a)),
      });
    }
    keys.push({ frame: 120, value: keys[0].value });
    animation.setKeys(keys);
    this.beginDirectAnimation(this.sun, [animation], 0, 120, true);
  }
}
