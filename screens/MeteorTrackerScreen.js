import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity, Alert} from 'react-native';
import MyHeader from "../components/MyHeader";
import axios from 'axios';

export default class MeteorTrackerScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            meteors: {}
        }
    }

    getMeteors = () => {
        axios.get("https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=5goXxUF0dQMynQ93aJOWB6MfBrgZB9LFzZbza2bA")
        .then((response) => {
            this.setState({
                meteors: response.data.near_earth_objects
            })
        })
        .catch((error) => {
            Alert.alert(error.message);
        }) 
    }

    componentDidMount() {
        this.getMeteors();
    }

    render() {
        if(Object.keys(this.state.meteors).length === 0) {
          return(
            <View>
                <MyHeader title = "Meteor Tracker"/>
                <View style = {{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>Loading...</Text>
                </View>
            </View>
          )  
        }
        
        else{
            var meteorArray = Object.keys(this.state.meteors).map((meteor_date) => {
                return this.state.meteors[meteor_date]
            });
            var meteors = [].concat().apply([], meteorArray)
            meteors.forEach(function(element) {
                var diameter = (element.estimated_diameter.kilometers.estimated_diameter_min + element.estimated_diameter.kilometers.estimated_diameter_max)/2;
                var threatScore = (diameter/element.close_approach_data[0].miss_distance.kilometers)*1000000000;
                element.threat_Score = threatScore;
            });
            meteors.sort(function(a,b) {
                return b.threatScore - a.threatScore;
            });
            meteors = meteors.slice(0,5);
            return(
                <View>
                    <MyHeader title = "Meteor Tracker"/>
                    <View>
                        <Text>It is working</Text>
                    </View>
                </View>
            )
        }
    }
}