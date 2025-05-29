class MockContext2D {
  constructor() {
    this.canvas = new MockCanvas();
    this._fillStyle = '#000000';
    this._strokeStyle = '#000000';
    this._lineWidth = 1;
  }

  // Basic drawing methods
  beginPath() {}
  closePath() {}
  stroke() {}
  fill() {}
  moveTo() {}
  lineTo() {}
  arc() {}
  rect() {}

  // Text methods
  fillText() {}
  strokeText() {}
  measureText() {
    return { width: 0 };
  }

  // Styles
  set fillStyle(value) {
    this._fillStyle = value;
  }
  get fillStyle() {
    return this._fillStyle;
  }
  set strokeStyle(value) {
    this._strokeStyle = value;
  }
  get strokeStyle() {
    return this._strokeStyle;
  }
  set lineWidth(value) {
    this._lineWidth = value;
  }
  get lineWidth() {
    return this._lineWidth;
  }

  // State
  save() {}
  restore() {}
  scale() {}
  rotate() {}
  translate() {}

  // Compositing
  clearRect() {}
  fillRect() {}
  strokeRect() {}
}

class MockCanvas {
  constructor() {
    this.width = 0;
    this.height = 0;
    this.style = {};
  }

  getContext() {
    return new MockContext2D();
  }

  toDataURL() {
    return '';
  }
}

module.exports = MockCanvas;
