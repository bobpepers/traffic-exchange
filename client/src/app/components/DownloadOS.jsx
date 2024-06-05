import React, { Component } from 'react';
import { connect } from 'react-redux';
import Platform from 'react-platform-js'
import Button from '@material-ui/core/Button';
import * as actions from '../actions/auth';
import { RUNEBASE_VERSION } from '../config';

class DownloadOS extends Component {
  constructor(props) {
    super(props);
  }

  renderDownloadLink(Platform, CPU, UA) {
    switch (true) {
      case !!UA.match(/Linux x86_64/):
        return `https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-x86_64-linux-gnu.tar.gz`;
        break;
      case !!Platform.match(/Windows/) && !!CPU.match(/64/):
        return `https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-win64-setup.exe`;
        break;
      case !!Platform.match(/Windows/) && !!CPU.match(/32/):
        return `https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-win32-setup.exe`;
        break;
      case !!Platform.match(/Osx/):
        return `https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-osx.dmg`;
        break;
      case !!Platform.match(/Android/):
        return 'https://play.google.com/store/apps/details?id=org.runebase.wallet';
        break;
      case !!Platform.match(/iPad/):
        return 'Source';
        break;
      case !!Platform.match(/iPhone/):
        return 'Source';
        break;
      default:
        return 'source link';
    }
  }

  renderDownloadName(Platform, CPU, UA) {
    switch (true) {
      case !!UA.match(/Linux x86_64/):
        return `runebase-${RUNEBASE_VERSION}-x86_64-linux-gnu.tar.gz`;
        break;
      case !!Platform.match(/Windows/) && !!CPU.match(/64/):
        return `runebase-${RUNEBASE_VERSION}-win64-setup.exe`;
        break;
      case !!Platform.match(/Windows/) && !!CPU.match(/32/):
        return `runebase-${RUNEBASE_VERSION}-win32-setup.exe`;
        break;
      case !!Platform.match(/Mac OS/):
        return `runebase-${RUNEBASE_VERSION}-osx.dmg`;
        break;
      case !!Platform.match(/Android/):
        return 'Runebase Android Wallet';
        break;
      case !!Platform.match(/iPad/):
        return 'Source';
        break;
      case !!Platform.match(/iPhone/):
        return 'Source';
        break;
      default:
        return 'Unknown Platform';
    }
  }

  render() {
    console.log(Platform);
    console.log(Platform.OS);
    console.log(Platform.OSVersion);
    console.log(Platform.CPU);
    console.log(Platform.UA);
    return (
      <div className="single_slider pt-3 w-100 my-auto">
        <a className="button1 showpointer" href={this.renderDownloadLink(Platform.OS, Platform.CPU, Platform.UA)}>{this.renderDownloadName(Platform.OS, Platform.CPU, Platform.UA)}</a>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default connect(mapStateToProps, actions)(DownloadOS);
