import React, { Fragment } from 'react';
import {
  connect,
} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  Switch,
} from '@material-ui/core';
import { Brightness3, WbSunny } from '@material-ui/icons';
import { changeTheme } from '../actions';

const ThemeSwitch = withStyles({
  switchBase: {
    color: '#FE6B8B',
    '&$checked': {
      color: '#FE6B8B',
    },
    '&$checked + $track': {
      backgroundColor: '#FE6B8B',
    },
  },
  checked: {},
  track: {},
})(Switch);

// tslint:disable:jsx-no-lambda
const ThemeToggle = (props) => {
  const {
    theme: {
      theme,
    },
  } = props;

  const handleChangeCurrentStyleMode = (value) => {
    props.changeTheme(value);
  };

  return (
    <div>
      <WbSunny />
      <ThemeSwitch
        checked={theme !== 'light'}
        onChange={(e) => handleChangeCurrentStyleMode(theme === 'light' ? 'dark' : 'light')}
      />
      <Brightness3 />
    </div>
  );
}

const mapStateToProps = (state) => ({
  theme: state.theme,
})

const mapDispatchToProps = (dispatch) => ({
  changeTheme: (payload) => dispatch(changeTheme(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ThemeToggle);
