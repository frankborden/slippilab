export interface Layers {
  base: Layer;
  worldSpace: Layer;
  screenSpace: Layer;
}

export interface Layer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

export function setupLayers(canvas: HTMLCanvasElement): Layers {
  const context = canvas.getContext('2d')!;
  const base = { canvas, context };
  const worldSpace = createSubLayer(canvas);
  // move world space origin to center of screen
  worldSpace.context.translate(
    worldSpace.canvas.width / 2,
    worldSpace.canvas.height / 2,
  );
  const screenSpace = createSubLayer(canvas);
  return {
    base,
    worldSpace,
    screenSpace,
  };
}

export function drawToBase(layers: Layers): void {
  layers.base.context.drawImage(layers.worldSpace.canvas, 0, 0);
  layers.base.context.drawImage(layers.screenSpace.canvas, 0, 0);
}

export function clearLayers(layers: Layers): void {
  clearLayer(layers.base);
  clearLayer(layers.worldSpace);
  clearLayer(layers.screenSpace);
  // workaround for GIF background not working
  layers.base.context.save();
  layers.base.context.resetTransform();
  layers.base.context.fillStyle = 'white';
  layers.base.context.fillRect(
    0,
    0,
    layers.base.canvas.width,
    layers.base.canvas.height,
  );
  layers.base.context.restore();
}

function createSubLayer(baseCanvas: HTMLCanvasElement): Layer {
  const canvas = document.createElement('canvas');
  canvas.width = baseCanvas.width;
  canvas.height = baseCanvas.height;
  const context = canvas.getContext('2d')!;
  // Origin = bottom left corner, +x is right, +y is up.
  // Scale needs to be flipped back when drawing text.
  context.translate(0, canvas.height);
  context.scale(1, -1);
  return {
    canvas,
    context,
  };
}

function clearLayer(layer: Layer): void {
  layer.context.save();
  layer.context.resetTransform();
  layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
  layer.context.restore();
}
