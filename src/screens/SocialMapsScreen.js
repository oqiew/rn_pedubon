import React, { Component } from 'react';
import {
    View,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    PermissionsAndroid,
    Alert,
} from 'react-native';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import styles from '../styles/main.styles';
// page
import {
    Container, Content, Footer, Radio, Icon, Item, Textarea, Label, Input, Picker, Button, Text, ListItem, Left, Right,
} from 'native-base';
import Firebase from '../Firebase';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import Geolocation from '@react-native-community/geolocation';
import { isEmptyValue, GetCurrentDate } from '../components/Methods';
import Loading from '../components/Loading';
import firestore from '@react-native-firebase/firestore';
import Storage from '@react-native-firebase/storage';
import { TableName } from '../Database/constan';
import PDHeader from '../components/header';
import themeStyle from '../styles/theme.style';
import { routeName } from '../routes/RouteConstant';

export class Main extends Component {
    constructor(props) {
        super(props);
        this.tbSocialMaps = firestore().collection(TableName.Social_maps);
        this.state = {
            page: 'Main',
            edit_ID: '',
            loading: false,
            //seleteed  1 is main 2 is define gps 3 is select Ban 4 is list user 5 is profile and logout
            Selected: 1,

            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            position: { lat: 15.229399, lng: 104.857126 },
            position2: { lat: 15.229399, lng: 104.857126 },

            //data insert map
            Geo_map_name: '',
            Geo_map_type: '',
            Geo_map_time: '',
            Geo_map_description: '',
            Geo_map_result_description: '',
            Create_By_ID: '',
            Create_date: '',
            Map_image_URL: '',
            Map_image_name: '',
            Map_image_uri: '',
            Important: false,
            new_upload_image: false,
            map_image_file_name: '',
            uploaded: false,
            marker: '',
            //select data
            //input data profile
            ...this.props.fetchReducer.user,

            //set profile
            haveProfile: false,

            //list show
            geoMaps: [],
            markers: [],
            listshowMarker: [],

            maptable: false,
            mapAddData: false,
            sall: true,
            shome: false,
            sresource: false,
            sorganization: false,
            sflag_good: false,
            sflag_danger: false,
            saccident: false,
            location: null,
            // ban
            Provinces: [],
            Districts: [],
            Sub_districts: [],
            Bans: [],

        };
    }
    componentDidMount() {
        this.tbSocialMaps.where('Area_ID', '==', this.state.Area.ID)
            .onSnapshot(this.LitsMark);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            ...nextProps.fetchReducer.user
        })
    }
    get getgeolocation() {
        return {
            region: {
                latitude: this.state.position.lat,
                longitude: this.state.position.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }

    findCoordinates = () => {
        Geolocation.getCurrentPosition(
            position => {
                console.log(position.coords.latitude
                    , ",", position.coords.longitude);
                this.setState({
                    position: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                });
            },
            error => {
                console.log(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 10000,
                distanceFilter: 50,
                forceRequestLocation: true,
            },
        );

    };




    ListMark = querySnapshot => {

        this.setState({
            loading: true,
        });
        const geoMaps = [];
        const listshowMarker = [];
        let count = 0;

        querySnapshot.forEach(doc => {
            // console.log(doc.data())
            const {
                Geo_map_position,
                Map_image_URL,
                Geo_map_name,
                Geo_map_type,
                Geo_map_time,
                Geo_map_description,
                Geo_map_result_description,
                Informer_name,
            } = doc.data();
            const {
                sall, shome, sresource, sorganization, sflag_good, sflag_danger, saccident,
            } = this.state;
            var icon_m = '';
            var name_type = '';
            // "home"=บ้าน
            // "resource"=แหล่งทรัพยากร
            // "organization"=องค์กร
            // "flag_good"=จุดดี
            // "flag_danger"=จุดเสี่ยง
            // "accident"=จุดอุบัติเหตุ
            let add = false;
            if (Geo_map_type === 'home') {
                if (shome) {
                    add = true;
                }
            } else if (Geo_map_type === 'resource') {
                if (sresource) {
                    add = true;
                }
            } else if (Geo_map_type === 'organization') {
                if (sorganization) {
                    add = true;
                }
            } else if (Geo_map_type === 'flag_good') {
                if (sflag_good) {
                    add = true;
                }
            } else if (Geo_map_type === 'flag_danger') {
                if (sflag_danger) {
                    add = true;
                }
            } else if (Geo_map_type === 'accident') {
                if (saccident) {
                    add = true;
                }
            }

            if (sall) {
                add = true;
            }

            if (add) {
                if (Geo_map_type === 'home') {
                    name_type = 'บ้าน';
                    icon_m = require('../assets/home.png');
                } else if (Geo_map_type === 'resource') {
                    name_type = 'แหล่งทรัพยากร';
                    icon_m = require('../assets/resource.png');
                } else if (Geo_map_type === 'organization') {
                    name_type = 'องค์กร';
                    icon_m = require('../assets/organization.png');
                } else if (Geo_map_type === 'flag_good') {
                    name_type = 'จุดดี';
                    icon_m = require('../assets/flag_good.png');
                } else if (Geo_map_type === 'flag_danger') {
                    name_type = 'จุดเสี่ยง';
                    icon_m = require('../assets/flag_danger.png');
                } else if (Geo_map_type === 'accident') {
                    name_type = 'จุดอุบัติเหตุ';
                    icon_m = require('../assets/accident.png');
                }
                if (!isEmptyValue(Geo_map_position)) {
                    listshowMarker.push(
                        <Marker
                            key={count}
                            // title={Geo_map_name + ''}
                            coordinate={{
                                latitude: Geo_map_position.lat,
                                longitude: Geo_map_position.lng,
                            }}
                            // description={Geo_map_description}
                            // image={icon_m}
                            icon={icon_m}
                        // label={count}
                        >
                            <Callout tooltip>
                                <View>
                                    <View style={_stylesMap.bubble}>
                                        <Text style={_stylesMap.name}>{Geo_map_name}</Text>
                                        <Text style={{ fontSize: 12, color: '#6a6a6a', flexWrap: 'wrap' }}>{Geo_map_description}</Text>
                                        <Text style={{ position: "relative", bottom: 40, width: 100, height: 100, }}>
                                            <Image style={{
                                                width: 100, height: 100,
                                            }} source={{ uri: Map_image_URL }} resizeMode="cover" >
                                            </Image>
                                        </Text>

                                    </View>
                                    <View style={_stylesMap.arrowBorder}></View>
                                    <View style={_stylesMap.arrow}></View>
                                </View>
                            </Callout>
                        </Marker >,
                    );
                    console.log(Map_image_URL)
                    geoMaps.push({
                        Key: doc.id,
                        Geo_map_name,
                        name_type,
                        Geo_map_description,
                        Informer_name,
                        Map_image_URL,
                        Geo_map_position,
                        Geo_map_type,
                        Geo_map_time,
                        Geo_map_result_description
                    });
                }
            }
            count++;
        });

        this.setState({
            geoMaps,
            listshowMarker,
            loading: false,
        });
    };
    onMapPress = e => {
        this.setState({
            position: {
                lat: e.nativeEvent.coordinate.latitude,
                lng: e.nativeEvent.coordinate.longitude,
            },
        });
    };
    cancel() {
        this.setState({
            Geo_map_name: '',
            Geo_map_type: '',
            Geo_map_description: '',
            Geo_map_time: '',
            Geo_map_result_description: '',
            Create_date: '',
            Map_image_URL: '',
            Map_image_uri: '',
            new_upload_image: false,
            mapAddData: false,
            maptable: false,
            Important: false,
            edit_ID: '',
            loading: false,
            Map_image_uri: ''
        });
    }
    uploadImage(id) {
        return new Promise((resolve, reject) => {
            const imageRef = Storage().ref('GeoMaps').child('geo' + id + '.jpg')
            let mime = 'image/jpg';
            imageRef.putFile(this.state.Map_image_uri, { contentType: mime })
                .then(() => { return imageRef.getDownloadURL() })
                .then((url) => {
                    resolve(url)
                })
                .catch((error) => { reject(error) })
        })
    }

    _handleChoosePhoto = () => {
        const options = {
            title: 'เลือกรูปโปรไฟล์',
            takePhotoButtonTitle: 'ถ่ายรูป',
            chooseFromLibraryButtonTitle: 'เลือกรูปในคลัง',
            cancelButtonTitle: 'ยกเลิก',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                ImageResizer.createResizedImage(Platform.OS === "android" ? response.path : response.uri, 300, 300, 'JPEG', 100)
                    .then(({ uri }) => {
                        this.setState({
                            Map_image_uri: uri,
                            map_image_file_name: response.fileName,
                            new_upload_image: true
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
    }
    onSelected(value) {
        this.setState({
            Selected: value,
        });
    }
    onSubmit = async () => {
        // เพิ่ม ข้อมูล แผนที่
        this.setState({
            loading: true,
        });
        const { position, Map_image_URL, Geo_map_name, Geo_map_type, Important,
            Geo_map_description, Area_ID, Geo_map_time,
            Geo_map_result_description, Map_image_name } = this.state;

        let temp_Map_image_URL = '';
        let new_id = '';
        if (!isEmptyValue(this.state.edit_ID)) {
            new_id = Map_image_name;
        } else {
            new_id = Date.now().toString();

        }
        if (this.state.new_upload_image) {
            temp_Map_image_URL = await this.uploadImage(new_id)
        } else {
            temp_Map_image_URL = Map_image_URL;
        }
        if (!isEmptyValue(temp_Map_image_URL)) {
            if (
                !isEmptyValue(position) &&
                !isEmptyValue(Geo_map_name) &&
                !isEmptyValue(Geo_map_type) &&
                !isEmptyValue(Geo_map_description)
            ) {
                if (!isEmptyValue(this.state.edit_ID)) {
                    console.log('update geo');
                    this.tbSocialMaps
                        .doc(this.state.edit_ID)
                        .update({
                            Geo_map_position: position,
                            Informer_name: this.state.Name,
                            Update_date: firestore.Timestamp.now(),
                            Map_image_URL: temp_Map_image_URL,
                            Geo_map_name,
                            Geo_map_type,
                            Map_image_name: new_id,
                            Geo_map_description,
                            Geo_map_time,
                            Important,
                            Geo_map_result_description,
                            Create_By_ID: this.state.uid,
                            Area_ID,
                        })
                        .then(result => {
                            alert('อัพเดตสำเร็จ');
                            this.setState({
                                Geo_map_name: '',
                                Geo_map_type: '',
                                Geo_map_description: '',
                                Create_date: '',
                                Geo_map_time: '',
                                Geo_map_result_description: '',
                                Map_image_URL: '',
                                Map_image_uri: '',
                                new_upload_image: false,
                                mapAddData: false,
                                maptable: false,
                                edit_ID: '',
                                loading: false,
                                Important: false,
                            });
                        })
                        .catch(error => {
                            this.setState({
                                loading: false,
                            });
                            console.log(error);
                        });
                } else {
                    console.log('create geo', new_id);
                    try {
                        this.tbSocialMaps
                            .doc(new_id)
                            .set({
                                Geo_map_position: position,
                                Informer_name: this.state.Name,
                                Create_date: firestore.Timestamp.now(),
                                Map_image_URL: temp_Map_image_URL,
                                Geo_map_name,
                                Geo_map_type,
                                Map_image_name: new_id,
                                Geo_map_description,
                                Geo_map_time,
                                Important,
                                Geo_map_result_description,
                                Create_By_ID: this.state.uid,
                                Area_ID,
                            })
                            .then(result => {
                                alert('บันทึกสำเร็จ');
                                this.setState({
                                    Geo_map_name: '',
                                    Geo_map_type: '',
                                    Geo_map_description: '',
                                    Geo_map_time: '',
                                    Geo_map_result_description: '',
                                    Create_date: '',
                                    Map_image_URL: '',
                                    Map_image_uri: '',
                                    new_upload_image: false,
                                    mapAddData: false,
                                    maptable: false,
                                    edit_ID: '',
                                    loading: false,
                                    Important: false,
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                this.setState({

                                    loading: false,
                                });

                            });
                    } catch (error) {
                        console.log(error);
                    }
                }
            } else {
                this.setState({
                    loading: false,
                });
                alert('กรุณากรอกข้อมูลให้ครบ');
            }
        } else {
            this.setState({
                loading: false,
            });
            alert('กรุณาอัพโหลดรูปภาพ');
        }
    }


    edit(data, id) {
        console.log(data);
        this.setState({
            Geo_map_name: data.Geo_map_name,
            position: data.Geo_map_position,
            Geo_map_type: data.Geo_map_type,
            Geo_map_description: data.Geo_map_description,
            Map_image_URL: data.Map_image_URL,
            Geo_map_time: data.Geo_map_time,
            Map_image_name: data.Map_image_name,
            Important: data.Important,
            Geo_map_result_description: data.Geo_map_result_description,
            maptable: false,
            mapAddData: true,
            edit_ID: id,
            uploaded: true,
        });
    }
    delete(data) {

        if (this.state.uid === data.Create_By_ID || this.state.Role === 'admin') {
            if (isEmptyValue(data.Map_image_URL) === false) {
                var desertRef = Storage().refFromURL(
                    data.Map_image_URL,
                );
                desertRef.delete().then(function () {
                    console.log('delete geomap and image sucess');


                }).catch(function (error) {
                    console.log(
                        'image No such document!' + error,
                    );
                });
            } else {
                console.log('geomap image  No such document!' + data.Key);
            }

            this.tbSocialMaps.doc(data.Key).delete().then(() => {
                console.log('Document successfully deleted!');
                this.setState({
                    Geo_map_name: '',
                    Geo_map_type: '',
                    Geo_map_description: '',
                    Create_By_ID: '',
                    Create_date: '',
                    Map_image_URL: '',
                    Map_image_uri: '',
                    new_upload_image: false,
                    Geo_map_time: '',
                    Geo_map_result_description: '',
                    status_add: false,
                    edit_ID: '',
                    Important: false
                });
            })
                .catch(error => {
                    console.error('Error removing document: ', error);
                });

        } else {
            console.log('can not delete');
            alert('คุณไม่มีสิทธิ์ลบข้อมูลนี้');
        }

    }
    onBack = () => {
        this.props.navigation.navigate(routeName.Main)
    }
    render() {
        const { Selected } = this.state;
        const { Geo_map_name, Geo_map_type,
            Geo_map_description, Geo_map_time, Important,
            Geo_map_result_description, Map_image_URL, Map_image_uri } = this.state;
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

        return (
            <Container >
                <PDHeader name={'เพิ่มข้อมูลชุมชน'} backHandler={this.onBack}></PDHeader>
                <Loading visible={this.state.loading}></Loading>
                {/* main show */}
                {Selected === 1 ? (
                    this.state.maptable ? (
                        <Content contentContainerStyle={{ padding: 15 }}>
                            <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        margin: 5,
                                        fontSize: 18,
                                    }}>
                                    ตารางข้อมูล</Text>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        borderBottomWidth: 1,
                                        marginBottom: 5,
                                    }}>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            margin: 10,
                                            width: '20%',
                                            textAlign: 'center',
                                        }}>
                                        ชื่อพื้นที่</Text>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            margin: 10,
                                            width: '20%',
                                            textAlign: 'center',
                                        }}>
                                        ลักษณะพื้นที่</Text>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            margin: 10,
                                            width: '20%',
                                            textAlign: 'center',
                                        }}>
                                        ผู้เพิ่มข้อมูล</Text>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            margin: 10,
                                            width: '20%',
                                            textAlign: 'center',
                                        }}>
                                        แก้ไข</Text>
                                </View>
                                <ScrollView>
                                    {this.state.geoMaps.map((element, i) => (
                                        <View key={i} style={{ flex: 1, flexDirection: 'row' }}>
                                            <Text
                                                style={{
                                                    margin: 10,
                                                    width: '20%',
                                                    textAlign: 'center',
                                                }}>
                                                {element.Geo_map_name}
                                            </Text>
                                            <Text
                                                style={{
                                                    margin: 10,
                                                    width: '20%',
                                                    textAlign: 'center',
                                                }}>
                                                {element.name_type}
                                            </Text>
                                            <Text
                                                style={{
                                                    margin: 10,
                                                    width: '20%',
                                                    textAlign: 'center',
                                                }}>
                                                {element.Informer_name}
                                            </Text>
                                            <View style={{ width: '20%', justifyContent: 'center', flexDirection: 'row' }}>
                                                <TouchableOpacity
                                                    onPress={this.edit.bind(this, element, element.Key,)}>
                                                    <Image
                                                        source={require('../assets/pencil.png')}
                                                        style={{ width: 25, height: 25, justifyContent: 'center', }}></Image>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={this.delete.bind(this, element)}>
                                                    <Image
                                                        source={require('../assets/trash_can.png')}
                                                        style={{ width: 25, height: 25, justifyContent: 'center', }}></Image>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </Content>
                    ) : this.state.mapAddData ? (
                        <Content contentContainerStyle={{ padding: 15 }}>
                            <View style={{ flex: 1, alignItems: 'center', marginBottom: 20 }}>
                                <Text style={styles.title}>เพิ่มข้อมูล</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: 'red' }}>*</Text>
                                    <Text>กรุณากดเลือกพิกัดก่อนการเพิ่ม</Text>
                                </View>
                                <Item fixedLabel>
                                    <Label>พิกัดที่เลือก<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                    <Label>{this.state.position.lat}</Label>
                                    <Label>{this.state.position.lng}</Label>
                                </Item>
                                <Item fixedLabel>
                                    <Label>ชื่อพื้นที่<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                    <Input
                                        style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                        value={Geo_map_name}
                                        onChangeText={str => this.setState({ Geo_map_name: str })}
                                    />
                                </Item>
                                <Item fixedLabel>
                                    <Label>ประเภท<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                    <Picker
                                        style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                        selectedValue={Geo_map_type}
                                        onValueChange={str => this.setState({ Geo_map_type: str })}>
                                        <Picker.Item key="0" label="เลือกประเภท" value="" />
                                        <Picker.Item key="1" value="home" label="บ้าน" />
                                        <Picker.Item
                                            key="2"
                                            value="resource"
                                            label="แหล่งทรัพยากร"
                                        />
                                        <Picker.Item key="3" value="organization" label="องค์กร" />
                                        <Picker.Item key="4" value="flag_good" label="จุดดี" />
                                        <Picker.Item
                                            key="5"
                                            value="flag_danger"
                                            label="จุดเสี่ยง"
                                        />
                                        <Picker.Item
                                            key="6"
                                            value="accident"
                                            label="จุดอุบัติเหตุ"
                                        />
                                    </Picker>
                                </Item>
                                {Geo_map_type === 'home' &&
                                    <Item fixedLabel>
                                        <Label>เพิ่มประวัติบุคคล :</Label>
                                        <Radio selected={!Important} onPress={() => this.setState({ Important: false })}></Radio>
                                        <Text>ไม่เพิ่ม</Text>
                                        <Radio selected={Important} onPress={() => this.setState({ Important: true })}></Radio>
                                        <Text>เพิ่ม</Text>
                                    </Item>

                                }
                                {(Geo_map_type === 'flag_danger' || Geo_map_type === 'flag_good') &&

                                    <Item fixedLabel>

                                        <Label>เวลาที่เกิดเหตุ<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <Input
                                            style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                            value={Geo_map_time}
                                            keyboardType='number-pad'
                                            onChangeText={str => this.setState({ Geo_map_time: str })}
                                            placeholder="00:00"
                                        />

                                    </Item>}
                                {(Geo_map_type === 'flag_danger' || Geo_map_type === 'flag_good') &&
                                    <Item stackedLabel>
                                        <Label>ลักษณะกิจกรรม<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <Textarea
                                            style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                            rowSpan={4}
                                            value={Geo_map_description}
                                            onChangeText={str =>
                                                this.setState({ Geo_map_description: str })
                                            }
                                            placeholder="ลักษณะกิจกรรมที่เกิดขึ้นบนพื้นที่ เกิดเหตุการณ์อะไร อย่างไร"
                                        />
                                    </Item>}
                                {(Geo_map_type === 'flag_danger' || Geo_map_type === 'flag_good') &&
                                    <Item stackedLabel>
                                        <Label>ผลที่เกิดขึ้น<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <Textarea
                                            style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                            rowSpan={4}
                                            value={Geo_map_result_description}
                                            onChangeText={str =>
                                                this.setState({ Geo_map_result_description: str })
                                            }
                                            placeholder="จากกิจกรรมบนพื้นที่ มีผลที่เกิดขึ้นยังไงบ้าง เช่น การรวมตัวของวัยรุ่นหลังวัดที่เสพสารเสพติด ทำให้เกิดเด็กติดยาและเกิดการลักขโมย"
                                        />
                                    </Item>}


                                {(Geo_map_type !== 'flag_danger' && Geo_map_type !== 'flag_good') &&
                                    <Item stackedLabel>
                                        <Label>คำอธิบาย<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>

                                        <Textarea
                                            style={{ backgroundColor: "#ffffff", borderRadius: 5 }}
                                            rowSpan={4}
                                            value={Geo_map_description}
                                            onChangeText={str =>
                                                this.setState({ Geo_map_description: str })
                                            }
                                            placeholder="คำอธิบาย ของ บุคคล สถานที่ หรือกิจกรรมที่เกิดขึ้นบนพื้นที่"
                                        />
                                    </Item>}

                                {isEmptyValue(Map_image_uri) === false ?
                                    <Image
                                        source={{ uri: Map_image_uri }}
                                        style={{ height: 100, width: 100 }}></Image>
                                    : isEmptyValue(Map_image_URL) === false ?
                                        <Image
                                            source={{ uri: Map_image_URL }}
                                            style={{ height: 100, width: 100 }}></Image> : <></>
                                }
                                <View style={{ flexDirection: 'row' }}>
                                    <Button
                                        info
                                        style={{ margin: 10 }}
                                        onPress={this._handleChoosePhoto}>
                                        <Icon name="plus" type="AntDesign" />
                                        <Text>เพิ่มรูปพื้นที่</Text>
                                    </Button>
                                    <Button
                                        danger
                                        style={{ marginTop: 10 }}
                                        onPress={this.cancel.bind(this)}>
                                        <Icon name="left" type="AntDesign" />
                                        <Text>กลับ</Text>
                                    </Button>

                                </View>
                                <View style={{ flexDirection: 'row' }}>

                                    <Button
                                        success
                                        style={{ margin: 10 }}
                                        onPress={this.onSubmit.bind(this)}>
                                        <Icon name="save" type="AntDesign" />
                                        <Text>บันทึก</Text>
                                    </Button>
                                </View>
                                <View style={{ height: 20 }}></View>
                            </View>
                        </Content>
                    ) : (
                                // แสดงแผนที่ หน้าหลัก
                                <MapView
                                    onPress={this.onMapPress.bind(this)}
                                    style={mstyle.map}
                                    zoomEnabled={true}
                                    toolbarEnabled={true}
                                    showsUserLocation={true}
                                    showsScale={true}
                                    zoomTapEnabled={true}
                                    zoomControlEnabled={true}
                                    {...this.getgeolocation}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: this.state.position.lat,
                                            longitude: this.state.position.lng,
                                        }}>


                                    </Marker>


                                    {this.state.listshowMarker}
                                    {!isEmptyValue(this.state.marker) &&
                                        <View style={_stylesMap.card}>
                                            <Text></Text>
                                        </View>
                                    }
                                </MapView>

                            )
                ) : (
                        <View></View>
                    )}




                {/* footer tab */}
                <Footer style={{ backgroundColor: '#ffffff' }}>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
                        onPress={this.findCoordinates}>
                        <Icon name="enviroment" type="AntDesign"></Icon>
                        <Text>
                            เลือกพิกัดที่อยู่ตอนนี้
                          </Text>

                    </TouchableOpacity>
                </Footer>
                <Footer style={{ backgroundColor: '#ffffff', justifyContent: "space-around" }}>
                    <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        onPress={this.cancel.bind(this)}>
                        <Image
                            source={require('../assets/maps.png')}
                            style={{ width: 50, height: 50 }}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ justifyContent: 'center' }}
                        onPress={() =>
                            this.setState({ maptable: true, mapAddData: false })
                        }>
                        <Image
                            source={require('../assets/table.png')}
                            style={{ width: 60, height: 60 }}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.onSelected.bind(this, 1)}
                        onPress={() =>
                            this.setState({ maptable: false, mapAddData: true })
                        }>
                        <Image
                            source={require('../assets/add.png')}
                            style={{ width: 50, height: 50 }}></Image>
                    </TouchableOpacity>
                </Footer>


            </Container >
        );

    }
}

//Used to add reducer's into the props
const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer,
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user,
};
const _stylesMap = StyleSheet.create({
    bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        alignSelf: 'center',
        width: 110,
        padding: 5
    },
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5
    },
    name: {
        fontSize: 16,
        marginBottom: 5
    },
    image: {
        width: 100,
        height: 100,
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(Main);
