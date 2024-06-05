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
import { cancelWebslotOrder, idleCancelWebslotOrder } from '../actions/cancelWebslotOrder';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AlertDialogSlide = (props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    props.idleCancelWebslotOrder();
    setOpen(true);
  };

  const handleClose = () => {
    props.idleCancelWebslotOrder();
    setOpen(false);
  };

  const removeWebslotOrder = () => {
    props.cancelWebslotOrder({ orderId: props.order.orderId })
    // deactivateWebslot();
    console.log('Cancel Webslot Order');
  };

  useEffect(() => {
    if (props.removeWebslotOrder.phase === 1) {
      setTimeout(() => { setOpen(false); }, 2000);
    }
  }, [props.removeWebslotOrder.phase]);

  // useEffect(() => {}, [props.order.surfTicket]);

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

        {props.removeWebslotOrder.phase === 1 && (
        <DialogTitle id="alert-dialog-slide-title">
          Successfully canceled order #
          {props.removeWebslotOrder && props.removeWebslotOrder.data && props.removeWebslotOrder.data.order ? props.removeWebslotOrder.data.order.id : ''}
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
        {props.removeWebslotOrder.phase === 2 && (
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
        {props.removeWebslotOrder.phase === 0 && (
        <DialogTitle id="alert-dialog-slide-title">
          Are you sure you want to cancel order #
          {props.order && props.order.orderId}
          ?
        </DialogTitle>
        )}

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.removeWebslotOrder.phase === 0 && !props.removeWebslotOrder.isFetching && (
              <>
                <p>
                  {props.order.amount}
                  {' '}
                  (views) -
                  {' '}
                  {props.order.filled}
                  {' '}
                  (filled) -
                  {' '}
                  {props.order.surfTicket.length}
                  {' '}
                  (active viewers) =
                  {' '}
                  {props.order.amount - props.order.filled - props.order.surfTicket.length}
                  {' '}
                  (Views left)
                </p>
                <p>
                  {props.order.amount - props.order.filled - props.order.surfTicket.length}
                  {' '}
                  (Views left)
                  {' '}
                  *
                  {' '}
                  {props.order.price / 1e8}
                  {' '}
                  (Price/View)
                  {' '}
                  =
                  {' '}
                  {((props.order.amount - props.order.filled - props.order.surfTicket.length) * props.order.price) / 1e8}
                  {' '}
                  RUNES
                  {' '}
                  (Total)
                </p>
              </>
            )}
            {props.removeWebslotOrder.isFetching && (
            <CircularProgress disableShrink />
            )}
          </DialogContentText>
        </DialogContent>
        {props.removeWebslotOrder.phase === 1 && !props.removeWebslotOrder.isFetching && (
        <span />
        )}
        {props.removeWebslotOrder.phase === 2 && !props.removeWebslotOrder.isFetching && (
        <span />
        )}
        {props.removeWebslotOrder.phase === 0 && !props.removeWebslotOrder.isFetching && (
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={removeWebslotOrder} color="primary">
            Yes
          </Button>
        </DialogActions>
        )}
        {props.removeWebslotOrder.isFetching && (
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
    removeWebslotOrder: state.removeWebslotOrder,
  }
}

const mapDispatchToProps = (dispatch) => ({
  cancelWebslotOrder: (orderId) => dispatch(cancelWebslotOrder(orderId)),
  idleCancelWebslotOrder: () => dispatch(idleCancelWebslotOrder()),
})

// export default AlertDialogSlide;

export default connect(mapStateToProps, mapDispatchToProps)(AlertDialogSlide);
