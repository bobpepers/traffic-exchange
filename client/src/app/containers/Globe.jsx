import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import ReactGlobe from 'react-globe';
import {
  Grid,
  Link,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import SearchIcon from '@material-ui/icons/Search';
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import { getRequestRegister } from '../actions/registered';
import runebaseloop from '../assets/images/runebaseloop.gif';
import theme from '../theme';

// import optional tippy styles for tooltip support
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

function markerTooltipRenderer(marker) {
  return `CITY: ${marker.city} (Value: ${marker.value})`;
}

const options = {
  markerTooltipRenderer,
};

const Global = (props) => {
  const { t } = props;

  const randomMarkers = ([
    {
      id: 1,
      city: 'Singapore',
      color: 'red',
      coordinates: [1.3521, 103.8198],
      value: 50,
    },
    {
      id: 2,
      city: 'New York',
      color: 'blue',
      coordinates: [40.73061, -73.935242],
      value: 25,
    },
    {
      id: 3,
      city: 'San Francisco',
      color: 'orange',
      coordinates: [37.773972, -122.431297],
      value: 35,
    },
    {
      id: 4,
      city: 'Beijing',
      color: 'gold',
      coordinates: [39.9042, 116.4074],
      value: 0,
    },
    {
      id: 5,
      city: 'London',
      color: 'green',
      coordinates: [51.5074, 0.1278],
      value: 80,
    },
  ]).map((marker) => ({
    ...marker,
    value: Math.floor(Math.random() * 100),
  }));
  const [markers, setMarkers] = useState([]);
  const [event, setEvent] = useState(null);
  const [details, setDetails] = useState(null);
  function onClickMarker(marker, markerObject, event) {
    setEvent({
      type: 'CLICK',
      marker,
      markerObjectID: markerObject.uuid,
      pointerEventPosition: { x: event.clientX, y: event.clientY },
    });
    setDetails(markerTooltipRenderer(marker));
  }
  function onDefocus(previousFocus) {
    setEvent({
      type: 'DEFOCUS',
      previousFocus,
    });
    setDetails(null);
  }

  return (
    <div className="margin-runebase-container" style={{ width: '120px' }}>
      <ReactGlobe
        globeBackgroundTexture={null}
        globeTexture="https://unpkg.com/three-globe/example/img/earth-night.jpg"
        globeCloudsTexture="https://unpkg.com/three-globe/example/img/earth-topology.png"
        height="50vh"
        markers={randomMarkers}
        options={options}
        width="50vw"
        onClickMarker={onClickMarker}
        onDefocus={onDefocus}
        backgroundColor="transparent"
      />
    </div>
  )
}

const mapStateToProps = (state) => ({
  registered: state.registered.people,
  online: state.online.people,
})

export default connect(mapStateToProps)(Global);
