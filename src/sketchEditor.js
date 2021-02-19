
import BallPython from './BallPython';

var bp;
var lastState;

const sketch = (p) => {
  p.setup = function() {
    let canvas = p.createCanvas(700, 200);
    canvas.parent('CanvasEditor');
    p.background(p.color(200, 200, 200));

    bp = new BallPython(p);
    p.redraw(lastState);
  }

  p.redraw = function(state) {
    lastState = state;
    if (bp === undefined) return;
    if (state === undefined) return;

    bp.PatternNoise = state.distortion;
    bp.initBlotches(state.blotchSize, state.bottomSize * 2, state.blotchPos);
    bp.setDots(state.dots);
    bp.drawBody(0, 0, state.colBody, state.colBodyBack, state.colBodyBelly);
    bp.drawBlotches(state);
    bp.drawDorsal(state);
    bp.drawPied(state);
  }

  p.drawSnake = function(target, state) {
    lastState = state;
    bp.drawSnake(target, state);
  }
};

export default sketch;


