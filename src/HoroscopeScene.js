import {
  Animation,
  ArcRotateCamera,
  Axis,
  Color3,
  Color4,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Quaternion,
  Scene,
  Space,
  StandardMaterial,
  Texture,
  Vector3,
} from 'babylonjs';
import { AdvancedDynamicTexture, Control, InputText } from 'babylonjs-gui';
import { geocode } from 'nominatim-browser';
import earth from './assets/earth.jpg';

export default class HoroscopeScene extends Scene {
  constructor(engine) {
    super(engine);

    this.camera = new ArcRotateCamera('camera', 0, 1.2, 10, Vector3.Zero(), this);
    this.camera.lowerRadiusLimit = 2;
    this.camera.upperRadiusLimit = 100;
    this.camera.panningSensibility = 0;
    this.camera.attachControl(engine.getRenderingCanvas());
    this.light = new HemisphericLight('light0', new Vector3(1, 0, 0), this);

    this.earth = MeshBuilder.CreateSphere('earth', {}, this);
    this.earth.material = new StandardMaterial('earth', this);
    this.earth.material.diffuseTexture = new Texture(earth, this);
    this.earth.scaling.x = -1;
    this.earth.scaling.y = -1;

    const radius = 3;
    const thickness = 0.025;
    const tessellation = 64;

    this.axis = MeshBuilder.CreateLines('axis', {
      points: [new Vector3(0, -radius, 0), new Vector3(0, radius, 0)],
    }, this);

    let count = 6;
    for (let i = 0; i < count; i += 1) {
      const meridian = MeshBuilder.CreateTorus(`meridian${0}`, {
        diameter: 2 * radius,
        thickness,
        tessellation,
      }, this);
      meridian.rotationQuaternion = Quaternion.RotationYawPitchRoll(
        i * (Math.PI / count),
        0,
        Math.PI / 2,
      );
    }

    count = 7;
    for (let i = 0; i < count; i += 1) {
      const a = (i + 0.5) * (Math.PI / count);
      const parallel = MeshBuilder.CreateTorus(`parallel${0}`, {
        diameter: 2 * radius * Math.sin(a),
        thickness,
        tessellation,
      }, this);
      parallel.position.y = radius * Math.cos(a);
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

    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');
    const input = new InputText();
    input.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    input.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    input.width = 0.5;
    input.maxWidth = 0.5;
    input.height = '32px';
    input.text = 'bauru, sp, brasil';
    input.color = 'white';
    input.onBlurObservable.add(x => geocode({ q: x.text })
      .then((r) => {
        if (!r || !r.length) return;
        if (!this.zenith) {
          const color = new Color4(1, 0, 0, 1);
          this.zenith = MeshBuilder.CreateLines('zenith', {
            points: [new Vector3(0, 0, 0), new Vector3(radius, 0, 0)],
            colors: [color, color],
          }, this);
        }
        this.zenith.rotationQuaternion = Quaternion.RotationYawPitchRoll(
          -Number(r[0].lon) * (Math.PI / 180),
          0,
          Number(r[0].lat) * (Math.PI / 180),
        );
      }));
    advancedTexture.addControl(input);
    input.onBlurObservable.notifyObservers(input);
  }
}
