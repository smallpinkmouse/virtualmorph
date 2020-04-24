
const sketch = (p) => {
  p.setup = function() {
    let canvas = p.createCanvas(500, 500);
    canvas.parent('CanvasRender');

    p.background(p.color(250, 100, 100));
  }

  p.draw = function() {
  }
};

export default sketch;


