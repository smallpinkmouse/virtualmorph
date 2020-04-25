import React, { Component } from 'react';
import './App.css';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { ChromePicker } from 'react-color';

import P5 from 'p5';
import sketchEditor from './sketchEditor';
import sketchRender from './sketchRender';

class App extends Component {
  constructor() {
    super();
    this.state = {
      morphName: 'Normal',
      dots: 1,
      distortion: 10,
      blotchSize: 20,
      blotchPos: 60,
      bottomSize: 0.5,

      colBody: '#965a5a',
      colBodyBack: '#533038',
      colBodyBelly: '#1e0a0a',
      colBlotch: '#b4826e',
      colBlotchOutline: '#0a0303',
      colBlotchBelly: '#c8a080',
      colBlotchDot: '#533038',

      colEye: '#101010',
      colBackground: '#f0f0f0',
      colBackgroundRGBA: this.hex2rgba('#f0f0f0', 1),

      cpColBody: false,
      cpColBodyBack: false,
      cpColBodyBelly: false,
      cpColBlotch: false,
      cpColBlotchOutline: false,
      cpColBlotchBelly: false,
      cpColEye: false,
      cpColBackground: false,
    }

    this.p5 = null;
    this.p5r = null;
    this.memo = ['Reduced', 'Keyhole', 'Alien Head'];
    this.textChange = false;
  }

  componentDidMount() {
    this.p5 = new P5(sketchEditor);
    this.p5r = new P5(sketchRender);

    this.p5.redraw(this.state);
  }

  hex2rgba(hex, alpha) {
    let r = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    let c = null;
    if (r) {
        c = r.slice(1,4).map(function(x) { return parseInt(x, 16) });
    }
    r = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    if (r) {
        c = r.slice(1,4).map(function(x) { return 0x11 * parseInt(x, 16) });
    }
    if (!c) {
        return null;
    }
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;
}

  colorPickerShowing() {
    return this.state.cpColBody ? true :
      this.state.cpColBodyBack ? true :
      this.state.cpColBodyBelly ? true :
      this.state.cpColBlotch ? true :
      this.state.cpColBlotchOutline ? true :
      this.state.cpColBlotchBelly ? true :
      this.state.cpColEye ? true :
      this.state.cpColBackground ? true :
      false;
  }

  setColorPicker(picker, bool) {
    let newState = {
      cpColBody: false,
      cpColBodyBack: false,
      cpColBodyBelly: false,
      cpColBlotch: false,
      cpColBlotchOutline: false,
      cpColBlotchBelly: false,
      cpColEye: false,
      cpColBackground: false,
    }
    newState[picker] = bool;
    this.setState(newState);
  }

  onColorClick = (picker) => {
    this.setColorPicker(picker, !this.state[picker]);
  };

  onColorClose = (picker) => {
    this.setColorPicker(picker, false);
  };

  onColorChange = (target, colorCode) => {
    let newState = {};
    newState[target] = colorCode;
    this.setState(newState);
  };

  onBgColorChange = (color) => {
    let newState = {
      colBackground: color.hex,
      colBackgroundRGBA: this.hex2rgba(color.hex, color.rgb.a)
    };
    this.setState(newState);
  };

  onRenderingClick = () => {
    this.p5.drawSnake(this.p5r, this.state);
  }

  onTextChange = (val) => {
    this.textChange = true;
    this.setState({morphName: val})
  }


  render() {
    if (this.textChange) {
      this.textChange = false;
    } else {
      if ((this.p5 !== null) && (!this.colorPickerShowing())) {
        this.p5.redraw(this.state);
      }      
    }

    return (
      <div className="App">
        <div className="App-header">
          Ball Python Virtual Morph Maker
        </div>

        <div id="CanvasEditor"></div>
        <div id="CanvasRender"></div>

        <div className="ControlPanel">
          <div className="ControlItem">
            <div className="ControlLabel">Morph Name</div>
            <input className="ControlText" type="text" value={this.state.morphName} onChange={(e)=>{this.onTextChange(e.target.value);}} />
          </div>

          <div className="ControlHR" />
          <div className="ControlHR" />

          <div className="ControlItem">
            <div className="ControlLabel">Body Back Color</div>
            <div className="ControlColor" onClick={ ()=>{this.onColorClick('cpColBodyBack');} }>
              <div className="ControlColorInner" style={{ background: this.state.colBodyBack }} />
            </div>
            { this.state.cpColBodyBack ? <div className="ColorPickerPopup">
              <div className="ColorPickerCover" onClick={ ()=>{this.onColorClose('cpColBodyBack');} }/>
              <ChromePicker color={ this.state.colBodyBack } onChange={ (color)=>{this.onColorChange('colBodyBack', color.hex);} } />
            </div> : null }
            <div className="ColorValue">{this.state.colBodyBack}</div>
          </div>

          <div className="ControlItem">
            <div className="ControlLabel">Body Main Color</div>
            <div className="ControlColor" onClick={ ()=>{this.onColorClick('cpColBody');} }>
              <div className="ControlColorInner" style={{ background: this.state.colBody }} />
            </div>
            { this.state.cpColBody ? <div className="ColorPickerPopup">
              <div className="ColorPickerCover" onClick={ ()=>{this.onColorClose('cpColBody');} }/>
              <ChromePicker color={ this.state.colBody } onChange={ (color)=>{this.onColorChange('colBody', color.hex);} } />
            </div> : null }
            <div className="ColorValue">{this.state.colBody}</div>
          </div>          

          <div className="ControlItem">
            <div className="ControlLabel">Body Belly Color</div>
            <div className="ControlColor" onClick={ ()=>{this.onColorClick('cpColBodyBelly');} }>
              <div className="ControlColorInner" style={{ background: this.state.colBodyBelly }} />
            </div>
            { this.state.cpColBodyBelly ? <div className="ColorPickerPopup">
              <div className="ColorPickerCover" onClick={ ()=>{this.onColorClose('cpColBodyBelly');} }/>
              <ChromePicker color={ this.state.colBodyBelly } onChange={ (color)=>{this.onColorChange('colBodyBelly', color.hex);} } />
            </div> : null }
            <div className="ColorValue">{this.state.colBodyBelly}</div>
          </div>          

          <div className="ControlItem">
            <div className="ControlLabel">Pattern Distortion</div>
            <Slider
              defaultValue={this.state.distortion}
              step={1}
              min={0}
              max={20}
              onAfterChange={(value) => {this.setState({distortion: value});}}
            />
            <div className="ControlValue">{this.state.distortion}</div>
          </div>


          <div className="ControlHR" />


          <div className="ControlItem">
            <div className="ControlLabel">Blotch Size</div>
            <Slider
              defaultValue={this.state.blotchSize}
              step={1}
              min={0}
              max={40}
              onAfterChange={(value) => {this.setState({blotchSize: value});}}
            />
            <div className="ControlValue">{this.state.blotchSize}</div>
          </div>

          <div className="ControlItem">
            <div className="ControlLabel">Blotch Bottom Size</div>
            <Slider
              defaultValue={this.state.bottomSize}
              step={0.1}
              min={0.1}
              max={1.0}
              onAfterChange={(value) => {this.setState({bottomSize: value});}}
            />
            <div className="ControlValue">{this.state.bottomSize}</div>
          </div>

          <div className="ControlItem">
            <div className="ControlLabel">Blotch Height</div>
            <Slider
              defaultValue={this.state.blotchPos}
              step={1}
              min={0}
              max={70}
              onAfterChange={(value) => {this.setState({blotchPos: value});}}
            />
            <div className="ControlValue">{this.state.blotchPos}</div>
          </div>


          <div className="ControlItem">
            <div className="ControlLabel">Blotch Color</div>
            <div className="ControlColor" onClick={ ()=>{this.onColorClick('cpColBlotch');} }>
              <div className="ControlColorInner" style={{ background: this.state.colBlotch }} />
            </div>
            { this.state.cpColBlotch ? <div className="ColorPickerPopup">
              <div className="ColorPickerCover" onClick={ ()=>{this.onColorClose('cpColBlotch');} }/>
              <ChromePicker color={ this.state.colBlotch } onChange={ (color)=>{this.onColorChange('colBlotch', color.hex);} } />
            </div> : null }
            <div className="ColorValue">{this.state.colBlotch}</div>
          </div>          

          <div className="ControlItem">
            <div className="ControlLabel">Blotch Outline Color</div>
            <div className="ControlColor" onClick={ ()=>{this.onColorClick('cpColBlotchOutline');} }>
              <div className="ControlColorInner" style={{ background: this.state.colBlotchOutline }} />
            </div>
            { this.state.cpColBlotchOutline ? <div className="ColorPickerPopup">
              <div className="ColorPickerCover" onClick={ ()=>{this.onColorClose('cpColBlotchOutline');} }/>
              <ChromePicker color={ this.state.colBlotchOutline } onChange={ (color)=>{this.onColorChange('colBlotchOutline', color.hex);} } />
            </div> : null }
            <div className="ColorValue">{this.state.colBlotchOutline}</div>
          </div>          

          <div className="ControlItem">
            <div className="ControlLabel">Blotch Belly Color</div>
            <div className="ControlColor" onClick={ ()=>{this.onColorClick('cpColBlotchBelly');} }>
              <div className="ControlColorInner" style={{ background: this.state.colBlotchBelly }} />
            </div>
            { this.state.cpColBlotchBelly ? <div className="ColorPickerPopup">
              <div className="ColorPickerCover" onClick={ ()=>{this.onColorClose('cpColBlotchBelly');} }/>
              <ChromePicker color={ this.state.colBlotchBelly } onChange={ (color)=>{this.onColorChange('colBlotchBelly', color.hex);} } />
            </div> : null }
            <div className="ColorValue">{this.state.colBlotchBelly}</div>
          </div>          

          <div className="ControlItem">
            <div className="ControlLabel">Blotch Dots</div>
            <Slider
              defaultValue={this.state.dots}
              step={1}
              min={0}
              max={2}
              onAfterChange={(value) => {this.setState({dots: value});}}
            />
            <div className="ControlValue">{this.state.dots}</div>
            <div className="ControlMemo">{this.memo[this.state.dots]}</div>
          </div>

          <div className="ControlItem">
            <div className="ControlLabel">Blotch Dot Color</div>
            <div className="ControlColor" onClick={ ()=>{this.onColorClick('cpColBlotchDot');} }>
              <div className="ControlColorInner" style={{ background: this.state.colBlotchDot }} />
            </div>
            { this.state.cpColBlotchDot ? <div className="ColorPickerPopup">
              <div className="ColorPickerCover" onClick={ ()=>{this.onColorClose('cpColBlotchDot');} }/>
              <ChromePicker color={ this.state.colBlotchDot } onChange={ (color)=>{this.onColorChange('colBlotchDot', color.hex);} } />
            </div> : null }
            <div className="ColorValue">{this.state.colBlotchDot}</div>
          </div>          


          <div className="ControlHR" />

          <div className="ControlItem">
            <div className="ControlLabel">Eye Color</div>
            <div className="ControlColor" onClick={ ()=>{this.onColorClick('cpColEye');} }>
              <div className="ControlColorInner" style={{ background: this.state.colEye }} />
            </div>
            { this.state.cpColEye ? <div className="ColorPickerPopup">
              <div className="ColorPickerCover" onClick={ ()=>{this.onColorClose('cpColEye');} }/>
              <ChromePicker color={ this.state.colEye } onChange={ (color)=>{this.onColorChange('colEye', color.hex);} } />
            </div> : null }
            <div className="ColorValue">{this.state.colEye}</div>
          </div>          

          <div className="ControlItem">
            <div className="ControlLabel">Background Color</div>
            <div className="ControlColor" onClick={ ()=>{this.onColorClick('cpColBackground');} }>
              <div className="ControlColorInner" style={{ background: this.state.colBackgroundRGBA }} />
            </div>
            { this.state.cpColBackground ? <div className="ColorPickerPopup">
              <div className="ColorPickerCover" onClick={ ()=>{this.onColorClose('cpColBackground');} }/>
              <ChromePicker color={ this.state.colBackgroundRGBA } onChange={ (color)=>{this.onBgColorChange(color);} } />
            </div> : null }
            <div className="ColorValue">{this.state.colBackground}</div>
          </div>          


          <div className="ControlHR" />
          <div className="ControlHR" />

          <div className="ControlItem">
            <button className="ControlRendering" onClick={this.onRenderingClick}>Rendering</button>
            <div id="progress"></div>
          </div>


        </div>
      </div>
    );
  }
}

export default App;
