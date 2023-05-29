import React, {useState, useRef, useEffect} from 'react';
import { Wrapper } from "@googlemaps/react-wrapper";

const  MyMap = () => {
    const [map, setMap] = useState();
    const ref = useRef();
    const style = { height: "100vh" }

  
    useEffect(() => {
      setMap(new window.google.maps.Map(ref.current, {
        center: {lat: 0, lng: 0},
        zoom: 3
      }));
    }, []);
  
    return (
    <>
        <div ref={ref} style={style} id="map" />;
        <Marker position={{lat:0,lng:-50}} map={map}/>
    </>
    );
}

const Marker = (options) => {
    const [marker, setMarker] = useState();
  
    useEffect(() => {
        if (!marker) {
        setMarker(new window.google.maps.Marker());
        }
  
        // to remove marker from map on unmount it:
        return () => {
            if (marker) {
            marker.setMap(null);
            }
        };
    }, [marker]);

    useEffect(() => {
      if (marker) {
        marker.setOptions(options);
      }
    }, [marker, options]);

    return null;
  };
// const Marker = ({position, map}) => {
//     const [marker, setMarker] = useState();
//     useEffect(() => {
//         setMarker(new window.google.maps.Marker({}))
//     }, [])

//     if (marker) {
//         marker.setMap(map);
//         marker.setPosition(position);
//     }
// }

const ChooseDestinationPage = () => {
    return <Wrapper apiKey={process.env.REACT_APP_GMAPS_API_KEY} libraries={["marker"]}>
        <MyMap />
    </Wrapper>
};

export default ChooseDestinationPage;