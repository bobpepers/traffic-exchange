import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { withTranslation, useTranslation } from 'react-i18next';
import Particles from 'react-particles-js';

import socketIOClient from 'socket.io-client';
import theme from '../theme';

// const ENDPOINT = 'http://localhost:8080/';
// const socket = socketIOClient(ENDPOINT);

const Footer = () => (
  <Grid
    container
    style={{
      backgroundColor: '#000', zIndex: '0', width: '100%', height: '100%',
    }}
    className="text-center footerBG"
    direction="row"
    justify="center"
    alignItems="stretch"
  >
    {/* <canvas id='particlewave' style={{position: 'absolute', display: 'block', width: '100%', height: '100%'}}>
        </canvas> */}
    <Grid
      container
      id="pariclewaveHeight"
      style={{
        position: 'relative', zIndex: '0', width: '100%', height: '100%',
      }}
      className={`pt-${theme.spacing.section}`}
    >
      <div style={{
        position: 'absolute', top: '0', bottom: '0', zIndex: '0', width: '100%', height: '100%',
      }}
      >
        <Particles
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          params={{
            particles: {
              number: {
                value: 60,
                density: {
                  enable: true,
                  value_area: 1500,
                },
              },
              line_linked: {
                enable: true,
                opacity: 0.02,
              },
              move: {
                direction: 'right',
                speed: 0.05,
              },
              size: {
                value: 1,
              },
              opacity: {
                anim: {
                  enable: true,
                  speed: 1,
                  opacity_min: 0.05,
                },
              },
            },
            interactivity: {
              events: {
                onclick: {
                  enable: true,
                  mode: 'push',
                },
              },
              modes: {
                push: {
                  particles_nb: 1,
                },
              },
            },
            retina_detect: true,
          }}
        />

      </div>
      <Grid item lg={4} md={6} sm={12} xs={12} className="zindexThree">
        <h2>{t('documentation')}</h2>
        <ul>
          <li>
            <a href="https://github.com/Runebase/runebase/wiki/Staking">{t('howToStake')}</a>
          </li>
          <li>
            <a href="https://github.com/Runebase/runebase/wiki/rrc223">{t('rrc223Token')}</a>
          </li>
        </ul>
      </Grid>
      <Grid item lg={4} md={6} sm={12} xs={12} className="zindexThree">
        <h2>{t('resources')}</h2>
        <ul>
          <li>
            <a href="https://github.com/runebase">Github</a>
          </li>
          <li>
            <a href="https://downloads.runebase.io/paper.pdf">{t('projectInfo')}</a>
          </li>
        </ul>
      </Grid>
      <Grid item lg={4} md={6} sm={12} xs={12} className="zindexThree">
        <h2>{t('channels')}</h2>
        <ul>
          <li>
            <a href="https://discord.gg/uTUXr43">Discord</a>
          </li>
          <li>
            <a href="https://www.medium.com/@runebase">Medium</a>
          </li>
          <li>
            <a href="https://www.facebook.com/runebaseofficial">Facebook</a>
          </li>
          <li>
            <a href="https://twitter.com/Runebase_Tweet">Twitter</a>
          </li>
          <li>
            <a href="https://t.me/runebase_runes">{t('telegram_official')}</a>
          </li>
          <li>
            <a href="https://t.me/Runesbase">{t('telegram_international')}</a>
          </li>
          <li>
            <a href="https://t.me/Runebaseoficial">{t('telegram_brazil')}</a>
          </li>
          <li>
            <a href="https://t.me/runesafrica">{t('telegram_africa')}</a>
          </li>
        </ul>
      </Grid>
      <Grid item lg={4} md={6} sm={12} xs={12} className="zindexThree">
        <h2>{t('exchanges')}</h2>
        <ul>
          <li>
            <a href="https://altmarkets.io/">Altmarkets.io</a>
          </li>
          <li>
            <a href="https://txbit.io/Trade/RUNES/BTC">Txbit.io</a>
          </li>
          <li>
            <a href="https://fanaticoscriptos.exchange/#/markets/BTC/RUNES">FanaticosCriptos.exchange</a>
          </li>
        </ul>
      </Grid>
      <Grid item lg={4} md={6} sm={12} xs={12} className="zindexThree">
        <h2>{t('ranking')}</h2>
        <ul>
          <li>
            <a href="https://coinmarketcap.com/currencies/runebase/">CoinMarketCap</a>
          </li>
          <li>
            <a href="https://coinpaprika.com/coin/runes-runebase/">CoinPaprika</a>
          </li>
          <li>
            <a href="https://www.coingecko.com/en/coins/runebase/">CoinGecko</a>
          </li>
          <li>
            <a href="https://blockspot.io/coin/runebase">BlockSpot</a>
          </li>
          <li>
            <a href="https://cmc.io/coins/runebase">CMC</a>
          </li>
          <li>
            <a href="https://athcoinindex.com/coin/runebase">AthCoinIndex</a>
          </li>
          <li>
            <a href="https://www.advfn.com/crypto/Runebase-RUNES">Advfn</a>
          </li>
          <li>
            <a href="https://cryptoprices123.com/cryptos/runes-runebase">CryptoPrices123</a>
          </li>
          <li>
            <a href="https://coinexpressway.com/Coin/runebase">CoinExpressWay</a>
          </li>
          <li>
            <a href="https://globalcoinlisting.com/currency/runebase">GlobalCoinListing</a>
          </li>
          <li>
            <a href="https://coincost.net/en/currency/runebase">CoinCost</a>
          </li>
          <li>
            <a href="https://www.moonstats.com/runes-runebase">MoonStats</a>
          </li>
          <li>
            <a href="https://comaps.io/coin/runebase">CoMaps</a>
          </li>
          <li>
            <a href="https://cryptocurrencyliveprices.com/coin.php?id=Runebase">CryptoCurrencyLivePrices</a>
          </li>
          <li>
            <a href="https://coingolive.com/en/coins/runebase/brl">CoinGoLive</a>
          </li>
        </ul>
      </Grid>
      {/*
                <Grid item xs={3}>
                    <h2>{t('pools')}</h2>
                    <ul>
                        <li>
                            <a href="https://staking.world/">Staking.world</a>
                        </li>
                        <li>
                            <a href="https://www.4stake.com/">4stake.com</a>
                        </li>
                    </ul>
                </Grid>
                */}
      <Grid item lg={4} md={6} sm={12} xs={12} className="zindexThree">
        <h2>{t('contact')}</h2>
        <ul>
          <li>
            <a href="mailto:support@runebase.io">support@runebase.io</a>
          </li>
        </ul>
      </Grid>
    </Grid>
  </Grid>
)

export default withTranslation()(Footer);
