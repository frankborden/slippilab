// SETUP LAYERS
export let bg1: CanvasRenderingContext2D;
export let bg2: CanvasRenderingContext2D;
export let fg1: CanvasRenderingContext2D;
export let fg2: CanvasRenderingContext2D;
export let ui: CanvasRenderingContext2D;
export const c: CanvasRenderingContext2D | undefined = undefined;
export const canvasMain = 0;
const layerSwitches = {
  BG1: true,
  BG2: true,
  FG1: true,
  FG2: true,
  UI: true,
};
export const layers: {
  [layerName in string & keyof typeof layerSwitches]:
    | HTMLCanvasElement
    | undefined;
} = {
  BG1: undefined,
  BG2: undefined,
  FG1: undefined,
  FG2: undefined,
  UI: undefined,
};

export function clearScreen() {
  bg2.clearRect(0, 0, layers.BG2!.width, layers.BG2!.height);
  fg2.clearRect(0, 0, layers.FG2!.width, layers.FG2!.height);
  ui.clearRect(0, 0, layers.UI!.width, layers.UI!.height);
}

export function setupLayers() {
  layers.BG1 = document.getElementById(
    'background1Canvas',
  ) as HTMLCanvasElement;
  bg1 = layers.BG1.getContext('2d')!;
  layers.BG2 = document.getElementById(
    'background2Canvas',
  ) as HTMLCanvasElement;
  bg2 = layers.BG2.getContext('2d')!;
  layers.FG1 = document.getElementById(
    'foreground1Canvas',
  ) as HTMLCanvasElement;
  fg1 = layers.FG1.getContext('2d')!;
  layers.FG2 = document.getElementById(
    'foreground2Canvas',
  ) as HTMLCanvasElement;
  fg2 = layers.FG2.getContext('2d')!;
  layers.UI = document.getElementById('uiCanvas') as HTMLCanvasElement;
  ui = layers.UI.getContext('2d')!;
  bg1.fillStyle = 'rgb(0, 0, 0)';
  bg1.fillRect(0, 0, layers.BG1.width, layers.BG1.height);
}

export const renderToMain = function () {
  var keys: (keyof typeof layers)[] = Object.keys(
    layers,
  ) as (keyof typeof layers)[];
  for (var i = 0; i < keys.length; i++) {
    if (layerSwitches[keys[i]]) {
      c!.drawImage(layers[keys[i]]!, 0, 0);
    }
  }
};

export const drawArrayPathCompress = function (
  can: CanvasRenderingContext2D,
  col: string,
  face: number,
  tX: number,
  tY: number,
  path: number[][],
  scaleX: number,
  scaleY: number,
  rotate: number,
  rpX: number,
  rpY: number,
  extra?: () => any,
) {
  can.save();
  if (extra !== undefined) {
    extra();
  }
  can.translate(tX - rpX, tY - rpY);
  can.rotate(rotate);

  can.fillStyle = col;
  can.lineWidth = 3;
  can.strokeStyle = col;
  can.beginPath();
  // for each shape
  if (path !== undefined && path !== null && path.length !== undefined) {
    for (var j = 0; j < path.length; j++) {
      // first 2 numbers are starting vector points
      var x = path[j][0] * scaleX * face + rpX;
      var y = path[j][1] * scaleY + rpY;
      can.moveTo(x, y);
      // starting from index 2, each set of 6 numbers are bezier curve coords
      for (var k = 2; k < path[j].length; k += 6) {
        /*can.bezierCurveTo((path[j][k] * scaleX * face) + rpX, (path[j][k + 1] * scaleY) + rpY, (path[j][k + 2] * scaleX *
                face) + rpX, (path[j][k + 3] * scaleY) + rpY, (path[j][k + 4] * scaleX * face) + rpX, (path[j][k + 5] *
                scaleY) + rpY);*/
        can.lineTo(
          path[j][k] * scaleX * face + rpX,
          path[j][k + 1] * scaleY + rpY,
        );
      }
    }
  }
  can.closePath();
  //can.fill();
  can.stroke();
  can.restore();
};
