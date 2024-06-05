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
import { deactivateWebslot, idleDeactivateWebslot } from '../actions/webslot';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AlertDialogSlide = (props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    props.idleDeactivateWebslot();
    setOpen(true);
  };

  const handleClose = () => {
    props.idleDeactivateWebslot();
    setOpen(false);
  };

  const removeWebslot = () => {
    props.deactivateWebslot({ webslotId: props.webslot.id })
    // deactivateWebslot();
    console.log('deactivate webslot');
  };

  useEffect(() => {
    if (props.removeWebslot.phase === 1) {
      setTimeout(() => { setOpen(false); }, 2000);
    }
  }, [props.removeWebslot.phase]);

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

        {props.removeWebslot.phase === 1 && (
        <DialogTitle id="alert-dialog-slide-title">
          Successfully deactivated webslot #
          {props.removeWebslot.data.webslot.id}
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
        {props.removeWebslot.phase === 2 && (
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
        {props.removeWebslot.phase === 0 && (
        <DialogTitle id="alert-dialog-slide-title">
          Are you sure you want to deactivate webslot #
          {props.webslot.id}
          ?
        </DialogTitle>
        )}

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.removeWebslot.phase === 1 && !props.removeWebslot.isFetching && (
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
              <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
              <polyline className="path check" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
            </svg>
            )}
            {props.removeWebslot.phase === 2 && !props.removeWebslot.isFetching && (
            <>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                <circle className="path circle" fill="none" stroke="#D06079" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
                <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
              </svg>
              <p>{props.removeWebslot.error}</p>
            </>
            )}
            {props.removeWebslot.phase === 0 && !props.removeWebslot.isFetching && (
              <>
              </>
            )}
            {props.removeWebslot.isFetching && (
            <CircularProgress disableShrink />
            )}
          </DialogContentText>
        </DialogContent>
        {props.removeWebslot.phase === 1 && !props.removeWebslot.isFetching && (
        <span />
        )}
        {props.removeWebslot.phase === 2 && !props.removeWebslot.isFetching && (
        <span />
        )}
        {props.removeWebslot.phase === 0 && !props.removeWebslot.isFetching && (
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={removeWebslot} color="primary">
            Deactivate
          </Button>
        </DialogActions>
        )}
        {props.removeWebslot.isFetching && (
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
    removeWebslot: state.removeWebslot,
  }
}

const mapDispatchToProps = (dispatch) => ({
  deactivateWebslot: (webslotId) => dispatch(deactivateWebslot(webslotId)),
  idleDeactivateWebslot: () => dispatch(idleDeactivateWebslot()),
})

// export default AlertDialogSlide;

export default connect(mapStateToProps, mapDispatchToProps)(AlertDialogSlide);
