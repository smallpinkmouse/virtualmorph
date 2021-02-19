import React from 'react';

class SaveLoad extends React.Component {
  state = this.props.value;

  componentDidMount() {
    this.close(document.querySelector('#importdialog'));
    this.close(document.querySelector('#exportdialog'));

    this.reader = new FileReader();
    this.reader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      if (this.props.onChange) {

        // backward compatibility
        if (!json.state.hasOwnProperty('colIris')) {
          json.state['colIris'] = json.state['colEye'];
        }
        if (!json.state.hasOwnProperty('cpColIris')) {
          json.state['cpColIris'] = false;
        }
        if (!json.state.hasOwnProperty('headStamp')) {
          json.state['headStamp'] = 0;
        }

        // import data file
        this.props.onChange(json.state);
      }
    };
  }

  show(elem) {
    elem.style.display = "block";
  }

  close(elem) {
    elem.style.display = "none";
  }

  handleImport() {
    var dialog = document.querySelector('#importdialog');
    this.show(dialog);

    var parent = document.querySelector('#importform');
    if (parent.firstChild != null) {
      parent.removeChild(parent.firstChild);
    }

    var input = document.createElement('input');
    input.type='file';
    input.id='importfile'
    parent.appendChild(input);

    input.addEventListener('change', (e)=> {
      e.preventDefault();
      this.reader.readAsText(e.target.files[0]);
      setTimeout(()=>{
        var parent = document.querySelector('#importform');
        if (parent.firstChild != null) {
          parent.removeChild(parent.firstChild);
        }
        var dialog = document.querySelector('#importdialog');
        this.close(dialog);
      }, 500);
    }, false);
  }

  handleExport() {
    const dialog = document.querySelector('#exportdialog');
    this.show(dialog);

    const parent = document.querySelector('#exportlink');
    if (parent.firstChild != null) {
      parent.removeChild(parent.firstChild);
    }

    let data = this.props.value;
    data.state.timestamp = this.getTimestamp('yyyymmddHHMMSS');
    const blob = new Blob([JSON.stringify(data, null , '  ')], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const div = document.createElement('div');
    const link = document.createElement('a');
    link.href = url;
    link.download = data.state.morphName + '.json';
    link.innerHTML = 'download';
    div.appendChild(link);
    parent.appendChild(div);
  }

  getTimestamp(format_string)
  {
    const fmt = {
      HH: function(date) { return ('0' + date.getHours()).slice(-2); },
      H: function(date) { return date.getHours(); },
      MM: function(date) { return ('0' + date.getMinutes()).slice(-2); },
      M: function(date) { return date.getMinutes(); },
      SS: function(date) { return ('0' + date.getSeconds()).slice(-2); },
      dd: function(date) { return ('0' + date.getDate()).slice(-2); },
      d: function(date) { return date.getDate(); },
      S: function(date) { return date.getSeconds(); },
      yyyy: function(date) { return date.getFullYear() + ''; },
      yy: function(date) { return date.getYear() + ''; },
      t: function(date) { return date.getDate()<=3 ? ["st", "nd", "rd"][date.getDate()-1]: 'th'; },
      w: function(date) {return ["Sun", "$on", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]; },
      mmmm: function(date) { return ["January", "February", "$arch", "April", "$ay", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()]; },
      mmm: function(date) {return ["Jan", "Feb", "$ar", "Apr", "$ay", "Jun", "Jly", "Aug", "Spt", "Oct", "Nov", "Dec"][date.getMonth()]; },  
      mm: function(date) { return ('0' + (date.getMonth() + 1)).slice(-2); },
      m: function(date) { return date.getMonth() + 1; },
      $: function(date) {return 'M';}
    };
    const priority = ["HH", "H", "MM", "M", "SS", "dd", "d", "S", "yyyy", "yy", "t", "w", "mmmm", "mmm", "mm", "m", "$"];
    const now = new Date();
    const ret = priority.reduce((res, c) => { return res.replace(c, fmt[c](now)); }, format_string);
    return ret;
  }

  render() {
    return (
      <div className="panel" style={{position:'absolute',top:'10px',right:'160px'}}>
        <div id="import" onClick={()=>{this.handleImport();}}
          style={{
            position:'absolute',
            top:'0px',
            left:'70px',
            width:'70px',
            height:'30px',
            fontSize: '15px',
            cursor: 'pointer'
          }}>
          Import</div>
        <div id="export" onClick={()=>{this.handleExport();}}
          style={{
            position:'absolute',
            top:'0px',
            left:'0px',
            width:'70px',
            height:'30px',
            fontSize: '15px',
            cursor: 'pointer'
          }}>
          Export</div>

        <div className="dialog"
          id="importdialog"
          style={{
          }}>
          <div className="dialogheader">
          Import Morph Data
          </div>
          <div className="dialogbody">
            Select a morph data file
          <div style={{fontSize:'10px', color:'#AAA'}}>The file used only local, it does not send any server</div>
          </div>
          <div id="importform" style={{marginTop:'5px'}}>
          </div>
          <div className="dialogfooter">
            <button onClick={()=>{this.close(document.querySelector('#importdialog'));}}>Close</button>
          </div>
        </div>

        <div className="dialog"
          id="exportdialog"
          style={{
          }}>
          <div className="dialogheader">
          Export Morph Data
          </div>
          <div className="dialogbody">
            Click download link
          </div>
          <div id="exportlink" style={{fontSize:'18px'}}></div>
          <div className="dialogfooter">
            <button onClick={()=>{this.close(document.querySelector('#exportdialog'));}}>Close</button>
          </div>
        </div>

      </div>
    );
  }
}

export default SaveLoad;
