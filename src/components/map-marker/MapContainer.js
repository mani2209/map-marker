import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import Geosuggest from 'react-geosuggest';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));

export class MapContainer extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        stores: [{placeId: 'ChIJOyH6ZBmEsUcRD',label: 'Old Elbe Tunnel, Hamburg', latitude: 53.5495629, longitude: 9.9625838}],
        checkCountry: true,
      }

      this.onSuggestSelect = this.onSuggestSelect.bind(this)
      this.remove = this.remove.bind(this)
    }

    remove(placeId){
      console.log('remove', placeId)
      const idToRemove = placeId
      const filterLocation = this.state.stores.filter((item) => item.placeId !== idToRemove)

      console.log(filterLocation)
      this.setState({
        stores: filterLocation
      })
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

      // Quota exhausted
      // let geoUrl = `http://api.geonames.org/countryCodeJSON?lat=${suggest.location.lat}&lng=${suggest.location.lng}&username=demo`

      // fetch(geoUrl)
      //   .then((res) => {
      //     console.log(res)
      //     if(res.countryName !== 'Germany'){
      //       this.setState({ checkCountry: false })
      //     }else {
      //       stores.push({
      //         placeId: suggest.placeId,
      //         label: suggest.label,
      //         latitude: suggest.location.lat,
      //         longitude: suggest.location.lng
      //       })
      
      //       this.setState({
      //         stores: stores
      //       })
      //       console.log(stores)
      //     }
      //   })

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
              onClick={() => this.setState({ checkCountry: true })}
              onSuggestSelect={this.onSuggestSelect}
              location={new google.maps.LatLng(53.558572, 9.9278215)}
              radius="20" />
              <button onClick={()=>this._geoSuggest.clear()}>Clear</button>
              {this.state.checkCountry === false ? <p>The marker is outside Germany</p>: ''}
              <h3>Added locations: </h3>
              <Paper className={''}>
                <Table className={'classes.table'}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Location</TableCell>
                      <TableCell align="right">Lattitude</TableCell>
                      <TableCell align="right">longitude</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.stores.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {item.label}
                        </TableCell>
                        <TableCell align="right">{item.latitude}</TableCell>
                        <TableCell align="right">{item.longitude}</TableCell>
                        <TableCell align="right"><button onClick={() => this.remove(item.placeId)}>Delete</button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
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