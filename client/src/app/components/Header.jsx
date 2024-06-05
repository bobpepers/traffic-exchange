import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavDropdown,
} from 'react-bootstrap';

import { withTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LiveTvIcon from '@material-ui/icons/LiveTv';
// import MouseIcon from '@material-ui/icons/Mouse';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaucet } from '@fortawesome/free-solid-svg-icons';
import MobileNav from '../assets/images/mobileNav.svg';
// import 'bootstrap/dist/css/bootstrap.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      height: 0,
      prevHash: '',
      currentHash: '',
      chainInfo: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.detectHashChange = this.detectHashChange.bind(this);
  }

  toggleMenu() {
    this.setState({ menu: !this.state.menu });
  }

  componentDidMount() {
    this.updateHeight();
    window.addEventListener('resize', this.updateHeight);
    window.addEventListener('scroll', this.detectHashChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateHeight);
    window.removeEventListener('scroll', this.detectHashChange);
  }

  componentDidUpdate() {
    this.updateHeight();
    this.detectHashChange();
  }

  updateHeight() {
    if (this.state.height != this.div.clientHeight) {
      this.setState({ height: this.div.clientHeight });
    }
  }

  detectHashChange() {
    this.state.currentHash = window.location.hash.substring(1);

    if (this.state.currentHash == '') {
      // console.log('sip');

    } else {
      // console.log(this.state.currentHash);
      if (this.state.currentHash !== '' && this.state.currentHash !== this.state.prevHash) {
        this.setState({ currentHash: this.state.currentHash });
        this.state.prevHash = this.state.currentHash;
      }
    }
  }

  render() {
    const show = (this.state.menu) ? 'show' : '';
    const { t, i18n } = this.props;
    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    };
    const getCurrentLng = () => i18n.language || window.localStorage.i18nextLng || '';
    const countryCode = (country) => {
      if (country == 'pt') {
        return 'br';
      }
      if (country == 'en') {
        return 'us';
      }
      if (country == 'nl') {
        return 'nl';
      }
    }
    return (
      <header className="rootRow header" style={{ height: this.state.height }}>
        <Navbar ref={(div) => { this.div = div; }} fixed="top" className="navbar navbar-default" expand="lg">
          <Link to={this.props.authenticated ? '/' : '/'} className="nav-link">RunesX</Link>
          <button className="navbar-toggler" type="button" onClick={this.toggleMenu}>
            <MobileNav />
          </button>
          <Navbar.Collapse id="basic-navbar-nav" className={`collapse navbar-collapse ${show}`}>
            <Nav className="mr-auto rNavbar">
              <Link className="nav-link" to="/surf">
                <LiveTvIcon />
                {' '}
                Surf
              </Link>
              {/*
<Link className="nav-link" to="/click">
                <MouseIcon />
                {' '}
                Click
              </Link>
              */}
              <Link className="nav-link" to="/faucet">
                <FontAwesomeIcon icon={faFaucet} />
                {' '}
                Faucet
              </Link>
              <Link className="nav-link" to="/lottery">
                <AttachMoneyIcon />
                {' '}
                Lottery
              </Link>
              <Link onClick={this.toggleMenu} className="nav-link" to="/dashboard">
                <DashboardIcon />
                {' '}
                Dashboard
              </Link>
            </Nav>
            <ul>
              {
              this.props.authenticated
                ? (
                  <>
                    <li>
                      <Link className="nav-link" to="/signout">
                        <ExitToAppIcon />
                        {' '}
                        Logout
                      </Link>
                    </li>
                  </>

                )
                : (
                  <>
                    <li>
                      <Link className="nav-link" to="/signin">{t('signin')}</Link>
                    </li>
                    <li>
                      <Link className="nav-link" to="/signup">{t('signup')}</Link>
                    </li>
                  </>

                )
            }

            </ul>
            <NavDropdown
              className="langPadding toggleLangWrapper"
              title={(
                <span>
                  <ReactCountryFlag countryCode={countryCode(`${getCurrentLng()}`)} svg />
                  {' '}
                  {t(`${getCurrentLng()}`)}
                </span>
              )}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item onClick={(event) => { this.toggleMenu; changeLanguage('en') }}>
                <div>
                  <ReactCountryFlag countryCode="us" svg />
                  {' '}
                  {t('en')}
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={(event) => { this.toggleMenu; changeLanguage('pt') }}>
                <div>
                  <ReactCountryFlag countryCode="br" svg />
                  {' '}
                  {t('pt')}
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={(event) => { this.toggleMenu; changeLanguage('nl') }}>
                <div>
                  <ReactCountryFlag countryCode="nl" svg />
                  {' '}
                  {t('nl')}
                </div>
              </NavDropdown.Item>
            </NavDropdown>

          </Navbar.Collapse>
        </Navbar>
      </header>
    )
  }
}

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps)(withTranslation()(Header));
