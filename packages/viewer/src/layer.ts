export interface Layers {
  base: Layer;
  worldSpace: Layer;
  screenSpace: Layer;
}

export interface Layer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

export const setupLayers = (canvas: HTMLCanvasElement): Layers => {
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
};

export const resizeLayers = (layers: Layers): void => {
  const width = layers.base.canvas.width;
  const height = layers.base.canvas.height;
  layers.screenSpace.canvas.width = width;
  layers.screenSpace.canvas.height = height;
  layers.screenSpace.context.resetTransform();
  layers.screenSpace.context.translate(0, height);
  layers.worldSpace.context.scale(1, -1);
  layers.worldSpace.canvas.width = width;
  layers.worldSpace.canvas.height = height;
  layers.worldSpace.context.resetTransform();
  layers.worldSpace.context.translate(0, height);
  layers.worldSpace.context.scale(1, -1);

  layers.worldSpace.context.translate(width / 2, height / 2);
};

export const drawToBase = (layers: Layers): void => {
  layers.base.context.drawImage(layers.worldSpace.canvas, 0, 0);
  layers.base.context.drawImage(layers.screenSpace.canvas, 0, 0);
};

export const clearLayers = (layers: Layers, isDarkMode: boolean): void => {
  clearLayer(layers.base);
  clearLayer(layers.worldSpace);
  clearLayer(layers.screenSpace);
  layers.base.context.save();
  layers.base.context.resetTransform();
  layers.base.context.fillStyle = isDarkMode ? 'black' : '#EEEEEE';
  layers.base.context.fillRect(
    0,
    0,
    layers.base.canvas.width,
    layers.base.canvas.height,
  );
  layers.base.context.restore();
};

const createSubLayer = (baseCanvas: HTMLCanvasElement): Layer => {
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
};

const clearLayer = (layer: Layer): void => {
  layer.context.save();
  layer.context.resetTransform();
  layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
  layer.context.restore();
};
