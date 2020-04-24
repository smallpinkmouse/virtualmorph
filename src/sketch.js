// ボディカラー１、ボディカラー２
// ブロッチカラー1、ブロッチカラー2
// ストライプカラー１、ストライプカラー2
// 腹カラー
// ストライプ形状
// エイリアンアイ　0..2
// 模様の乱れ強さ
// シュガー


var g_x;
var g_timer;

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
    bp.drawSnake2(state.colBody, state.colBodyBelly, state.colEye);
  }
};

export default sketch;


/////////////////////////////////////////////////////////
import pnoise from './perlin';

class Blotch {
  constructor(p5, x, y) {
    this.p5 = p5;
    this.x = x;
    this.y = y;
    this.size = 20;
    this.bottomSize = 0.5; // 0.1 ... 1.0;

    this.dots = [];
  }

  addDot(x, y, size) {
    this.dots.push({x:x, y:y, size:size});
  }

  lerp(s, e, p) {
    return s + (e - s) * p;
  }

  drawPixel(x0, y0, h, x, y, col1, col2, dotCol1, noise) {
    let p5 = this.p5;
    let col;
    let dist = this.distance(x, y, noise);
    if (dist < this.size) {
      // inner blotches
      let innerDots = false;
      for (let i = 0; i < this.dots.length; i++) {
        if (dist < this.dots[i].size) {
          innerDots = true;
          break;
        }
      }
      if (innerDots) {
        col = dotCol1;
      } else {
        col = col1;
      }

    } else if (y > this.y) {
      // blotch stem
      let rate = (h - y) / (h - this.y);
      dist = this.distanceX(x, y, noise, rate);

      dist = this.lerp(dist, dist * dist, 1 - rate);

      if (dist < this.size) {
        col = col1;
      } else if (dist < this.size + 13) {
        let rate = Math.pow((dist - this.size) / 13, 0.5);
        col = p5.lerpColor(col1, col2, rate);
        col = p5.color(p5.red(col), p5.blue(col), p5.green(col), Math.min(500 * (1 - rate), 255));
      } else {
        return;
      }

    } else if (dist < this.size + 13) {
      // outline blotches
      let rate = Math.pow((dist - this.size) / 13, 0.5);
      col = p5.lerpColor(col1, col2, rate);
      col = p5.color(p5.red(col), p5.blue(col), p5.green(col), Math.min(500 * (1 - rate), 255));

    } else {
      // body base color
      return;
    }
    p5.stroke(col);
    p5.strokeWeight(1);
    p5.point(x0 + x, y0 + y);
  }

  distance(x, y, noise) {
    let offset = pnoise.perlin2(x / 50, y / 50) * noise;
    let nearestDist = 99999;
    if (this.dots.length === 0) {
      return Math.sqrt(Math.pow(x - this.x, 2) * 0.4 + Math.pow(y - this.y, 2)) + offset;
    }
    for (let i = 0; i < this.dots.length; i++) {
      let dist = Math.sqrt(Math.pow(x - (this.x + this.dots[i].x), 2) * 0.4 + Math.pow(y - (this.y + this.dots[i].y), 2)) + offset;
      if (dist < nearestDist) {
        nearestDist = dist;
      }
    }
    return nearestDist;
  }

  distanceX(x, y, noise, rate) {
    let offset = pnoise.perlin2(x / 50, y / 50) * noise;
    let nearestDist = 99999;
    if (this.dots.length === 0) {
      return Math.sqrt(Math.pow(x - this.x, 2) * 0.4) + offset;
    }
    for (let i = 0; i < this.dots.length; i++) {
      let dist = Math.sqrt(Math.pow(x - (this.x + this.dots[i].x * rate), 2) * 0.4) + offset;
      if (dist < nearestDist) {
        nearestDist = dist;
      }
    }
    return nearestDist;
  }

  getColor(dist, col0, col1) {
    for (let i = 0; i < this.dots.length; i++) {
      if (dist < this.dots[i].size) {
        return col1;
      } else if (dist < this.dots[i].size + 5) {
        let rate = (dist - this.dots[i].size) / 5;
        return this.p5.lerpColor(col1, col0, rate);
      }
    }
    return col0;
  }
}


///////////////////////////////////////////////
class BallPython {
  constructor(p5) {
    this.p5 = p5;
    this.strokeColor = p5.color(10, 10, 10);
    this.bodyColor1 = p5.color(150, 90, 90);
    this.bodyColor2 = p5.color(30, 10, 10);
    this.alienFaceColor1 = p5.color(180, 130, 110);
    this.alienFaceColor2 = p5.color(10, 3, 3);
    this.blotchDotColor = p5.color(10, 3, 3, 100);
    this.scale = 1;
    this.x = 0;
    this.y = 0;
    this.bodyLength = 700;
    this.bodyHeight = 200;

    this.PatternNoise = 10;

    this.numBlotches = 5;
    this.blotches = [];
    this.initBlotches(20, 0);

    this.numDots = 2;
    this.setDots(this.numDots);
  }

  setDots(numDots) {
    this.numDots = numDots;
    for (let i = 0; i < this.blotches.length; i++) {
      this.blotches[i].dots = [];
      switch (this.numDots) {
        case 0:
          break;
        case 1:
          this.blotches[i].addDot(0, 0, 15);
          break;
        case 2:
          this.blotches[i].addDot(-30, 0, 10);
          this.blotches[i].addDot( 30, 0, 10);
          break;
        default:
          break;
      }
    }    
  }

  initBlotches(size, pos) {
    console.log(pos);
    if (size === 0) {
      this.blotches.length = 0;
      return;
    } else if (this.blotches.length === 0) {
      this.blotches = new Array(this.numBlotches);
      for (let i = 0; i < this.numBlotches; i++) {
        this.blotches[i] = new Blotch(this.p5, this.bodyLength * this.scale / this.numBlotches * (i + 0.5), this.bodyHeight * this.scale * 0.5 - pos);
      }      
    }
    for (let i = 0; i < this.blotches.length; i++) {
      this.blotches[i].size = size;
      this.blotches[i].y = this.bodyHeight * this.scale * 0.5 - pos;
    }
  }

  setBottomSize(size) {
    for (let i = 0; i < this.blotches.length; i++) {
      this.blotches[i].bottomSize = 1.1 - size * 2;
    }
  }

  distance(x0, y0, x1, y1, size, cnst) {
    let offset = pnoise.perlin2(x0 / 50, y0 / 50) * this.PatternNoise;

    if (y0 > y1) {
      return Math.max(
        Math.sqrt(Math.pow(x0 - x1, 2)) + Math.sin((y0 - y1) / y1 * cnst) * size,
        Math.sqrt(Math.pow(x0 - x1, 2))) + offset;
    }
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2)) + offset;
  }

  drawBlotches() {
    if (this.blotches.length === 0) return;
    let width = this.bodyLength * this.scale;
    let height = this.bodyHeight * this.scale;
    let blotchInterval = this.bodyLength * this.scale / this.numBlotches;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let nearestBlotch = Math.floor(x / blotchInterval);
        let bl = this.blotches[nearestBlotch];
        bl.drawPixel(this.x, this.y, this.bodyHeight, x, y, this.alienFaceColor1, this.alienFaceColor2, this.blotchDotColor, this.PatternNoise);


        // let nearestDist = this.blotches[nearestBlotch].distance(x, y, this.PatternNoise);

        // if (nearestDist < this.blotches[nearestBlotch].size) {
        //   // inner blotches
        //   let col = this.blotches[nearestBlotch].getColor(nearestDist, this.alienFaceColor1, this.blotchDotColor);
        //   p5.stroke(col);
        //   p5.strokeWeight(1);
        //   p5.point(this.x + x, this.y + y);

        // } else if (nearestDist < this.blotches[nearestBlotch].size + 20) {
        //   // outline blotches
        //   let rate = (nearestDist - this.blotches[nearestBlotch].size) / 20;
        //   let col = p5.lerpColor(this.alienFaceColor1, this.alienFaceColor2, rate);
        //   col = p5.color(p5.red(col), p5.blue(col), p5.green(col), 55 + 200 * (1 - rate));
        //   p5.stroke(col);
        //   p5.strokeWeight(1);
        //   p5.point(this.x + x, this.y + y);          
        // }


      }
    }
  }

  body(x, y, mainColorCode, backColorCode, bellyColorCode) {
    let p5 = this.p5;

    p5.erase();
    p5.rect(0, 0, 1000, 350);
    p5.noErase();

    let colMain = p5.color(mainColorCode);
    let colBack = p5.color(backColorCode);
    let colBelly = p5.color(bellyColorCode);
    this.x = x;
    this.y = y;
    let to = this.bodyHeight * this.scale / 2;
    for (let i = 0; i < to; i++) {
      let col = p5.lerpColor(colBack, colMain, i / to);
      p5.stroke(col);
      p5.line(x, y + i, x + this.bodyLength * this.scale, y + i);
    }
    for (let i = 0; i < to; i++) {
      let col = p5.lerpColor(colMain, colBelly, i / to);
      p5.stroke(col);
      p5.line(x, y + to + i, x + this.bodyLength * this.scale, y + to + i);
    }
  }

  lerp(s, e, p) {
    return s + (e - s) * p;
  }

  drawSnake(col1, col2, colEye) {
    let p5 = this.p5;

    // p5.strokeWeight(3);
    // p5.stroke(p5.color(255,255,0));
    // p5.line(this.x, this.y, this.x + this.bodyLength, this.y);

    p5.erase();
    p5.rect(0, 350, 1000, 400);
    p5.noErase();

    let px;
    let py;
    let py0;
    let theta1;

    p5.noStroke();
    p5.fill(col1);
    p5.rect(this.x, this.y, this.bodyLength, 5);


    for (let x = 0; x < this.bodyLength; x++) {
      theta1 = (Math.PI * 3.0 * x / this.bodyLength + Math.PI * 0.1) * 1.2;
      let rate = Math.max((this.bodyLength - x) / this.bodyLength, 0.3);
      let rate3 = x / this.bodyLength;

      document.querySelector('#progress').textContent = 'calculating...';

      let rate2 = (rate3 > 0.7) ? this.lerp(1, 0.8, (rate3 - 0.7) / 0.3) : 1;
//      let rate2 = (rate3 > 0.7) ? 0.5 : 1;

      let tail = (rate3 < 0.4) ? this.lerp(0, 1, rate3 / 0.4) : 1;
      let neck = (rate3 > 0.8) ? this.lerp(0, 1, rate3 / 0.8) : 1;

//      for (let y = 0; y < 125; y++) {
      for (let y = 0; y < this.bodyHeight; y++) {
        let theta2 = Math.PI * y / this.bodyHeight;
        // let px = 50 + Math.sin(theta2) * 30 + x + Math.sin(theta1) * 50;
        // let py = 400 - Math.cos(theta2) * 50 + Math.cos(theta1) * 100;
        px = 410 + Math.sin(theta1) * 0.35 * (x + y * 2 * tail + 500) * rate + 0 + 0 * (1 - tail) - 50 + 50 * neck;
        py = 500 + Math.cos(theta1) * 0.8 * (y * tail + 150) * rate + 50 - 50 * tail + 200 - 200 * neck;

        if (y === 0) {
          if (Math.cos(theta1) < 0) {
            let shadow = p5.color(0, 0, 0, 30);
            p5.strokeWeight(8);
            p5.stroke(shadow);
            p5.line(px, py, px, py + 10);
          }
        }

//        let gy = Math.abs((Math.cos(theta1 / 2) - 0.5)) * y * 0.8;
        let gy = Math.abs(-Math.sin(theta1 / 3 - ((1-rate2) * 5)) * 80 + y / 2  + 10 + Math.cos(theta1) * 40);
//        let gy = y;

//        let col = p5.get(this.x + (x * 5 * rate2) % this.bodyLength, this.y + gy);
        let col = p5.get(this.x + (x * 5 * rate2) % this.bodyLength, this.y + gy);

        p5.strokeWeight(4);
        p5.stroke(col);
        p5.point(px, py);

      }

      if (Math.cos(theta1) > 0) {
        let shadow = p5.color(0, 0, 0, 30);
        p5.strokeWeight(8);
        p5.stroke(shadow);
        p5.line(px, py, px, py + 10);          
      }
    }

    let hx = 370;
    let hy = 500;

    console.log(col1);
    console.log(col2);
    let bcol = p5.lerpColor(p5.color(col1), p5.color(col2), 0.6);

    let scol = p5.lerpColor(p5.color(col1), p5.color(0), 0.2);

    p5.noStroke();

    p5.push();
    p5.translate(hx, hy);
    p5.rotate(p5.PI / 10);

    // shadow
    p5.push();
    p5.translate(-15, 15);
    p5.rotate(-0.2);
    p5.fill(0, 0, 0, 80);
    p5.ellipse(0, 0, 128, 55);
    p5.pop();

    // back head
//    p5.fill('blue');
    p5.fill(scol);
    p5.fill(p5.color(0, 0, 0, 100));
    p5.arc(-35-8, 10-2, 100+2, 100, p5.PI, 0);
    p5.fill(bcol);
    p5.arc(-35, 10, 100, 100, p5.PI, 0);
    p5.quad(-20, -30,    45, -15,   35, 0,   -40, 0);

    // front head
    p5.noStroke();
//    p5.ellipse(0, 0, 100, 45);
  //  p5.fill('yellow');
    p5.fill(col1);
    p5.ellipse(35, -7, 23, 23);
    p5.ellipse(35, -5, 23, 23);

    //p5.fill('green');
    p5.fill(scol);
    p5.arc(5, -8, 80, 80, 0, p5.PI);
    p5.fill(col1);
    p5.arc(5, -8-3, 80, 80, 0, p5.PI);
    //p5.fill('red');
//    p5.fill(scol);
//    p5.ellipse(-55, 5, 65, 65);
    p5.fill(col1);
    p5.ellipse(-55, 5, 65, 65-2);

    p5.fill(scol);
    p5.quad(-20, -30,    45, -15,   25, 25,   -40, 35);
    p5.fill(col1);
    p5.quad(-20, -30,    45, -15,   25, 25-3,   -40, 35-3);


    p5.fill(bcol);
//    p5.fill('blue');
//    p5.quad(-60, -30,    45, -15,   35, -10,   -80, -10);

    p5.beginShape();
    p5.vertex(-60, -30);
    p5.vertex(-20, -30);
    p5.vertex( 45, -15);
    p5.vertex( 48, -8);
    p5.vertex( 38, -0);
    p5.vertex( 25, -5);
    p5.vertex( -3, -2);
    p5.vertex( -15, -8);
    p5.vertex( -60, -3);
    p5.vertex( -70, -0);
    p5.vertex( -75, 15);
    p5.vertex( -88, 13);
    p5.vertex( -88, -10);
    p5.vertex(-85, -20);
    p5.endShape();
  
    p5.beginShape();
    p5.vertex(-65, 10);
    p5.vertex(-35, 0);
    p5.vertex(-5, 5);
    p5.vertex( 0, 5);
    p5.vertex(40, -5);
    p5.vertex(42, 5);
    p5.vertex(35, 10);
    p5.vertex(25, 15);
    p5.vertex(-35, 10);
    p5.vertex(-55, 25);

//    p5.vertex(-30, 10);

    p5.vertex(-65, 20);
    p5.endShape();



    p5.pop();

    // // eyes
    p5.fill(colEye);
    p5.ellipse(hx - 20, hy + 0, 15, 15);
    p5.fill(100, 100, 100);
    p5.ellipse(hx - 20 - 0, hy + 0 - 3, 8, 8);

  }



  drawSnake2(col1, col2, colEye) {
    let p5 = this.p5;

    // p5.strokeWeight(3);
    // p5.stroke(p5.color(255,255,0));
    // p5.line(this.x, this.y, this.x + this.bodyLength, this.y);

    p5.noStroke();
    p5.fill('white');
    p5.rect(0, 300, 1000, 500);

    document.querySelector('#progress').textContent = 'calculating...';

    g_x = 0;
    g_timer = setInterval(()=> {
      let x = g_x;
      if (x >= this.bodyLength) {
        clearInterval(g_timer);

        p5.push();
        p5.translate(410, 463);
        p5.rotate(p5.PI / 30);
        p5.strokeWeight(2);
        p5.stroke(p5.color(0, 0, 0, 80));
        p5.noFill();
        p5.arc(0, 0, 280, 100, p5.PI + 0.3, -0.3);
        p5.pop();

        this.drawHead(col1, col2, colEye);
        document.querySelector('#progress').textContent = '100%';
        return;
      }

      let px;
      let py;
      let py0;
      let theta1;

      theta1 = (Math.PI * 3.0 * x / this.bodyLength + Math.PI * 0.1) * 1.2;
      let rate = Math.max((this.bodyLength - x) / this.bodyLength, 0.3);
      let rate3 = x / this.bodyLength;

      document.querySelector('#progress').textContent = Math.floor(rate3 * 100) + '%';


      let rate2 = (rate3 > 0.7) ? this.lerp(1, 0.8, (rate3 - 0.7) / 0.3) : 1;
//      let rate2 = (rate3 > 0.7) ? 0.5 : 1;

      let tail = (rate3 < 0.4) ? this.lerp(0, 1, rate3 / 0.4) : 1;
      let neck = (rate3 > 0.8) ? this.lerp(0, 1, rate3 / 0.8) : 1;

//      for (let y = 0; y < 125; y++) {
      for (let y = 0; y < this.bodyHeight; y++) {
        let theta2 = Math.PI * y / this.bodyHeight;
        // let px = 50 + Math.sin(theta2) * 30 + x + Math.sin(theta1) * 50;
        // let py = 400 - Math.cos(theta2) * 50 + Math.cos(theta1) * 100;
        px = 410 + Math.sin(theta1) * 0.35 * (x + y * 2 * tail + 500) * rate + 0 + 0 * (1 - tail) - 50 + 50 * neck;
        py = 500 + Math.cos(theta1) * 0.8 * (y * tail + 150) * rate + 50 - 50 * tail + 200 - 200 * neck;

        if (y === 0) {
          if (Math.cos(theta1) < 0) {
            let shadow = p5.color(0, 0, 0, 30);
            p5.strokeWeight(4);
            p5.stroke(shadow);
            p5.line(px, py, px, py + 10);
          }
        }

//        let gy = Math.abs(-Math.sin(theta1 / 3 - ((1-rate2) * 5)) * 80 + y * 0.5  + 10 + Math.cos(theta1) * 40);
//        let gy = Math.abs(-Math.sin(theta1 / 3 - ((1-rate2) * 20)) * 90 + y * 0.7  - 10 + Math.cos(theta1) * 50);
        let gy = Math.abs(-Math.sin(theta1 / 3 - (1-rate2) * 20) * 90 + y * 0.9  - 10 + Math.cos(theta1) * 70);

        let col = p5.get(this.x + (x * 5 * rate2) % this.bodyLength, this.y + gy + 0.5);

        p5.strokeWeight(5);
        p5.stroke(col);
        p5.point(px, py);
      }

      if (Math.cos(theta1) > 0) {
        let shadow = p5.color(0, 0, 0, 30);
        p5.strokeWeight(4);
        p5.stroke(shadow);
        p5.line(px, py, px, py + 10);          
      }

      g_x = x + 1;
    }, 10);
  }

  drawHead(col1, col2, colEye) {
    let p5 = this.p5;
    let hx = 370;
    let hy = 500;

    console.log(col1);
    console.log(col2);
    let bcol = p5.lerpColor(p5.color(col1), p5.color(col2), 0.6);

    let scol = p5.lerpColor(p5.color(col1), p5.color(0), 0.2);

    p5.noStroke();

    p5.push();
    p5.translate(hx, hy);
    p5.rotate(p5.PI / 10);

    // shadow
    p5.push();
    p5.translate(-15, 15);
    p5.rotate(-0.2);
    p5.fill(0, 0, 0, 80);
    p5.ellipse(0, 0, 128, 55);
    p5.pop();

    // back head
//    p5.fill('blue');
    p5.fill(scol);
    p5.fill(p5.color(0, 0, 0, 100));
    p5.arc(-35-8, 10-2, 100+2, 100, p5.PI, 0);
    p5.fill(bcol);
    p5.arc(-35, 10, 100, 100, p5.PI, 0);
    p5.quad(-20, -30,    45, -15,   35, 0,   -40, 0);

    // front head
    p5.noStroke();
//    p5.ellipse(0, 0, 100, 45);
  //  p5.fill('yellow');
    p5.fill(col1);
    p5.ellipse(35, -7, 23, 23);
    p5.ellipse(35, -5, 23, 23);

    //p5.fill('green');
    p5.fill(scol);
    p5.arc(5, -8, 80, 80, 0, p5.PI);
    p5.fill(col1);
    p5.arc(5, -8-3, 80, 80, 0, p5.PI);
    //p5.fill('red');
//    p5.fill(scol);
//    p5.ellipse(-55, 5, 65, 65);
    p5.fill(col1);
    p5.ellipse(-55, 5, 65, 65-2);

    p5.fill(scol);
    p5.quad(-20, -30,    45, -15,   25, 25,   -40, 35);
    p5.fill(col1);
    p5.quad(-20, -30,    45, -15,   25, 25-3,   -40, 35-3);


    p5.fill(bcol);
//    p5.fill('blue');
//    p5.quad(-60, -30,    45, -15,   35, -10,   -80, -10);

    p5.beginShape();
    p5.vertex(-60, -30);
    p5.vertex(-20, -30);
    p5.vertex( 45, -15);
    p5.vertex( 48, -8);
    p5.vertex( 38, -0);
    p5.vertex( 25, -5);
    p5.vertex( -3, -2);
    p5.vertex( -15, -8);
    p5.vertex( -60, -3);
    p5.vertex( -70, -0);
    p5.vertex( -75, 15);
    p5.vertex( -88, 13);
    p5.vertex( -88, -10);
    p5.vertex(-85, -20);
    p5.endShape();
  
    p5.beginShape();
    p5.vertex(-65, 10);
    p5.vertex(-35, 0);
    p5.vertex(-5, 5);
    p5.vertex( 0, 5);
    p5.vertex(40, -5);
    p5.vertex(42, 5);
    p5.vertex(35, 10);
    p5.vertex(25, 15);
    p5.vertex(-35, 10);
    p5.vertex(-55, 25);

//    p5.vertex(-30, 10);

    p5.vertex(-65, 20);
    p5.endShape();



    p5.pop();

    // // eyes
    p5.fill(colEye);
    p5.ellipse(hx - 20, hy + 0, 15, 15);
    p5.fill(100, 100, 100);
    p5.ellipse(hx - 20 - 0, hy + 0 - 3, 8, 8);

  }



}
