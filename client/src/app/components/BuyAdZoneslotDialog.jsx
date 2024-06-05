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
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import { executebuyAdzoneslot, idlebuyAdzoneslot } from '../actions/buyAdzoneSlot';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const buyAdzoneslotDialog = (props) => {
  const { selectedPublisher } = props;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    props.idlebuyAdzoneslot();
    setOpen(true);
  };

  const handleClose = () => {
    props.idlebuyAdzoneslot();
    setOpen(false);
  };

  const buyAdzoneslot = (id) => {
    console.log(id);
    console.log('selectedPublisher');
    props.executebuyAdzoneslot(id);
    // deactivateWebslot();
  };

  useEffect(() => {
    if (props.buyAdzoneslot.phase === 1) {
      setOpen(false);
    }
  }, [props.buyAdzoneslot.phase]);

  // useEffect(() => {}, [props.order.surfTicket]);

  return (
    <div className="w-100">
      <Button
        variant="contained"
        color="primary"
        // className="webslotClose"
        onClick={handleClickOpen}
        role="button"
        aria-hidden="true"
        fullWidth
      >
        <LocalAtmIcon />
        {' '}
        Buy Extra Adzone
      </Button>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >

        {props.buyAdzoneslot.phase === 1 && (
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
        {props.buyAdzoneslot.phase === 2 && (
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
        {props.buyAdzoneslot.phase === 0 && (
        <DialogTitle id="alert-dialog-slide-title">
          Are you sure you want to purchase an extra adzone slot for
          {' '}
          {selectedPublisher.domain.domain}
          ?
        </DialogTitle>
        )}

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.buyAdzoneslot.phase === 0 && !props.buyAdzoneslot.isFetching && (
              <>
                <p>
                  Cost: 15000
                </p>
                <p>
                  Are you sure you want to purchase an extra adzone slot for
                  {' '}
                  {selectedPublisher.domain.domain}
                  ?
                </p>
              </>
            )}
            {props.buyAdzoneslot.isFetching && (
            <CircularProgress disableShrink />
            )}
          </DialogContentText>
        </DialogContent>
        {props.buyAdzoneslot.phase === 0 && !props.buyAdzoneslot.isFetching && (
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={() => buyAdzoneslot(selectedPublisher.id)} color="primary">
            Yes
          </Button>
        </DialogActions>
        )}
        {props.buyAdzoneslot.isFetching && (
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
    buyAdzoneslot: state.buyAdzoneslot,
  }
}

const mapDispatchToProps = (dispatch) => ({
  executebuyAdzoneslot: (id) => dispatch(executebuyAdzoneslot(id)),
  idlebuyAdzoneslot: () => dispatch(idlebuyAdzoneslot()),
})

// export default AlertDialogSlide;

export default connect(mapStateToProps, mapDispatchToProps)(buyAdzoneslotDialog);
