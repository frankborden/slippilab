export class Vec2D {
  constructor(public x: number, public y: number) {}

  dot(vector: Vec2D) {
    return this.x * vector.x + this.y * vector.y;
  }

  rotate(angle: number) {
    var new_x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
    var new_y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
    this.x = new_x;
    this.y = new_y;
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }
}
