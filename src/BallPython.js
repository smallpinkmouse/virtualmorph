import pnoise from './perlin';

var g_x;
var g_timer;

class Blotch {
  constructor(p5, x, y) {
    this.p5 = p5;
    this.x = x;
    this.y = y;
    this.size = 20;
    this.bottomSize = 10;

    this.dots = [];
  }

  addDot(x, y, size) {
    this.dots.push({x:x, y:y, size:size});
  }

  lerp(s, e, p) {
    return s + (e - s) * p;
  }

  drawPixel(x0, y0, h, x, y, blotchColor, bellyColor, outlineColor, dotColor, noise) {

    let size = this.size;
    if (this.dots.length < 2) {
      size *= 2;
    } 

    let p5 = this.p5;
    let col;
    let dist = this.distance(x, y, noise);
    if (dist < size) {
      // inner blotches
      let innerDots = false;
      for (let i = 0; i < this.dots.length; i++) {
        if (dist < this.dots[i].size) {
          // inner dots
          innerDots = true;
          break;
        }
      }
      if (innerDots) {
        col = dotColor;
      } else {
        col = blotchColor;
      }

    } else if (y > this.y) {
      // blotch stem
      let stemRate = (h - y) / (h - this.y);
      dist = this.distanceX(x, y, noise, stemRate);

      let stemSize = this.lerp(this.bottomSize, this.size * 2, stemRate);

      if (dist < stemSize) {
        if (0.3 + p5.random() * 0.4 <stemRate) {
          col = blotchColor;
        } else {
          col = bellyColor;
        }

//        col = blotchColor;
//        col = p5.lerpColor(bellyColor, blotchColor, 0.5 + stemRate / 2);



      } else if (dist < stemSize + 5) {
        let rate = Math.pow((dist - stemSize) / 5, 0.5);
        if (0.3 + p5.random() * 0.4 <stemRate) {
          col = blotchColor;
        } else {
          col = bellyColor;
        }
        col = p5.lerpColor(col, outlineColor, rate);
      } else {
        // body base color
        return;
      }

    } else if (dist < size + 5) {
      // outline blotches
      let rate = Math.pow((dist - size) / 5, 0.5);
      col = p5.lerpColor(blotchColor, outlineColor, rate);

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
//    let offset = (this.p5.noise(x / 50, y / 50) - 0.5) * noise * 2;
    let nearestDist = 99999;
    if (this.dots.length < 2) {
      let dist = Math.sqrt(Math.pow(x - this.x, 2) * 0.4 + Math.pow(y - this.y, 2));
      if (this.y - y > 20) {
        dist += (this.y - y - 20);
      }
      return dist + offset;

    } else {
      for (let i = 0; i < this.dots.length; i++) {
        let dist = Math.sqrt(Math.pow(x - (this.x + this.dots[i].x), 2) * 0.4 + Math.pow(y - (this.y + this.dots[i].y), 2)) + offset;
        if (dist < nearestDist) {
          nearestDist = dist;
        }
      }
      let centerDist = Math.sqrt(Math.pow(x - this.x, 2) * 0.4 + Math.pow(y - this.y, 2)) + offset;
      nearestDist = (nearestDist + centerDist / 2) / 2;
    }
    return nearestDist;
  }

  distanceX(x, y, noise, rate) {
    let offset = pnoise.perlin2(x / 50, y / 50) * noise;
//    let offset = (this.p5.noise(x / 50, y / 50) - 0.5) * noise * 2;
    return Math.sqrt(Math.pow(x - this.x, 2) * 0.4) + offset;
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

    this.rendering = false;

    this.numDots = 2;
    this.setDots(this.numDots);
  }

  setDots(numDots) {
    this.numDots = numDots;
    for (let i = 0; i < this.blotches.length; i++) {
      this.blotches[i].dots = [];
      let bsize = this.blotches[i].size;
      switch (this.numDots) {
        case 0:
          break;
        case 1:
          this.blotches[i].addDot(0, 0, bsize * 0.8);
          break;
        case 2:
          this.blotches[i].addDot(-bsize * 1.5, 0, bsize * 0.45);
          this.blotches[i].addDot( bsize * 1.5, 0, bsize * 0.45);
          break;
        default:
          break;
      }
    }    
  }

  initBlotches(size, bottomSize, pos) {
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
      this.blotches[i].bottomSize = bottomSize;
      this.blotches[i].y = this.bodyHeight * this.scale * 0.5 - pos;
    }
  }

  distance(x0, y0, x1, y1, size, cnst) {
    let offset = pnoise.perlin2(x0 / 50, y0 / 50) * this.PatternNoise;
//    let offset = (this.p5.noise(x0 / 50, y0 / 50) - 0.5) * this.PatternNoise * 2;

    if (y0 > y1) {
      return Math.max(
        Math.sqrt(Math.pow(x0 - x1, 2)) + Math.sin((y0 - y1) / y1 * cnst) * size,
        Math.sqrt(Math.pow(x0 - x1, 2))) + offset;
    }
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2)) + offset;
  }

  drawBlotches(state) {
    if (this.blotches.length === 0) return;
    this.p5.randomSeed(0);

    let colBlotch = this.p5.color(state.colBlotch);
    let colBlotchBelly = this.p5.color(state.colBlotchBelly);
    let colBlotchOutline = this.p5.color(state.colBlotchOutline);
    let colBlotchDot = this.p5.color(state.colBlotchDot);

    let width = this.bodyLength * this.scale;
    let height = this.bodyHeight * this.scale;
    let blotchInterval = this.bodyLength * this.scale / this.numBlotches;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let nearestBlotch = Math.floor(x / blotchInterval);
        let bl = this.blotches[nearestBlotch];
        bl.drawPixel(this.x, this.y, this.bodyHeight, x, y, colBlotch, colBlotchBelly, colBlotchOutline, colBlotchDot, state.distortion);
      }
    }
  }

  drawTitle(p, state) {
    p.textSize(24);
    let color = 'black';
    let bgColor = state.colBackground;
    let bgColorBrightness = (p.red(bgColor) + p.green(bgColor) + p.blue(bgColor)) / 3;
    if (bgColorBrightness < 128) {
      color = 'white';
    }
    p.fill(color);
    p.text(state.morphName, 470 - p.textWidth(state.morphName), 480);
  }


  drawPied(state) {
    if (state.pied === 0) {
      return;
    }
    this.p5.randomSeed(2);
    let width = this.bodyLength * this.scale;
    let height = this.bodyHeight * this.scale;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let offset = pnoise.perlin2(x / 250, y / 250) * 20 + 8;
//        let offset = (this.p5.noise((x+250) / 800, (y + 150) / 800) - 0.5) * 30 + 8;
        if (offset < state.pied) {
          this.p5.stroke('#f0f0f0');
          this.p5.point(this.x + x, this.y + y);
        }
      }
    }
  }


  drawDorsal(state) {
//    if (this.blotches.length === 0) return;

    let colDorsal = this.p5.color(state.colDorsal);
    let dorsalWidth = state.dorsalWidth;
    let dorsalGap = state.dorsalBreak * 2;
    let dorsalInterval = dorsalWidth * 3;

    if (dorsalWidth === 0) {
      return;
    }

    let width = this.bodyLength * this.scale;
    let height = dorsalWidth * this.scale;

//    this.p5.randomSeed(0);
    let gaps = [];
    for (let i = 0; i < dorsalGap; i++) {
      gaps.push(this.p5.random() * (width - dorsalWidth * 2) + dorsalWidth);
    }
    gaps.sort((a,b)=>{return a-b;});

    let half = dorsalInterval / 2;
    let pos = 0;
    for (let i = 0; i < dorsalGap; i += 2) {
      if (gaps[i] - pos < dorsalInterval) {
        gaps[i] = pos + dorsalInterval + half;
        gaps[i + 1] = pos + dorsalInterval + half;
      } else if (gaps[i] - pos > dorsalInterval + half) {
        gaps[i] = pos + dorsalInterval + half * this.p5.random();        
      }
      pos = gaps[i + 1];
    }
    if (width - gaps[gaps.length - 1] > dorsalInterval + half) {
      gaps[gaps.length - 1] = width - dorsalInterval * this.p5.random();        
    }

    for (let y = 0; y < height + 20; y++) {
      for (let x = 0; x < width; x++) {
        let offset = pnoise.perlin2(x / 50, y / 50) * state.distortion;
//        let offset = (this.p5.noise(x / 50, y / 50) - 0.5) * state.distortion * 2;
        let isGap = (y + offset > dorsalWidth);
        for (let i = 0; i < dorsalGap; i += 2) {
          let dStart = gaps[i];
          let dEnd = gaps[i + 1];
          if ((x >= dStart) && (x <= dEnd) && (y + offset < dorsalWidth)) {
            isGap = false;
            break;
          }
          let distStart = Math.sqrt(Math.pow(dStart - x, 2) + Math.pow(0 - y, 2)) + offset;
          let distEnd = Math.sqrt(Math.pow(dEnd - x, 2) + Math.pow(0 - y, 2)) + offset;
          if ((distStart < dorsalWidth) || (distEnd < dorsalWidth)) {
            isGap = false;
            break;
          }
          isGap = true;
        }
        if (!isGap) {
          this.p5.stroke(colDorsal);
          this.p5.point(this.x + x, this.y + y);
        }
      }
    }
  }


  drawBody(x, y, mainColorCode, backColorCode, bellyColorCode) {
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


  drawSnake(target, state) {
    if (this.rendering) return;
    this.rendering = true;

    let p5 = this.p5;
    let p5r = target;

    p5r.erase();
    p5r.rect(0, 0, 500, 500);
    p5r.noErase();

    p5r.noStroke();
    p5r.fill(state.colBackgroundRGBA);
    p5r.rect(0, 0, 500, 500);

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

        this.drawHead(p5r, state.colBodyBack, state.colBlotch, state.colEye, state.colIris, state.headStamp);
        document.querySelector('#progress').textContent = '100%';

        this.drawTitle(p5r, state);

        this.rendering = false;
        return;
      }

      let px;
      let py;
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
        // let px = 50 + Math.sin(theta2) * 30 + x + Math.sin(theta1) * 50;
        // let py = 400 - Math.cos(theta2) * 50 + Math.cos(theta1) * 100;
        px = 265 + Math.sin(theta1) * 0.35 * (x + y * 2 * tail + 500) * rate + 0 + 0 * (1 - tail) - 50 + 50 * neck;
        py = 255 + Math.cos(theta1) * 0.8 * (y * tail + 150) * rate + 50 - 50 * tail + 200 - 200 * neck;

        if (y === 0) {
          if (Math.cos(theta1) < 0) {
            let shadow = p5r.color(0, 0, 0, 30);
            p5r.strokeWeight(4);
            p5r.stroke(shadow);
            p5r.line(px, py, px, py + 10);
          }
        }

//        let gy = Math.abs(-Math.sin(theta1 / 3 - ((1-rate2) * 5)) * 80 + y * 0.5  + 10 + Math.cos(theta1) * 40);
//        let gy = Math.abs(-Math.sin(theta1 / 3 - ((1-rate2) * 20)) * 90 + y * 0.7  - 10 + Math.cos(theta1) * 50);
        let gy = Math.abs(-Math.sin(theta1 / 3 - (1-rate2) * 20) * 90 + y * 0.9  - 10 + Math.cos(theta1) * 70) + 0.5;

        let col = p5.get(this.x + (x * 4.5 * rate2) % this.bodyLength, this.y + gy);

        col = p5.lerpColor(p5.color(col), p5.color(0), gy / this.bodyHeight * 0.3);

//        p5r.strokeWeight(5);
//        p5r.stroke(col);
        p5r.fill(col);
//        p5r.noFill();
        p5r.noStroke();
//        p5r.point(px, py);
        p5r.ellipse(px, py, 4, 4);
      }

      if (Math.cos(theta1) > 0) {
        let shadow = p5r.color(0, 0, 0, 30);
        p5r.strokeWeight(4);
        p5r.stroke(shadow);
        p5r.line(px, py, px, py + 10);          
      }

      g_x = x + 1;
    }, 10);
  }

  drawHead(target, bodyColor, blotchColor, colEye, colIris, headStamp) {
    let p5 = target;
    let hx = 230;
    let hy = 260;

    let darkColor = p5.lerpColor(p5.color(bodyColor), p5.color(0), 0.1);
    let lightColor = p5.lerpColor(p5.color(blotchColor), p5.color(0), 0.1);
    //let lightShadowColor = p5.lerpColor(p5.color(blotchColor), p5.color(0), 0.2);

    p5.noStroke();

    p5.push();
    p5.translate(hx, hy);
    p5.rotate(p5.PI / 10);

    // bottom shadow
    p5.push();
    p5.translate(-15, 15);
    p5.rotate(-0.2);
    p5.fill(0, 0, 0, 80);
    p5.ellipse(0, 0, 128, 55);
    p5.pop();

    // head upper shadow
    p5.fill(p5.color(0, 0, 0, 50));
    p5.arc(-35-2, 10-2, 100, 100, p5.PI, 0);

    let darkGrad = p5.drawingContext.createLinearGradient(-100, 0, -70, 0);
    darkGrad.addColorStop(0.0, lightColor);
    darkGrad.addColorStop(1.0, darkColor);

    let lightGrad = p5.drawingContext.createLinearGradient(0, 0, 0, 60);
    lightGrad.addColorStop(0.0, lightColor);
    lightGrad.addColorStop(1.0, darkColor);

    let lightHalfGrad = p5.drawingContext.createLinearGradient(0, 0, 0, 60);
    let lightHalfColor = p5.color(lightColor);
    lightHalfColor.setAlpha(10 * headStamp);
    let darkHalfColor = p5.color(darkColor);
    darkHalfColor.setAlpha(10 * headStamp);
    lightHalfGrad.addColorStop(0.0, lightHalfColor);
    lightHalfGrad.addColorStop(1.0, darkHalfColor);

    // outline
    let outlineColor = p5.color(0, 0, 0, 30);
    p5.fill(outlineColor);
    p5.arc(-35-2, 10-2, 100, 100, p5.PI, 0);
    p5.arc(5, -8, 80, 80, 0, p5.PI);
    p5.quad(-20, -30,    45, -15,   25, 25,   -40, 35);
    p5.ellipse(35+2, -7-2, 23, 23);
    p5.stroke(outlineColor);
    p5.line(-5, -27, 35, -17);
    p5.noStroke();

    //// dark color
    p5.drawingContext.fillStyle = darkGrad;

    // head darker back
    p5.arc(-35, 10, 100, 100, p5.PI, 0);

    // front nose arc
    p5.ellipse(35, -7, 23, 23);
    p5.ellipse(35, -5, 23, 23);


    //// light color
    p5.drawingContext.fillStyle = lightGrad;

    // mouse arc
    p5.arc(5, -8-3, 80, 80, 0, p5.PI);

    // head lighter back main
    p5.ellipse(-55, 5, 65, 65-2);

    // head front main
    p5.quad(-20, -30,    45, -15,   25, 25-3,   -40, 35-3);


    //// dark color
    p5.drawingContext.fillStyle = darkGrad;
  
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
    p5.vertex(-65, 20);
    p5.endShape();


    //// light Half color
    p5.drawingContext.fillStyle = lightHalfGrad;

    // headstamp (top)
    p5.ellipse(-35, -25, 55, 25);
    p5.ellipse(-5, -13, 40, 12);

    p5.randomSeed(2);
    for (let i = 0; i < 30; i++) {
      let rx = p5.random();
      let ry = p5.random();
      let rrx = p5.random();
      let rry = p5.random();

      let arx = -80 + rx * 120;
      let ary = -20 + ry * 10 + rx * 10 + 15 * (rx < 0.1);
      let arrx = 12 + rrx * 5 + ((1 - rx) * 10);
      let arry = 10 + rry * 3 + ((1 - rx) * 10);

      p5.ellipse(arx, ary, arrx, arry);

      if ((rx > 0.1) && (rx < 0.6)) {
        p5.ellipse(arx + 10, ary - (0.4 - Math.abs(rx - 0.4)) * 40, arrx * 0.8, arry * 0.8);
      }
    }

    // head stamp (side)
    for (let i = 0; i < 20; i++) {
      let rx = p5.random();
      let ry = p5.random();
      let rrx = p5.random();
      let rry = p5.random();

      let arx = -70 + rx * 100;
      let ary = 10 + ry * 10 - rx * 8;
      let arrx = 10 + rrx * 5 + ((1 - rx) * 10);
      let arry = 8 + rry * 3 + ((1 - rx) * 10);

      p5.ellipse(arx, ary, arrx, arry);
    }

    p5.pop();

    // // eyes
    p5.fill(colIris);
    p5.ellipse(hx - 20, hy + 0, 15, 15);

    p5.fill(colEye);
    p5.ellipse(hx - 20, hy + 0, 5, 12);

    p5.fill(255, 255, 255, 100);
    p5.ellipse(hx - 20 - 0, hy + 0 - 3, 8, 8);

  }
}

export default BallPython;
