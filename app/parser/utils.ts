export const firstVersion = "0.1.0.0";

export function readUint(
  rawData: DataView,
  size: 8 | 16 | 32,
  replayVersion: string,
  firstVersionPresent: string,
  offset: number,
): number {
  if (!isInVersion(replayVersion, firstVersionPresent)) {
    // @ts-expect-error
    return undefined;
  }
  switch (size) {
    case 8:
      return rawData.getUint8(offset);
    case 16:
      return rawData.getUint16(offset);
    case 32:
      return rawData.getUint32(offset);
  }
}

export function readFloat(
  rawData: DataView,
  size: 32 | 64,
  replayVersion: string,
  firstVersionPresent: string,
  offset: number,
): number {
  if (!isInVersion(replayVersion, firstVersionPresent)) {
    // @ts-expect-error
    return undefined;
  }
  switch (size) {
    case 32:
      return rawData.getFloat32(offset);
    case 64:
      return rawData.getFloat64(offset);
  }
}

export function readInt(
  rawData: DataView,
  size: 8 | 16 | 32,
  replayVersion: string,
  firstVersionPresent: string,
  offset: number,
): number {
  if (!isInVersion(replayVersion, firstVersionPresent)) {
    // @ts-expect-error
    return undefined;
  }
  switch (size) {
    case 8:
      return rawData.getInt8(offset);
    case 16:
      return rawData.getInt16(offset);
    case 32:
      return rawData.getInt32(offset);
  }
}

export function readShiftJisString(
  rawData: DataView,
  replayVersion: string,
  firstVersionPresent: string,
  offset: number,
  maxLength: number,
): string {
  if (!isInVersion(replayVersion, firstVersionPresent)) {
    // @ts-expect-error
    return undefined;
  }
  const shiftJisBytes = new Uint8Array(maxLength);
  let charNum = 0;
  do {
    shiftJisBytes[charNum] = rawData.getUint8(offset + charNum * 0x01);
    charNum++;
  } while (charNum < maxLength && shiftJisBytes[charNum - 1] !== 0x00);
  if (shiftJisBytes[0] !== 0x00) {
    const decoder = new TextDecoder("shift-jis");
    return toHalfWidth(decoder.decode(shiftJisBytes.subarray(0, charNum - 1)));
  }
  // @ts-expect-error
  return undefined;
}

function isInVersion(
  replayVersion: string,
  firstVersionPresent: string,
): boolean {
  const replayVersionParts = replayVersion.split(".");
  const firstVersionParts = firstVersionPresent.split(".");
  for (let i = 0; i < replayVersionParts.length; i++) {
    const replayVersionPart = parseInt(replayVersionParts[i]);
    const firstVersionPart = parseInt(firstVersionParts[i]);
    if (replayVersionPart > firstVersionPart) return true;
    if (replayVersionPart < firstVersionPart) return false;
  }
  return true;
}

function toHalfWidth(s: string): string {
  return s.replace(/[！-～]/g, function (r) {
    return String.fromCharCode(r.charCodeAt(0) - 0xfee0);
  });
}
