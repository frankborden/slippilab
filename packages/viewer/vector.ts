export class Vector {
  constructor(public x: number, public y: number) {}

  plus(valueOrVector: Vector | number): Vector {
    if (valueOrVector instanceof Vector) {
      return new Vector(this.x + valueOrVector.x, this.y + valueOrVector.y);
    }
    return new Vector(this.x + valueOrVector, this.y + valueOrVector);
  }

  minus(valueOrVector: Vector | number): Vector {
    if (valueOrVector instanceof Vector) {
      return new Vector(this.x - valueOrVector.x, this.y - valueOrVector.y);
    }
    return new Vector(this.x - valueOrVector, this.y - valueOrVector);
  }

  scale(scaleOrVector: number | Vector) {
    if (scaleOrVector instanceof Vector) {
      return new Vector(this.x * scaleOrVector.x, this.y * scaleOrVector.y);
    }
    return new Vector(this.x * scaleOrVector, this.y * scaleOrVector);
  }

  inverse(): Vector {
    return new Vector(1 / this.x, 1 / this.y);
  }

  size(): number {
    return Math.sqrt(this.x * this.x + this.y + this.y);
  }

  average(...others: Vector[]): Vector {
    let total: Vector = this;
    for (const other of others) {
      total = total.plus(other);
    }
    return total.scale(1 / (others.length + 1));
  }

  min(other: Vector): Vector {
    return new Vector(Math.min(this.x, other.x), Math.min(this.y, other.y));
  }
  max(other: Vector): Vector {
    return new Vector(Math.max(this.x, other.x), Math.max(this.y, other.y));
  }

  getMin(): number {
    return Math.min(this.x, this.y);
  }

  getMax(): number {
    return Math.max(this.x, this.y);
  }
}
