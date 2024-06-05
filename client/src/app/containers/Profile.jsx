import React, {
  useEffect, useState, useRef, useCallback,
} from 'react';
import {
  Grid,
  Button,
  Tooltip,
  Modal,
  CircularProgress,
} from '@material-ui/core';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import ReactCrop from 'react-image-crop';
import Referrals from './Referrals';
import 'react-image-crop/dist/ReactCrop.css';
import uploadAvatarAction from '../actions/uploadAvatar';
import 'blueimp-canvas-to-blob/js/canvas-to-blob';
// Increase pixel density for crop preview quality on retina screens.
const pixelRatio = window.devicePixelRatio || 1;

// We resize the canvas down when saving on retina devices otherwise the image
// will be double or triple the preview size.
function getResizedCanvas(canvas, newWidth, newHeight) {
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;

  const ctx = tmpCanvas.getContext('2d');
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    newWidth,
    newHeight,
  );

  return tmpCanvas;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: 'auto',
    position: 'absolute',
    width: '80vw',
    height: '80vh',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Profile = (props) => {
  const {
    user,
    uploadAvatar,
  } = props;
  const dispatch = useDispatch();
  const [upImg, setUpImg] = useState(false);
  const classes = useStyles();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const inputFile = useRef(null)
  const [crop, setCrop] = useState({ unit: 'px', width: 100, aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [modalStyle] = React.useState(getModalStyle);
  const [rerender, setRerender] = useState(1);

  useEffect(() => {
    setUpImg(false)
  }, [uploadAvatar]);
  useEffect(() => {

  }, [user]);

  const handleClose = () => {
    setUpImg(false);
  }

  const uploadAvatarImage = (previewCanvas, crop) => {
    if (!crop || !previewCanvas) {
      return;
    }

    const canvas = getResizedCanvas(previewCanvas, crop.width, crop.height);

    canvas.toBlob(
      (blob) => {
        console.log('download image');
        dispatch(uploadAvatarAction(blob));
      },
      'image/png',
      1,
    );
    setRerender(rerender + 1);
  }

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
  }, [completedCrop]);

  const onAvatarClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  return (
    <Grid container>
      <Grid item xs={4}>
        <div className="avatar-image-wrapper">
          <div className="avatar-image" onClick={onAvatarClick}>
            <img src={`/uploads/avatars/${user.avatar_path}`} alt="Avatar" />
            <span className="avatarEditHoverText">Edit</span>
          </div>
        </div>
        <div className="avater-username">
          <p>
            {user ? user.username : ''}
          </p>
        </div>
      </Grid>
      <div className="App">
        <div>
          <input key={rerender} style={{ display: 'none' }} type="file" accept="image/*" onChange={onSelectFile} ref={inputFile} />
        </div>
        <Modal
          open={upImg}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <Grid container className="height100" alignItems="center">
              <Grid
                item
                xs={4}
                align="center"
                style={{ padding: '20px' }}
              >
                <div className="w-100">
                  <div className="avatar-image">
                    <canvas
                      ref={previewCanvasRef}
                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                      style={{
                        width: '100px',
                        height: '100px',
                      }}
                    />
                  </div>

                </div>
                {
                      uploadAvatar
                      && uploadAvatar.isFetching
                        ? (<CircularProgress disableShrink />)
                        : (
                          <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => uploadAvatarImage(previewCanvasRef.current, completedCrop)}
                          >
                            Upload
                          </Button>
                        )
                    }
                <div style={{ paddingTop: '20px' }}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </div>

              </Grid>
              <Grid
                item
                xs={8}
                style={{
                  overflow: 'auto',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                }}
              >
                <div style={{ height: '100%' }}>
                  <ReactCrop
                    src={upImg}
                    onImageLoaded={onLoad}
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                  />
                </div>

              </Grid>
            </Grid>
            <div />

          </div>
        </Modal>

      </div>
      <Referrals
        user={user || []}
      />
    </Grid>
  )
}

const mapStateToProps = (state) => {
  console.log(state.uploadAvatar);
  return {
    uploadAvatar: state.uploadAvatar,
  }
}

export default connect(mapStateToProps, null)(Profile);
