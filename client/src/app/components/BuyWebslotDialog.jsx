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
import { executeBuyWebslot, idleBuyWebslot } from '../actions/buyWebslot';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AlertDialogSlide = (props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    props.idleBuyWebslot();
    setOpen(true);
  };

  const handleClose = () => {
    props.idleBuyWebslot();
    setOpen(false);
  };

  const buyWebslot = () => {
    props.executeBuyWebslot();
    // deactivateWebslot();
  };

  useEffect(() => {
    if (props.buyWebslot.phase === 1) {
      setOpen(false);
    }
  }, [props.buyWebslot.phase]);

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
        Buy now
      </Button>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >

        {props.buyWebslot.phase === 1 && (
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
        {props.buyWebslot.phase === 2 && (
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
        {props.buyWebslot.phase === 0 && (
        <DialogTitle id="alert-dialog-slide-title">
          Are you sure you want to purchase an extra webslot?
        </DialogTitle>
        )}

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.buyWebslot.phase === 0 && !props.buyWebslot.isFetching && (
              <>
                <p>
                  are you sure?
                </p>
              </>
            )}
            {props.buyWebslot.isFetching && (
            <CircularProgress disableShrink />
            )}
          </DialogContentText>
        </DialogContent>
        {props.buyWebslot.phase === 0 && !props.buyWebslot.isFetching && (
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={buyWebslot} color="primary">
            Yes
          </Button>
        </DialogActions>
        )}
        {props.buyWebslot.isFetching && (
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
    buyWebslot: state.buyWebslot,
  }
}

const mapDispatchToProps = (dispatch) => ({
  executeBuyWebslot: () => dispatch(executeBuyWebslot()),
  idleBuyWebslot: () => dispatch(idleBuyWebslot()),
})

// export default AlertDialogSlide;

export default connect(mapStateToProps, mapDispatchToProps)(AlertDialogSlide);
