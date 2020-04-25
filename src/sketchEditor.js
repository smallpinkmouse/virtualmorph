
import BallPython from './BallPython';

var bp;
var lastState;

const sketch = (p) => {
  p.setup = function() {
    console.log('setup');
    let canvas = p.createCanvas(700, 200);
    canvas.parent('CanvasEditor');
    p.background(p.color(200, 200, 200));

    bp = new BallPython(p);
    p.redraw(lastState);
  }

  p.redraw = function(state) {
    lastState = state;
    console.log('redraw');
    if (bp === undefined) return;
    //if (state == undefined) return;
    console.log(state);

    bp.PatternNoise = state.distortion;
    bp.initBlotches(state.blotchSize, state.blotchPos);
    bp.setBottomSize(state.bottomSize);
    bp.setDots(state.dots);
    bp.body(0, 0, state.colBody, state.colBodyBack, state.colBodyBelly);
    bp.drawBlotches(state.blotchPos);

//    bp.drawSnake(state.colBody, state.colBodyBelly, state.colEye);
  }

  p.drawSnake = function(target, state) {
    lastState = state;
    bp.drawSnake(target, state);
  }
};

export default sketch;


