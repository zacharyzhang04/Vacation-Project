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
            <div ref={ref} style={style} id="map" />
            <Marker position={{lat:0, lng:0}} map={map} content="FUCKLSDJFLSDJFLSDKJ"/>
        </>
    );
}

const Marker = ({ position, map, content }) => {
    const [marker, setMarker] = useState(null);
    const [infoWindow, setInfoWindow] = useState(null);
  
    useEffect(() => {
      const newMarker = new window.google.maps.Marker({});
      const newInfoWindow = new window.google.maps.InfoWindow({content: content});
  
      setMarker(newMarker);
      setInfoWindow(newInfoWindow);
  
      return () => {
        newMarker.setMap(null);
        newInfoWindow.close();
      };
    }, [content]);
  
    useEffect(() => {
      if (marker && map) {
        marker.setMap(map);
        marker.setPosition(position);
        const handleClick = () => {
          infoWindow.open(map, marker);
        };
        marker.addListener('click', handleClick);
      }
    }, [marker, map, position, infoWindow]);
  
    return null;
};


const ChooseDestinationPage = () => {
    return <Wrapper apiKey={process.env.REACT_APP_GMAPS_API_KEY}>
        <MyMap />
    </Wrapper>
};

export default ChooseDestinationPage;