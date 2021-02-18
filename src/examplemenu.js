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
        "cpColBackground": false,
        "timestamp": "20200427134317"
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
        "cpColBackground": false,
        "timestamp": "20200427140020"
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
        "cpColBackground": false,
        "timestamp": "20200427134835"
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
        "headStamp": 0,
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
        "cpColBackground": false,
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
              <div onClick={this.handleClickMenu.bind(this, 'Pied')}>Pied</div>
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