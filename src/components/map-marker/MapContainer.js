import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import Geosuggest from 'react-geosuggest';
import Grid from '@material-ui/core/Grid';

export class MapContainer extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        stores: [{placeId: 'ChIJOyH6ZBmEsUcRD',label: 'Old Elbe Tunnel, Hamburg', latitude: 53.5495629, longitude: 9.9625838}]
      }

      this.onSuggestSelect = this.onSuggestSelect.bind(this)
    }
  
    displayMarkers = () => {
      return this.state.stores.map((store, index) => {
        return <Marker key={index} id={index} position={{
         lat: store.latitude,
         lng: store.longitude
       }}
       onClick={() => console.log("You clicked me!")} >
         <InfoWindow>Info</InfoWindow>
       </Marker>
      })
    }

    onSuggestSelect(suggest) {
      console.log(suggest)
      if(suggest === undefined) return
      let stores = this.state.stores

      stores.push({
        placeId: suggest.placeId,
        label: suggest.label,
        latitude: suggest.location.lat,
        longitude: suggest.location.lng
      })

      this.setState({
        stores: stores
      })
      console.log(stores)
    }
  
    render() {
      const mapStyles = {
        width: '50%',
        height: '80%',
        position: 'inherit',
      };
      var fixtures = [
        {label: 'Old Elbe Tunnel, Hamburg', location: {lat: 53.5459, lng: 9.966576}}
      ];
      const google = window.google;
      return (
        <div>
           <Grid container spacing={3}>
            
            <Grid item xs={6} sm={6} container>
            <Map
            
              google={this.props.google}
              zoom={8}
              style={mapStyles}
              initialCenter={{ lat: 53.558572, lng: 9.9278215}}
            >
              {this.displayMarkers()}
            </Map>
            </Grid>
            <Grid item xs={6} sm={6} style={{ zIndex: '9' }}>
            <Geosuggest
              ref={el=>this._geoSuggest=el}
              placeholder="Start typing!"
              initialValue=""
              fixtures={fixtures}
              onSuggestSelect={this.onSuggestSelect}
              location={new google.maps.LatLng(53.558572, 9.9278215)}
              radius="20" />
              <button onClick={()=>this._geoSuggest.clear()}>Clear</button>
              <h3>Added locations: </h3>
              <ul>
                {this.state.stores  ? this.state.stores.map((item, index) => {
                  return <li key={index}>{item.label}</li>
                }) : ''} 
              </ul>
            </Grid>
            
          </Grid>
          
          
          </div>
      );
    }
  }

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAUkuaISCnVug4T0HDIDskTtpChzoOPw-Y',
  region: 'GE',
  language: 'de'
})(MapContainer);