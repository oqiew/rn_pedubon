import React, { Component } from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import Loading from '../components/Loading';
import { Container, Content, Footer, FooterTab, Grid, Col, Icon } from 'native-base'
import styles from '../styles/main.styles';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import Firebase from '../Firebase';
import { isEmptyValue } from '../components/Methods';
import firestore from '@react-native-firebase/firestore';
export class MapsScreen extends Component {
    constructor(props) {
        super(props)
        this.tbSocialMaps = firestore().collection('SOCIAL_MAPS');
        this.state = {
            loading: false,
            //maps
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            position: { lat: 15.229399, lng: 104.857126 },
            listshowMarker: [],
        }
    }
    componentDidMount() {
        this.tbSocialMaps.onSnapshot(this.ListMark)
    }
    ListMark = querySnapshot => {

        this.setState({
            loading: true,
        });
        const listshowMarker = [];
        let count = 0;

        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Geo_map_position,
                Map_iamge_URL,
                Geo_map_name,
                Geo_map_type,
                Geo_map_description,
                Informer_name,
            } = doc.data();
            var icon_m = '';
            var name_type = '';
            // "home"=บ้าน
            // "resource"=แหล่งทรัพยากร
            // "organization"=องค์กร
            // "flag_good"=จุดดี
            // "flag_danger"=จุดเสี่ยง
            // "accident"=จุดอุบัติเหตุ

            if (Geo_map_type === 'home') {
                name_type = 'บ้าน';
            } else if (Geo_map_type === 'resource') {
                name_type = 'แหล่งทรัพยากร';
            } else if (Geo_map_type === 'organization') {
                name_type = 'องค์กร';
            } else if (Geo_map_type === 'flag_good') {
                name_type = 'จุดดี';
            } else if (Geo_map_type === 'flag_danger') {
                name_type = 'จุดเสี่ยง';
            } else if (Geo_map_type === 'accident') {
                name_type = 'จุดอุบัติเหตุ';
            }
            if (!isEmptyValue(Geo_map_position)) {
                listshowMarker.push(
                    <Marker
                        key={count}
                        title={Geo_map_name + ''}
                        coordinate={{
                            latitude: Geo_map_position.lat,
                            longitude: Geo_map_position.lng,
                        }}
                        description={Geo_map_description}
                    // image={Map_iamge_URL}
                    // icon={icon_m}

                    // label={count}
                    >
                        <View>
                            {Geo_map_type === 'home' ? (
                                <Image
                                    source={require('../assets/home.png')}
                                    style={{ height: 35, width: 35 }}></Image>
                            ) : Geo_map_type === 'resource' ? (
                                <Image
                                    source={require('../assets/resource.png')}
                                    style={{ height: 35, width: 35 }}></Image>
                            ) : Geo_map_type === 'organization' ? (
                                <Image
                                    source={require('../assets/organization.png')}
                                    style={{ height: 35, width: 35 }}></Image>
                            ) : Geo_map_type === 'flag_good' ? (
                                <Image
                                    source={require('../assets/flag_good.png')}
                                    style={{ height: 35, width: 35 }}></Image>
                            ) : Geo_map_type === 'flag_danger' ? (
                                <Image
                                    source={require('../assets/flag_danger.png')}
                                    style={{ height: 35, width: 35 }}></Image>
                            ) : Geo_map_type === 'accident' ? (
                                <Image
                                    source={require('../assets/accident.png')}
                                    style={{ height: 35, width: 35 }}></Image>
                            ) : (
                                                        <View></View>
                                                    )}
                        </View>
                    </Marker>,
                );

            }

            count++;
        });

        this.setState({
            listshowMarker,
            loading: false,
        });
    };
    render() {
        const mstyle = StyleSheet.create({
            map: {
                ...StyleSheet.absoluteFillObject,
                width: '100%',
                justifyContent: 'flex-end',
                alignItems: 'center',
                zIndex: -1,
                position: 'relative',
                flex: 1,
            },
        });
        if (this.state.loading) {
            return <Loading></Loading>
        } else {


            return (
                <Container>

                    <MapView
                        // onPress={this.onMapPress.bind(this)}
                        style={mstyle.map}
                        // provider={PROVIDER_GOOGLE}
                        zoomEnabled={true}
                        toolbarEnabled={true}
                        showsUserLocation={true}
                        showsScale={true}
                        zoomTapEnabled={true}
                        zoomControlEnabled={true}
                        initialRegion={{
                            latitude: this.state.position.lat,
                            longitude: this.state.position.lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        {this.state.listshowMarker}
                    </MapView>


                    <Footer>
                        <FooterTab style={styles.footer}>

                        </FooterTab>
                    </Footer>
                </Container>
            )
        }
    }
}

const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer,
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapsScreen);