import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Grid,
  Button,
  Fab,
  Tooltip,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import StarIcon from '@material-ui/icons/Star';
import Moment from 'react-moment';
import AddIcon from '@material-ui/icons/Add';
// import { format } from 'timeago.js';
import PropTypes from 'prop-types';
import CreateWebslot from '../components/CreateWebslot';
import CreateOrder from '../components/CreateOrder';
import WebslotOrderList from '../components/WebslotOrderList';
import RemoveWebslotDialog from '../components/RemoveWebslotDialog';
import BuyWebslot from '../components/BuyWebslot';
import SurfOrdersChart from './SurfOrdersChart';

const renderWebslots = (
  webslotProp,
  userProp,
  setWebslotData,
  setSurfSlotPath,
  setWebslotOrderData,
) => {
  const webslots = webslotProp && webslotProp || [];

  return webslots.map((webslot, i) => {
    const url = (
      `${webslot.protocol || ''

      }//${

        webslot.subdomain && `${webslot.subdomain}.` || ''

      }${webslot.domain && webslot.domain.domain || ''

      }${webslot.path && webslot.path || ''

      }${webslot.search && webslot.search || ''}`
    ).trim() || null;
    // const url = webslot && webslot.protocol ? webslot.protocol.concat('//', webslot.subdomain, '') : '';
    return (
      <Grid
        container
        item
        xs={12}
        sm={4}
        md={4}
        className="webslotContainer"
        style={{ padding: '20px' }}
      >
        <Grid container item xs={6}>
          <span className="webslotId">
            id: #
            {webslot.id}
          </span>
        </Grid>
        <Grid container item xs={6} justify="flex-end">
          <RemoveWebslotDialog
            webslot={webslot || {}}
          />
        </Grid>
        <Grid container item xs={12}>
          <span className="dashboardWalletItem">{url}</span>
        </Grid>
        <Grid container item xs={12}>
          <p>Domain stats</p>
        </Grid>
        <Grid container item xs={4}>
          <Grid item xs={12}>
            <span className="dashboardWalletItem">
              <StarIcon className="reputation-star" style={{ '--rating': webslot.domain.reputation }} />
            </span>
          </Grid>
          <Grid item xs={12}>
            <span className="dashboardWalletItem">
              {webslot.domain.reputation}
            </span>
          </Grid>
        </Grid>

        <Grid container item xs={4}>
          <Grid item xs={12}>
            <span className="dashboardWalletItem">
              <LiveTvIcon />
            </span>
          </Grid>

          <span className="dashboardWalletItem">{webslot.domain.views}</span>

        </Grid>
        <Grid container item xs={4}>
          <Grid item xs={12}>
            <span className="dashboardWalletItem">
              <VisibilityIcon />
            </span>
          </Grid>
          <span className="dashboardWalletItem">
            Last viewed
            &nbsp;
            <Moment interval={1000} fromNow>{webslot.domain.updatedAt}</Moment>
          </span>
        </Grid>
        <Grid container item xs={12}>
          <p>Webslot stats</p>
        </Grid>
        <Grid container item xs={4}>
          <Grid item xs={12}>
            <span className="dashboardWalletItem">
              <StarIcon className="reputation-star" style={{ '--rating': webslot.reputation }} />
            </span>
          </Grid>
          <Grid item xs={12}>
            <span className="dashboardWalletItem">
              {webslot.reputation}
            </span>
          </Grid>
        </Grid>

        <Grid container item xs={4}>
          <Grid item xs={12}>
            <span className="dashboardWalletItem">
              <LiveTvIcon />
            </span>
          </Grid>

          <span className="dashboardWalletItem">{webslot.views}</span>
        </Grid>
        <Grid container item xs={4}>
          <Grid item xs={12}>
            <span className="dashboardWalletItem">
              <VisibilityIcon />
            </span>
          </Grid>
          <span className="dashboardWalletItem">
            Last viewed
            &nbsp;
            <Moment
              interval={1000}
              fromNow
            >
              {webslot.updatedAt}
            </Moment>
          </span>
        </Grid>
        <Grid container spacing={1}>
          {/* <Grid container item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
            >
              Preview
            </Button>
    </Grid> */}
          <Grid container item xs={6}>
            <Tooltip title="Create Order" aria-label="add">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSurfSlotPath('bidSurfSlot');
                  setWebslotData(webslot);
                }}
                fullWidth
              >
                Bid
              </Button>
            </Tooltip>
          </Grid>
          <Grid container item xs={6}>
            <Tooltip title="Show my Orders" aria-label="show">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSurfSlotPath('surfSlotOrderList');
                  // setWebslotOrderData(webslot.order);
                  setWebslotData(webslot);
                }}
                fullWidth
              >
                Orders (
                {webslot.order.length}
                )
              </Button>
            </Tooltip>

          </Grid>
        </Grid>
      </Grid>
    );
  })
}

const WebSlotsContainer = (props) => {
  const {
    webslots,
    user,
  } = props;
  const dispatch = useDispatch();
  const [surfSlotPath, setSurfSlotPath] = useState('surfSlotList');
  const [webslotData, setWebslotData] = useState({});
  const [webslotOrderData, setWebslotOrderData] = useState({});

  useEffect(() => {
    if (webslots) {
      webslots.map((webslot) => {
        if (webslot.id === webslotData.id) {
          setWebslotData(webslot);
        }
        return true;
      })
    }
  }, [webslots]);

  return (
    <>
      { surfSlotPath === 'surfSlotList' && (
        <>
          <Grid container item xs={12}>
            <Grid item xs={12} className="glassHeader">
              <h3>
                Surf Slots (
                {webslots.length}
                /
                {user.webslot_amount}
                )
              </h3>
            </Grid>
            {
            webslots.length >= user.webslot_amount && <BuyWebslot />
          }
            {
            webslots.length < user.webslot_amount && (
              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
                item
                xs={12}
                sm={4}
                md={4}
              >
                <Tooltip title="Add Website" aria-label="add">
                  <Fab
                    color="primary"
                    onClick={() => setSurfSlotPath('createSurfSlot')}
                  >
                    <AddIcon />
                  </Fab>
                </Tooltip>

              </Grid>

            )
          }
            {
            renderWebslots(webslots, user, setWebslotData, setSurfSlotPath, setWebslotOrderData)
          }
          </Grid>
          <Grid container item xs={12}>
            <SurfOrdersChart />
          </Grid>
        </>
      )}
      { surfSlotPath === 'createSurfSlot' && (
        <Grid container item xs={12}>
          <CreateWebslot
            back={() => setSurfSlotPath('surfSlotList')}
          />
        </Grid>
      )}
      { surfSlotPath === 'bidSurfSlot' && (
        <Grid container item xs={12}>
          <CreateOrder
            back={() => setSurfSlotPath('surfSlotList')}
            webslotData={webslotData}
          />
        </Grid>
      )}
      { surfSlotPath === 'surfSlotOrderList' && (
        <Grid container item xs={12}>
          <WebslotOrderList
            back={() => setSurfSlotPath('surfSlotList')}
            // orders={webslotOrderData}
            webslotData={webslotData}
          />
        </Grid>
      )}
    </>
  )
}
WebSlotsContainer.defaultProps = {
  webslots: [],
};

WebSlotsContainer.propTypes = {
  webslots: PropTypes.shape([]),
}

export default WebSlotsContainer;
