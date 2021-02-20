import React from 'react'
import onClickOutside from 'react-onclickoutside'
 
class ExampleMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
    };
    this.preset = {
      'Normal': {
        "morphName": "Normal",
        "dots": 2,
        "distortion": 10,
        "blotchSize": 18,
        "blotchPos": 35,
        "bottomSize": 5,
        "dorsalBreak": 4,
        "dorsalWidth": 13,
        "headStamp": 0,
        "pied": 0,
        "colBody": "#8e5454",
        "colBodyBack": "#4a2c32",
        "colBodyBelly": "#1e0a0a",
        "colBlotch": "#a48a63",
        "colBlotchOutline": "#d2c6b4",
        "colBlotchBelly": "#c1b383",
        "colBlotchDot": "#312121",
        "colDorsal": "#aa8262",
        "colEye": "#101010",
        "colIris": "#101010",
        "colBackground": "#f0f0f0",
        "colBackgroundRGBA": "rgba(240, 240, 240, 1)",
        "cpColBody": false,
        "cpColBodyBack": false,
        "cpColBodyBelly": false,
        "cpColBlotch": false,
        "cpColBlotchOutline": false,
        "cpColBlotchBelly": false,
        "cpColBlotchDot": false,
        "cpColDorsal": false,
        "cpColEye": false,
        "cpColIris": false,
        "cpColBackground": false,
        "timestamp": "20210219200902"
      },
      'Albino': {
        "morphName": "Albino",
        "dots": 0,
        "distortion": 10,
        "blotchSize": 18,
        "blotchPos": 48,
        "bottomSize": 5,
        "dorsalBreak": 3,
        "dorsalWidth": 0,
        "headStamp": 0,
        "pied": 0,
        "colBody": "#eaeaea",
        "colBodyBack": "#ffffff",
        "colBodyBelly": "#d6d6d6",
        "colBlotch": "#edff69",
        "colBlotchOutline": "#f5f96b",
        "colBlotchBelly": "#fdfd7b",
        "colBlotchDot": "#312121",
        "colDorsal": "#b4826e",
        "colEye": "#d43d3d",
        "colIris": "#d43d3d",
        "colBackground": "#f3d9d9",
        "colBackgroundRGBA": "rgba(243, 217, 217, 1)",
        "cpColBody": false,
        "cpColBodyBack": false,
        "cpColBodyBelly": false,
        "cpColBlotch": false,
        "cpColBlotchOutline": false,
        "cpColBlotchBelly": false,
        "cpColBlotchDot": false,
        "cpColDorsal": false,
        "cpColEye": false,
        "cpColIris": false,
        "cpColBackground": false,
        "timestamp": "20210219200922"
      },
      'Pastel': {
        "morphName": "Pastel",
        "dots": 2,
        "distortion": 18,
        "blotchSize": 18,
        "blotchPos": 35,
        "bottomSize": 5,
        "dorsalBreak": 4,
        "dorsalWidth": 7,
        "headStamp": 1,
        "pied": 0,
        "colBody": "#7d6f5a",
        "colBodyBack": "#2d1d20",
        "colBodyBelly": "#1e0a0a",
        "colBlotch": "#bdbd71",
        "colBlotchOutline": "#d2c6b4",
        "colBlotchBelly": "#c1b383",
        "colBlotchDot": "#312121",
        "colDorsal": "#c9c787",
        "colEye": "#101010",
        "colIris": "#101010",
        "colBackground": "#f0f0f0",
        "colBackgroundRGBA": "rgba(240, 240, 240, 1)",
        "cpColBody": false,
        "cpColBodyBack": false,
        "cpColBodyBelly": false,
        "cpColBlotch": false,
        "cpColBlotchOutline": false,
        "cpColBlotchBelly": false,
        "cpColBlotchDot": false,
        "cpColDorsal": false,
        "cpColEye": false,
        "cpColIris": false,
        "cpColBackground": false,
        "timestamp": "20210219205720"
      },
      'Mojave': {
        "morphName": "Mojave",
        "dots": 1,
        "distortion": 10,
        "blotchSize": 18,
        "blotchPos": 35,
        "bottomSize": 5,
        "dorsalBreak": 4,
        "dorsalWidth": 13,
        "headStamp": 0,
        "pied": 0,
        "colBody": "#755a5a",
        "colBodyBack": "#412929",
        "colBodyBelly": "#1e0a0a",
        "colBlotch": "#bfc57d",
        "colBlotchOutline": "#d2c6b4",
        "colBlotchBelly": "#c1b383",
        "colBlotchDot": "#462f2f",
        "colDorsal": "#aa8262",
        "colEye": "#101010",
        "colIris": "#101010",
        "colBackground": "#f0f0f0",
        "colBackgroundRGBA": "rgba(240, 240, 240, 1)",
        "cpColBody": false,
        "cpColBodyBack": false,
        "cpColBodyBelly": false,
        "cpColBlotch": false,
        "cpColBlotchOutline": false,
        "cpColBlotchBelly": false,
        "cpColBlotchDot": false,
        "cpColDorsal": false,
        "cpColEye": false,
        "cpColIris": false,
        "cpColBackground": false,
        "timestamp": "20210219201935"
      },
      'Axanthic': {
        "morphName": "Axanthic",
        "dots": 2,
        "distortion": 10,
        "blotchSize": 18,
        "blotchPos": 35,
        "bottomSize": 5,
        "dorsalBreak": 4,
        "dorsalWidth": 13,
        "headStamp": 0,
        "pied": 0,
        "colBody": "#6f6b6b",
        "colBodyBack": "#4a4a4a",
        "colBodyBelly": "#1e0a0a",
        "colBlotch": "#949393",
        "colBlotchOutline": "#d2d2d2",
        "colBlotchBelly": "#bbbbbb",
        "colBlotchDot": "#312121",
        "colDorsal": "#a4a09c",
        "colEye": "#101010",
        "colIris": "#101010",
        "colBackground": "#f0f0f0",
        "colBackgroundRGBA": "rgba(240, 240, 240, 1)",
        "cpColBody": false,
        "cpColBodyBack": false,
        "cpColBodyBelly": false,
        "cpColBlotch": false,
        "cpColBlotchOutline": false,
        "cpColBlotchBelly": false,
        "cpColBlotchDot": false,
        "cpColDorsal": false,
        "cpColEye": false,
        "cpColIris": false,
        "cpColBackground": false,
        "timestamp": "20210219204827"
      },
      'Pied': {
        "morphName": "Pied",
        "dots": 2,
        "distortion": 10,
        "blotchSize": 18,
        "blotchPos": 35,
        "bottomSize": 5,
        "dorsalBreak": 4,
        "dorsalWidth": 13,
        "headStamp": 0,
        "pied": 3,
        "colBody": "#8e5454",
        "colBodyBack": "#4a2c32",
        "colBodyBelly": "#1e0a0a",
        "colBlotch": "#a48a63",
        "colBlotchOutline": "#d2c6b4",
        "colBlotchBelly": "#c1b383",
        "colBlotchDot": "#312121",
        "colDorsal": "#aa8262",
        "colEye": "#101010",
        "colIris": "#101010",
        "colBackground": "#3a3a43",
        "colBackgroundRGBA": "rgba(58, 58, 67, 1)",
        "cpColBody": false,
        "cpColBodyBack": false,
        "cpColBodyBelly": false,
        "cpColBlotch": false,
        "cpColBlotchOutline": false,
        "cpColBlotchBelly": false,
        "cpColBlotchDot": false,
        "cpColDorsal": false,
        "cpColEye": false,
        "cpColIris": false,
        "cpColBackground": false,
        "timestamp": "20210219200941"
      },
      'Freeway': {
        "morphName": "Freeway",
        "dots": 2,
        "distortion": 10,
        "blotchSize": 0,
        "blotchPos": 35,
        "bottomSize": 5,
        "dorsalBreak": 3,
        "dorsalWidth": 13,
        "headStamp": 2,
        "pied": 0,
        "colBody": "#d0ccab",
        "colBodyBack": "#4a372c",
        "colBodyBelly": "#a49e8e",
        "colBlotch": "#c7b8a2",
        "colBlotchOutline": "#d2c6b4",
        "colBlotchBelly": "#c1b383",
        "colBlotchDot": "#312121",
        "colDorsal": "#c9c3a1",
        "colEye": "#101010",
        "colIris": "#101010",
        "colBackground": "#f0f0f0",
        "colBackgroundRGBA": "rgba(240, 240, 240, 1)",
        "cpColBody": false,
        "cpColBodyBack": false,
        "cpColBodyBelly": false,
        "cpColBlotch": false,
        "cpColBlotchOutline": false,
        "cpColBlotchBelly": false,
        "cpColBlotchDot": false,
        "cpColDorsal": false,
        "cpColEye": false,
        "cpColIris": false,
        "cpColBackground": false,
        "timestamp": "20210219234226"
    
      },
      'Clown': {
        "morphName": "Clown",
        "dots": 2,
        "distortion": 23,
        "blotchSize": 23,
        "blotchPos": 47,
        "bottomSize": 16,
        "dorsalBreak": 4,
        "dorsalWidth": 0,
        "headStamp": 6,
        "pied": 0,
        "colBody": "#8e5454",
        "colBodyBack": "#3b3027",
        "colBodyBelly": "#1e0a0a",
        "colBlotch": "#b39269",
        "colBlotchOutline": "#201e18",
        "colBlotchBelly": "#eaddae",
        "colBlotchDot": "#312121",
        "colDorsal": "#aa8262",
        "colEye": "#000000",
        "colIris": "#7b7b4a",
        "colBackground": "#f0f0f0",
        "colBackgroundRGBA": "rgba(240, 240, 240, 1)",
        "cpColBody": false,
        "cpColBodyBack": false,
        "cpColBodyBelly": false,
        "cpColBlotch": false,
        "cpColBlotchOutline": false,
        "cpColBlotchBelly": false,
        "cpColBlotchDot": false,
        "cpColDorsal": false,
        "cpColEye": false,
        "cpColIris": false,
        "cpColBackground": false,
        "timestamp": "20210220143444"
      },
      'Spider': {
        "morphName": "Spider",
        "dots": 0,
        "distortion": 8,
        "blotchSize": 18,
        "blotchPos": 65,
        "bottomSize": 20,
        "dorsalBreak": 0,
        "dorsalWidth": 0,
        "headStamp": 5,
        "pied": 0,
        "colBody": "#5e3737",
        "colBodyBack": "#675744",
        "colBodyBelly": "#1e0a0a",
        "colBlotch": "#bbbb82",
        "colBlotchOutline": "#d2c6b4",
        "colBlotchBelly": "#e8dfc2",
        "colBlotchDot": "#312121",
        "colDorsal": "#aa8262",
        "colEye": "#101010",
        "colIris": "#5e5545",
        "colBackground": "#f0f0f0",
        "colBackgroundRGBA": "rgba(240, 240, 240, 1)",
        "cpColBody": false,
        "cpColBodyBack": false,
        "cpColBodyBelly": false,
        "cpColBlotch": false,
        "cpColBlotchOutline": false,
        "cpColBlotchBelly": false,
        "cpColBlotchDot": false,
        "cpColDorsal": false,
        "cpColEye": false,
        "cpColIris": false,
        "cpColBackground": false,
        "timestamp": "20210220143610"
      }
    };
    this.styles = {
      dropDownMenu: {
        position:'absolute',
        top:'10px',
        right:'160px',
        width:'80px',
        height:'30px',
        fontSize: '15px',
        cursor: 'pointer'
      },
      menuButton: {
        display: 'block',
        cursor: 'pointer',
        padding: '0px'
      },
      menuBox: {
        position: 'absolute',
        top: '23px',
        width: '120px',
        zIndex: 1,
        cursor: 'pointer',
        border: '1px solid #888',
        fontSize: '13px',
        backgroundColor: '#222'
      },
      menuContent: {
        padding: '3px 5px',
        borderBottom: '1px solid #888',
      },
      lastMenuContent: {
        padding: '3px 5px',
      },
    } 
  }
 
  toggleList() {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen,
    }))
  }
 
  handleClickMenu(val) {
    this.setState({
      listOpen: false,
    });
    if (this.props.onChange) {
      this.props.onChange(this.preset[val]);
    }
  }
 
  handleClickOutside() {
    this.setState({
      listOpen: false,
    })
  }
   
  render() {
    const { listOpen } = this.state
    return (
      <div style={this.styles.dropDownMenu}>
        <div onClick={this.toggleList.bind(this)} style={this.styles.menuButton}>
          Example
        </div>
        {listOpen && (
          <div style={this.styles.menuBox}>
            <div style={this.styles.menuContent}>
              <div onClick={this.handleClickMenu.bind(this, 'Normal')}>Normal</div>
            </div>
            <div style={this.styles.menuContent}>
              <div onClick={this.handleClickMenu.bind(this, 'Albino')}>Albino</div>
            </div>
            <div style={this.styles.menuContent}>
              <div onClick={this.handleClickMenu.bind(this, 'Pastel')}>Pastel</div>
            </div>
            <div style={this.styles.menuContent}>
              <div onClick={this.handleClickMenu.bind(this, 'Mojave')}>Mojave</div>
            </div>
            <div style={this.styles.menuContent}>
              <div onClick={this.handleClickMenu.bind(this, 'Axanthic')}>Axanthic</div>
            </div>
            <div style={this.styles.menuContent}>
              <div onClick={this.handleClickMenu.bind(this, 'Pied')}>Pied</div>
            </div>
            <div style={this.styles.menuContent}>
              <div onClick={this.handleClickMenu.bind(this, 'Freeway')}>Freeway</div>
            </div>
            <div style={this.styles.menuContent}>
              <div onClick={this.handleClickMenu.bind(this, 'Clown')}>Clown</div>
            </div>
            <div style={this.styles.lastMenuContent}>
              <div onClick={this.handleClickMenu.bind(this, 'Spider')}>Spider</div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
 
 
export default onClickOutside(ExampleMenu)