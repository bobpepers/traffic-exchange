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
import { executebuyPublisherslot, idlebuyPublisherslot } from '../actions/buyPublisherSlot';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const BuyPublisherSlotDialog = (props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    props.idlebuyPublisherslot();
    setOpen(true);
  };

  const handleClose = () => {
    props.idlebuyPublisherslot();
    setOpen(false);
  };

  const buyPublisherslot = () => {
    props.executebuyPublisherslot();
    // deactivateWebslot();
  };

  useEffect(() => {
    if (props.buyPublisherslot.phase === 1) {
      setOpen(false);
    }
  }, [props.buyPublisherslot.phase]);

  // useEffect(() => {}, [props.order.surfTicket]);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        // className="webslotClose"
        onClick={handleClickOpen}
        role="button"
        aria-hidden="true"
      >
        Buy extra slot
      </Button>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >

        {props.buyPublisherslot.phase === 1 && (
        <DialogTitle id="alert-dialog-slide-title">
          Successfully canceled order #
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
        {props.buyPublisherslot.phase === 2 && (
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
        {props.buyPublisherslot.phase === 0 && (
        <DialogTitle id="alert-dialog-slide-title">
          Are you sure you want to purchase an extra publisher slot?
        </DialogTitle>
        )}

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.buyPublisherslot.phase === 0 && !props.buyPublisherslot.isFetching && (
              <>
                <p>
                  Cost: 15000
                </p>
                <p>
                  are you sure you want to buy an extra publisher slot for 15000 RUNES?
                </p>
              </>
            )}
            {props.buyPublisherslot.isFetching && (
            <CircularProgress disableShrink />
            )}
          </DialogContentText>
        </DialogContent>
        {props.buyPublisherslot.phase === 0 && !props.buyPublisherslot.isFetching && (
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={buyPublisherslot} color="primary">
            Yes
          </Button>
        </DialogActions>
        )}
        {props.buyPublisherslot.isFetching && (
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
    buyPublisherslot: state.buyPublisherslot,
  }
}

const mapDispatchToProps = (dispatch) => ({
  executebuyPublisherslot: () => dispatch(executebuyPublisherslot()),
  idlebuyPublisherslot: () => dispatch(idlebuyPublisherslot()),
})

// export default AlertDialogSlide;

export default connect(mapStateToProps, mapDispatchToProps)(BuyPublisherSlotDialog);
