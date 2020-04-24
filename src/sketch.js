// ボディカラー１、ボディカラー２
// ブロッチカラー1、ブロッチカラー2
// ストライプカラー１、ストライプカラー2
// 腹カラー
// ストライプ形状
// エイリアンアイ　0..2
// 模様の乱れ強さ
// シュガー

import BallPython from './BallPython';

var bp;
var lastState;

const sketch = (p) => {
  p.setup = function() {
    console.log('setup');
    p.createCanvas(750, 750);
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
    bp.body(30, 50, state.colBody, state.colBodyBack, state.colBodyBelly);
    bp.drawBlotches(state.blotchPos);

//    bp.drawSnake(state.colBody, state.colBodyBelly, state.colEye);
  }

  p.drawSnake = function(state) {
    lastState = state;
    bp.drawSnake(state.colBody, state.colBodyBelly, state.colEye);
  }
};

export default sketch;


