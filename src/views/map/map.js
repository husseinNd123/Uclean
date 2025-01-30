import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  StandaloneSearchBox,
  DrawingManager,
  Polyline,
  Polygon,
} from "@react-google-maps/api";
import { MdDelete, MdMyLocation } from "react-icons/md";
import { Button } from "@chakra-ui/react";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = { lat: 41.9028, lng: 12.4964 }; // Updated to coordinates in Italy

const Map = ({
  onPointSelect,
  onPolygonComplete,
  onTraceComplete,
  polygonDrawingEnabled = false, // Set default to false
  initialPolygon,
  onLocationSelect, // Add this line
}) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [drawings, setDrawings] = useState([]);
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });
  // const [tracing, setTracing] = useState(false);
  // const [pathPoints, setPathPoints] = useState([]);
  // const [watchId, setWatchId] = useState(null);

  const searchBoxRef = useRef(null);
  // const drawingManagerRef = useRef(null);
  const libraries = useMemo(() => ["places", "drawing"], []);
  const onMapLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onMapClick = useCallback(
    (e) => {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(newPos);
      setSelectedMarker(newPos);
      onPointSelect(newPos);
      onLocationSelect(newPos); // Add this line
    },
    [onPointSelect, onLocationSelect]
  );

  const onMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
  }, []);

  const onPlacesChanged = useCallback(() => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length) {
      const place = places[0];
      const latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMarkers([latLng]);
      map.fitBounds(place.geometry.viewport);
      setSelectedMarker(latLng);
      setMarkerPosition(latLng);
    }
  }, [map]);

  // const onOverlayComplete = useCallback((e) => {
  //   if (e.type === "polygon") {
  //     const newDrawing = e.overlay;
  //     newDrawing.type = e.type;
  //     const path = newDrawing
  //       .getPath()
  //       .getArray()
  //       .map((p) => ({
  //         lat: p.lat(),
  //         lng: p.lng(),
  //       }));
  //     setDrawings((prevDrawings) => [...prevDrawings, newDrawing]);
  //     calculatePolygonArea(path); // Calculate and return the area
  //   }
  // }, []);

  // const calculatePolygonArea = useCallback(
  //   (path) => {
  //     if (window.google && window.google.maps && window.google.maps.geometry) {
  //       const areaInSquareMeters =
  //         window.google.maps.geometry.spherical.computeArea(
  //           path.map(
  //             (point) => new window.google.maps.LatLng(point.lat, point.lng)
  //           )
  //         );

  //       const areaInHectares = areaInSquareMeters / 10000; // Convert to hectares
  //       onPolygonComplete(path, areaInHectares); // Call onPolygonComplete with path and area in hectares
  //     } else {
  //       console.error("Google Maps API not loaded.");
  //     }
  //   },
  //   [onPolygonComplete]
  // );

  // const calculateTracingLength = useCallback(() => {
  //   if (window.google && window.google.maps && window.google.maps.geometry) {
  //     const area = window.google.maps.geometry.spherical.computeArea(
  //       pathPoints.map(
  //         (point) => new window.google.maps.LatLng(point.lat, point.lng)
  //       )
  //     );
  //     onTraceComplete(pathPoints, area); // Call onTraceComplete with pathPoints and length
  //   } else {
  //     console.error("Google Maps API not loaded.");
  //   }
  // }, [pathPoints, onTraceComplete]);

  const clearDrawings = useCallback(() => {
    drawings.forEach((drawing) => {
      drawing.setMap(null);
    });
    setDrawings([]);
    setMarkers([]);
    setSelectedMarker(null);
    // setPathPoints([]);
  }, [drawings]);

  const handleLocationClick = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMarkers((current) => [...current, { ...pos }]);
          map.panTo(pos);
          map.setZoom(15);
          onLocationSelect(pos); // Add this line
        },
        () => {
          alert("Failed to get your location");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, [map, onLocationSelect]);

  // const handleTraceToggle = useCallback(() => {
  //   if (tracing) {
  //     setTracing(false);
  //     if (watchId !== null) {
  //       clearInterval(watchId);
  //       setWatchId(null);
  //     }
  //     calculateTracingLength(); // Calculate and return the length
  //   } else {
  //     setTracing(true);
  //     setPathPoints([]);
  //     const getLocation = () => {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const newPoint = {
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude,
  //           };
  //           setPathPoints((prevPoints) => {
  //             const lastPoint = prevPoints[prevPoints.length - 1];
  //             const threshold = 0.0000001;
  //             if (lastPoint) {
  //               const isDifferent =
  //                 Math.abs(lastPoint.lat - newPoint.lat) >= threshold ||
  //                 Math.abs(lastPoint.lng - newPoint.lng) >= threshold;
  //               if (!isDifferent) {
  //                 return prevPoints;
  //               }
  //             }
  //             return [...prevPoints, newPoint];
  //           });
  //           setMarkerPosition(newPoint);
  //           map.panTo(newPoint);
  //         },
  //         (error) => {
  //           console.error("Error getting location:", error);
  //           alert("Failed to get your location");
  //         },
  //         { enableHighAccuracy: true }
  //       );
  //     };
  //     const id = setInterval(getLocation, 3000);
  //     setWatchId(id);
  //   }
  // }, [tracing, watchId, calculateTracingLength, map]);

  // useEffect(() => {
  //   if (initialPolygon && map) {
  //     const bounds = new window.google.maps.LatLngBounds();
  //     initialPolygon.forEach((point) => bounds.extend(point));
  //     map.fitBounds(bounds);
  //   }
  // }, [initialPolygon, map]);

  // useEffect(() => {
  //   return () => {
  //     if (watchId !== null) {
  //       clearInterval(watchId);
  //     }
  //   };
  // }, [watchId]);

  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={libraries}
      loadingElement={<div>Loading...</div>}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onMapLoad}
        onClick={onMapClick}
      >
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={marker}
            onClick={() => onMarkerClick(marker)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div>
              <h2>Marker Position:</h2>
              <p>Lat: {selectedMarker.lat.toFixed(6)}</p>
              <p>Lng: {selectedMarker.lng.toFixed(6)}</p>
            </div>
          </InfoWindow>
        )}

        {/* {pathPoints.length > 0 && (
          <Polyline
            path={pathPoints}
            options={{ strokeColor: "#FF0000", strokeWeight: 2 }}
          />
        )}

        {initialPolygon && (
          <Polygon
            paths={initialPolygon}
            options={{
              fillColor: "lightblue",
              fillOpacity: 0.5,
              strokeColor: "blue",
              strokeOpacity: 1,
              strokeWeight: 2,
            }}
          />
        )} */}

        {/* <DrawingManager
          onLoad={(ref) => (drawingManagerRef.current = ref)}
          onOverlayComplete={onOverlayComplete}
          options={{
            drawingControl: false, // Disable drawing control
          }}
        /> */}

        <Button
          leftIcon={<MdDelete />}
          onClick={clearDrawings}
          style={{
            position: "absolute",
            top: "180px",
            left: "8px",
            zIndex: 1000,
          }}
        ></Button>

        <Button
          leftIcon={<MdMyLocation />}
          onClick={handleLocationClick}
          // onClick={() => onMarkerClick(marker)}
          style={{
            position: "absolute",
            top: "230px",
            left: "8px",
            zIndex: 1000,
          }}
        ></Button>

        {/* Remove tracing button */}
        {/* <Button
          onClick={handleTraceToggle}
          disabled={!polygonDrawingEnabled}
          style={{
            position: "absolute",
            top: "280px",
            left: "8px",
            zIndex: 1000,
          }}
        >
          {tracing ? "Stop Tracing" : "Start Tracing"}
        </Button> */}

        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search places"
            style={{
              boxSizing: `border-box`,
              marginBottom: `8px`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              bottom: "0%",
              marginLeft: "-120px",
            }}
          />
        </StandaloneSearchBox>
      </GoogleMap>
    </LoadScript>
  );
};

Map.propTypes = {
  onPointSelect: PropTypes.func.isRequired,
  // onPolygonComplete: PropTypes.func.isRequired,
  // onTraceComplete: PropTypes.func.isRequired,
  // polygonDrawingEnabled: PropTypes.bool.isRequired,
  // initialPolygon: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     lat: PropTypes.number.isRequired,
  //     lng: PropTypes.number.isRequired,
  //   })
  // ),
  onLocationSelect: PropTypes.func.isRequired, // Add this line
};

export default Map;
