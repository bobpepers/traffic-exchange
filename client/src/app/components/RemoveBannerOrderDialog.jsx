import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { cancelBannerOrder, idleCancelBannerOrder } from '../actions/banner';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AlertDialogSlide = (props) => {
  const {
    idleCancelBannerOrder,
    cancelBannerOrder,
    removeBannerOrder,
    order,
  } = props;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    idleCancelBannerOrder();
    setOpen(true);
  };

  const handleClose = () => {
    idleCancelBannerOrder();
    setOpen(false);
  };

  const removeCancelBannerOrder = () => {
    cancelBannerOrder({ orderId: order.orderId })
    // deactivateWebslot();
    console.log('Cancel Webslot Order');
  };

  useEffect(() => {
    if (removeBannerOrder.phase === 1) {
      setTimeout(() => { setOpen(false); }, 2000);
    }
  }, [removeBannerOrder.phase]);

  return (
    <div>
      <span
        className="webslotClose"
        onClick={handleClickOpen}
        role="button"
        aria-hidden="true"
      >
        <CloseIcon />
      </span>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >

        {removeBannerOrder.phase === 1 && (
        <DialogTitle id="alert-dialog-slide-title">
          Successfully canceled order #
          {removeBannerOrder && removeBannerOrder.data && removeBannerOrder.data.order ? removeBannerOrder.data.order.id : ''}
          <span
            className="webslotClose"
            onClick={handleClose}
            role="button"
            aria-hidden="true"
          >
            <CloseIcon />
          </span>
        </DialogTitle>
        )}
        {removeBannerOrder.phase === 2 && (
        <DialogTitle id="alert-dialog-slide-title">
          Failed
          <span
            className="webslotClose"
            onClick={handleClose}
            role="button"
            aria-hidden="true"
          >
            <CloseIcon />
          </span>
        </DialogTitle>
        )}
        {removeBannerOrder.phase === 0 && (
        <DialogTitle id="alert-dialog-slide-title">
          Are you sure you want to cancel order #
          {order && order.orderId}
          ?
        </DialogTitle>
        )}

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {removeBannerOrder.phase === 0 && !removeBannerOrder.isFetching && (
              <>
                <p>
                  {order.amount}
                  {' '}
                  (impressions) -
                  {' '}
                  {order.filled}
                  {' '}
                  (filled)
                  {' '}
                  =
                  {' '}
                  {order.amount - order.filled}
                  {' '}
                  (impressions left)
                </p>
                <p>
                  {order.amount - order.filled}
                  {' '}
                  (Impressions left)
                  {' '}
                  *
                  {' '}
                  {order.price / 1e8}
                  {' '}
                  (Price/Impressions)
                  {' '}
                  =
                  {' '}
                  {((order.amount - order.filled) * order.price) / 1e8}
                  {' '}
                  RUNES
                  {' '}
                  (Total)
                </p>
              </>
            )}
            {removeBannerOrder.isFetching && (
            <CircularProgress disableShrink />
            )}
          </DialogContentText>
        </DialogContent>
        {removeBannerOrder.phase === 0 && !removeBannerOrder.isFetching && (
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={removeCancelBannerOrder} color="primary">
            Yes
          </Button>
        </DialogActions>
        )}
        {removeBannerOrder.isFetching && (
        <DialogActions>
          <CircularProgress disableShrink />
        </DialogActions>
        )}
      </Dialog>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    removeBannerOrder: state.removeBannerOrder,
  }
}

const mapDispatchToProps = (dispatch) => ({
  cancelBannerOrder: (orderId) => dispatch(cancelBannerOrder(orderId)),
  idleCancelBannerOrder: () => dispatch(idleCancelBannerOrder()),
})

// export default AlertDialogSlide;

export default connect(mapStateToProps, mapDispatchToProps)(AlertDialogSlide);
