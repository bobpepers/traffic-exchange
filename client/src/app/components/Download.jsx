import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { Tabs, Tab, Nav } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import theme from '../theme'
import { RUNEBASE_VERSION } from '../config';

class Download extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { t } = this.props;
    return (
      <div id="wallets">
        <Grid container className="text-center">
          <Grid item xs={12} className={`index600 mt-${theme.spacing.section}`}>
            <h3 className="textBorder w-100 text-center">{t('chooseWallet')}</h3>
          </Grid>
          <div className="underline mx-auto index600" />
          <Tab.Container defaultActiveKey="Desktop">
            <Grid container>
              <Grid item xs={12} className={`index600 mt-${theme.spacing.marginTopItem}`}>
                <Nav className="flex-row d-flex justify-content-center">
                  <Nav.Item className="text-center col-xs-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <Nav.Link className="textBorder button1" eventKey="Desktop">{t('desktop')}</Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="text-center col-xs-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <Nav.Link className="textBorder button1" eventKey="Mobile">{t('mobile')}</Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="text-center col-xs-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <Nav.Link className="textBorder button1" eventKey="Web">{t('web')}</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Grid>
              <Grid item xs={12} className="index600">
                <Tab.Content>
                  <Tab.Pane eventKey="Desktop">
                    <Grid container className="text-center" direction="row" justify="center" alignItems="stretch">
                      <Grid item xs={12} className="d-flex">
                        <h3 className={`mx-auto textBorder mt-${theme.spacing.marginTopItem}`}>Desktop</h3>
                      </Grid>
                      <Grid item lg={4} md={6} sm={12} className={`mt-${theme.spacing.marginTopItem}`}>
                        <div className="col-md-12">
                          <i className="fab fa-windows brand-icon-size" />
                          <h3 className="w-100 textBorder">{t('windows')}</h3>
                          <a className="w-100 button1" href={`https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-win64-setup.exe`}>
                            64bit.exe
                          </a>
                          <a className="w-100 button1" href={`https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-win64.zip`}>
                            64bit.zip
                          </a>
                          <a className="w-100 button1" href={`https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-win32-setup.exe`}>
                            32bit.exe
                          </a>
                          <a className="w-100 button1" href={`https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-win32.zip`}>
                            32bit.zip
                          </a>
                        </div>
                      </Grid>
                      <Grid item lg={4} md={6} sm={12} className={`mt-${theme.spacing.marginTopItem}`}>
                        <div className="col-md-12">
                          <i className="fab fa-apple brand-icon-size" />
                          <h3 className="w-100 textBorder">{t('macOS')}</h3>
                          <a className="w-100 button1" href={`https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-osx.dmg`}>
                            osx.dmg
                          </a>
                          <a className="w-100 button1" href={`https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-osx.tar.gz`}>
                            osx.tar.gz
                          </a>
                          <a className="w-100 button1" href={`https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-osx64.tar.gz`}>
                            osx64.tar.gz
                          </a>
                        </div>
                      </Grid>
                      <Grid item lg={4} md={6} sm={12} className={`mt-${theme.spacing.marginTopItem}`}>
                        <div className="col-md-12">
                          <i className="fab fa-linux brand-icon-size" />
                          <h3 className="w-100 textBorder">{t('linux')}</h3>
                          <a className="w-100 button1" href={`https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-x86_64-linux-gnu.tar.gz`}>
                            x86_64.tar.gz
                          </a>
                          <a className="w-100 button1" href={`https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-i686-pc-linux-gnu.tar.gz`}>
                            i686.tar.gz
                          </a>
                          <a className="w-100 button1" href={`https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-arm-linux-gnueabihf.tar.gz`}>
                            arm.tar.gz
                          </a>
                          <a className="w-100 button1" href={`https://downloads.runebase.io/runebase-${RUNEBASE_VERSION}-aarch64-linux-gnu.tar.gz`}>
                            aarch64.tar.gz
                          </a>
                        </div>
                      </Grid>
                      <Grid item lg={4} md={6} sm={12} className={`mt-${theme.spacing.marginTopItem}`}>
                        <div className="col-md-12">
                          <i className="fab fa-chrome brand-icon-size" />
                          <h3 className="w-100 textBorder">{t('chrome')}</h3>
                          <a className="w-100 button1" href="https://chrome.google.com/webstore/detail/runebasechrome/gnfdbibmnlkehibhabjohlbiehhbhkhd">
                            RunebaseChrome
                          </a>
                        </div>
                      </Grid>
                      <Grid item lg={4} md={6} sm={12} className={`mt-${theme.spacing.marginTopItem}`}>
                        <div className="col-md-12">
                          <i className="fab fa-github brand-icon-size" />
                          <h3 className="w-100 textBorder">{t('source')}</h3>
                          <a className="w-100 button1" href="https://github.com/Runebase/runebase">
                            Core
                          </a>
                          <a className="w-100 button1" href="https://github.com/Runebase/runebase-chrome-wallet">
                            Runebase Chrome
                          </a>
                          <a className="w-100 button1" href="https://github.com/Runebase/web-wallet">
                            {t('webWallet')}
                          </a>
                          <a className="w-100 button1" href="https://github.com/Runebase/runebase-android">
                            Android
                          </a>
                        </div>
                      </Grid>
                    </Grid>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Mobile">
                    <Grid container className="text-center" direction="row" justify="center" alignItems="stretch">
                      <Grid item xs={12} className="d-flex">
                        <h3 className={`mx-auto textBorder mt-${theme.spacing.marginTopItem}`}>Mobile</h3>
                      </Grid>
                      <Grid item lg={4} md={6} sm={12} className="mt-5">
                        <div className="col-md-12">
                          <i className="fab fa-android brand-icon-size" />
                          <h3 className="w-100 textBorder">{t('android')}</h3>
                          <a className="w-100 button1" href="https://play.google.com/store/apps/details?id=org.runebase.wallet">
                            Google Play
                          </a>
                        </div>
                      </Grid>
                      <Grid item lg={4} md={6} sm={12} className="mt-5">
                        <div className="col-md-12">
                          <i className="fab fa-apple brand-icon-size" />
                          <h3 className="w-100 textBorder">IOS</h3>
                          <a className="w-100 button1" href="#">
                            {t('notAvailable')}
                          </a>
                        </div>
                      </Grid>
                    </Grid>
                  </Tab.Pane>
                  <Tab.Pane eventKey="Web">
                    <Grid container className="text-center" direction="row" justify="center" alignItems="stretch">
                      <Grid item xs={12} className="d-flex">
                        <h3 className={`mx-auto textBorder mt-${theme.spacing.marginTopItem}`}>Web</h3>
                      </Grid>
                      <Grid item lg={4} md={6} sm={12} className="mt-5">
                        <div className="col-md-12">
                          <i className="fas fa-globe brand-icon-size" />
                          <h3 className="w-100 textBorder">Web Wallet</h3>
                          <a className="w-100 button1" href="/wallet">
                            https://www.runebase.io/wallet
                          </a>
                        </div>
                      </Grid>
                    </Grid>
                  </Tab.Pane>
                </Tab.Content>
              </Grid>
            </Grid>
          </Tab.Container>
        </Grid>
      </div>
    );
  }
}

export default withTranslation()(Download);
