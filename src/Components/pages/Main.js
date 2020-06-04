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
import { fetch_user } from '../../actions';
import { connect } from 'react-redux';
import { isEmptyValue, GetCurrentDate } from '../Methods';
import styles from '../../styles/main.styles';
// page
import List_users from './List_users';
import Select_ban from './Select_ban';
import {
  Container, Content, FooterTab, Footer,
  Icon, Header, Item, Textarea, Label, Input, Picker, Button, Text,
} from 'native-base';
import Firebase from '../../../Firebase';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import Geolocation from '@react-native-community/geolocation';
import data_provinces from '../../data/provinces';
import Loading from '../Loading';

export class Main extends Component {
  constructor(props) {
    super(props);
    console.log('current page main')
    this.tbUser = Firebase.firestore().collection('USERS');
    this.tbSocialMap = Firebase.firestore().collection('SOCIAL_MAPS');
    this.state = {
      page: 'Main',
      edit_ID: '',
      loading: false,
      //seleteed  1 is main 2 is define gps 3 is select Ban 4 is list user 5 is profile and logout
      Selected: 1,

      ban: '',
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      position: { lat: 15.229399, lng: 104.857126 },
      position2: { lat: 15.229399, lng: 104.857126 },
      zoomMap: 12,

      //data insert map
      Geo_map_name: '',
      Geo_map_type: '',
      Geo_map_description: '',
      Informer_ID: '',
      Create_date: '',
      Map_iamge_URL: '',
      uploaded: false,
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
    this.setDate = this.setDate.bind(this);
  }
  componentDidMount() {
    const { Area_ID, Area_PID, Area_DID, Area_SDID, Name } = this.props.fetchReducer.user;
    console.log(Area_ID)
    this.tbSocialMap.where('Area_PID', '==', Area_PID).where('Area_DID', '==', Area_DID).where('Area_SDID', '==', Area_SDID)
      .where('Area_ID', '==', Area_ID)
      .onSnapshot(this.ListMark);
  }

  //   }
  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };
  findCoordinates = () => {
    console.log('get location');
    if (this.hasLocationPermission) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position.coords.latitude);
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
    }
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
        Map_iamge_URL,
        Geo_map_name,
        Geo_map_type,
        Geo_map_description,
        Informer_name,
      } = doc.data();
      const {
        sall,
        shome,
        sresource,
        sorganization,
        sflag_good,
        sflag_danger,
        saccident,
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
                    source={require('../../assets/home.png')}
                    style={{ height: 35, width: 35 }}></Image>
                ) : Geo_map_type === 'resource' ? (
                  <Image
                    source={require('../../assets/resource.png')}
                    style={{ height: 35, width: 35 }}></Image>
                ) : Geo_map_type === 'organization' ? (
                  <Image
                    source={require('../../assets/organization.png')}
                    style={{ height: 35, width: 35 }}></Image>
                ) : Geo_map_type === 'flag_good' ? (
                  <Image
                    source={require('../../assets/flag_good.png')}
                    style={{ height: 35, width: 35 }}></Image>
                ) : Geo_map_type === 'flag_danger' ? (
                  <Image
                    source={require('../../assets/flag_danger.png')}
                    style={{ height: 35, width: 35 }}></Image>
                ) : Geo_map_type === 'accident' ? (
                  <Image
                    source={require('../../assets/accident.png')}
                    style={{ height: 35, width: 35 }}></Image>
                ) : (
                              <View></View>
                            )}
              </View>
            </Marker>,
          );
          geoMaps.push({
            Key: doc.id,
            Geo_map_name,
            name_type,
            Geo_map_description,
            Informer_name,
            Map_iamge_URL,
            Geo_map_position,
            Geo_map_type,
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
    if (
      !isEmptyValue(this.state.Map_iamge_URL) &&
      isEmptyValue(this.state.edit_ID)
    ) {
      var desertRef = Firebase.storage().refFromURL(this.state.Map_iamge_URL);
      desertRef
        .delete()
        .then(function () {
          console.log('delete geo image sucess');
        })
        .catch(function (error) {
          console.log('image No such document! ');
        });
    }
    this.setState({
      Geo_map_name: '',
      Geo_map_type: '',
      Geo_map_description: '',
      Create_date: '',
      Map_iamge_URL: '',
      mapAddData: false,
      maptable: false,
      edit_ID: '',
      loading: false,
    });
  }

  handleChoosePhoto = () => {
    const options = {
      title: 'เลือกรูปพื้นที่',
      takePhotoButtonTitle: 'ถ่ายรูป',
      chooseFromLibraryButtonTitle: 'เลือกรูปในคลัง',
      cancelButtonTitle: 'ยกเลิก',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          imgSource: source,
          imageUri: response.uri,
        });
        this.uploadImage(response.fileName);
      }
    });
  };
  uploadImage = filename => {
    var image = this.state.imageUri;
    const Blob = RNFetchBlob.polyfill.Blob;
    window.Blob = Blob;
    const tempWindowXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;

    let uploadBlob = null;
    const imageRef = Firebase.storage()
      .ref('GeoMaps')
      .child('geo' + filename + (1 + Math.floor(Math.random() * 99)));
    let mime = 'image/jpg';
    RNFetchBlob.fs
      .readFile(image, 'base64')
      .then(data => {
        return Blob.build(data, { type: `${mime};BASE64` });
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(blob, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then(url => {
        // URL of the image uploaded on Firebase storage
        console.log(url);
        window.XMLHttpRequest = tempWindowXMLHttpRequest;
        this.setState({ Map_iamge_URL: url });
      })
      .catch(error => {
        console.log(error);
      });
  };
  onSelected(value) {
    this.setState({
      Selected: value,
    });
  }
  onSubmit() {
    this.setState({
      loading: true,
    });
    const { position, Map_iamge_URL, Geo_map_name, Geo_map_type, Geo_map_description, Area_ID, Area_PID, Area_DID, Area_SDID, } = this.state;

    if (!isEmptyValue(Map_iamge_URL)) {
      if (
        !isEmptyValue(position) &&
        !isEmptyValue(Geo_map_name) &&
        !isEmptyValue(Geo_map_type) &&
        !isEmptyValue(Geo_map_description)
      ) {
        if (!isEmptyValue(this.state.edit_ID)) {
          console.log('update geo');
          this.tbSocialMap
            .doc(this.state.edit_ID)
            .update({
              Geo_map_position: position,
              Informer_name: this.state.Name,
              Create_date: GetCurrentDate('/'),
              Map_iamge_URL,
              Geo_map_name,
              Geo_map_type,
              Geo_map_description,
              Informer_ID: this.state.User_ID,
              Area_ID, Area_PID, Area_DID, Area_SDID,
            })
            .then(result => {
              alert('อัพเดตสำเร็จ');
              this.setState({
                Geo_map_name: '',
                Geo_map_type: '',
                Geo_map_description: '',
                Create_date: '',
                Map_iamge_URL: '',
                mapAddData: false,
                maptable: false,
                edit_ID: '',
                loading: false,
              });
            })
            .catch(error => {
              this.setState({
                loading: false,
              });
              console.log(error);
            });
        } else {
          console.log('create geo');
          this.tbSocialMap
            .add({
              Geo_map_position: position,
              Informer_name: this.state.Name,
              Create_date: GetCurrentDate('/'),
              Map_iamge_URL,
              Geo_map_name,
              Geo_map_type,
              Geo_map_description,
              Informer_ID: this.state.User_ID,
              Area_ID, Area_PID, Area_DID, Area_SDID,
            })
            .then(result => {
              alert('บันทึกสำเร็จ');
              this.setState({
                Geo_map_name: '',
                Geo_map_type: '',
                Geo_map_description: '',
                Create_date: '',
                Map_iamge_URL: '',
                mapAddData: false,
                maptable: false,
                edit_ID: '',
                loading: false,
              });
            })
            .catch(error => {
              this.setState({
                loading: false,
              });
              console.log(error);
            });
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
      Map_iamge_URL: data.Map_iamge_URL,
      maptable: false,
      mapAddData: true,
      edit_ID: id,
      uploaded: true,
    });
  }
  delete(id) {
    const searchRef = Firebase.firestore()
      .collection('SOCIAL_MAPS')
      .doc(id);
    searchRef.get().then(doc => {
      // console.log(this.state.Role)
      if (this.state.User_ID === doc.data().Informer_ID || this.state.Role === 'admin') {
        if (doc.exists && doc.data().Map_iamge_URL !== '') {
          var desertRef = Firebase.storage().refFromURL(
            doc.data().Map_iamge_URL,
          );
          desertRef.delete().then(function () {
            console.log('delete geomap and image sucess');
          })
            .catch(function (error) {
              console.log(
                'image No such document! ' + doc.data().areaImageName,
              );
            });
        } else {
          console.log('geomap image  No such document! ' + id);
        }
        Firebase.firestore().collection('SOCIAL_MAPS').doc(id).delete().then(() => {
          console.log('Document successfully deleted!');
          this.setState({
            Geo_map_name: '',
            Geo_map_type: '',
            Geo_map_description: '',
            Informer_ID: '',
            Create_date: '',
            Map_iamge_URL: '',
            status_add: false,
            edit_ID: '',
          });
        })
          .catch(error => {
            console.error('Error removing document: ', error);
          });
      } else {
        console.log('can not delete');
      }
    });
  }

  //profile
  goToProfile = e => {
    e.preventDefault();
    this.props.navigation.navigate('Profile');
  };
  goToList_user = e => {
    e.preventDefault();
    this.props.navigation.navigate('List_user');
  };
  goToOrgs = e => {
    e.preventDefault();
    this.props.navigation.navigate('Orgs');
  };
  goToHealth_systems = e => {
    e.preventDefault();
    this.props.navigation.navigate('Health_systems');
  };
  goToLocal_calendars = e => {
    e.preventDefault();
    this.props.navigation.navigate('Local_calendars');
  };
  goToLocal_historys = e => {
    e.preventDefault();
    this.props.navigation.navigate('Local_historys');
  };
  goToPersons = e => {
    e.preventDefault();
    this.props.navigation.navigate('Persons');
  };

  // end profile
  setDate(newDate) {
    this.setState({ Birthday: newDate });
  }
  backPage = () => {
    this.setState({
      page: 'Main',
      ...this.props.fetchReducer.user,
    });
    console.log(this.state.page)
    const { Area_ID, Area_PID, Area_DID, Area_SDID, Name } = this.state;
    this.tbSocialMap.where('Area_PID', '==', Area_PID).where('Area_DID', '==', Area_DID).where('Area_SDID', '==', Area_SDID)
      .where('Area_ID', '==', Area_ID)
      .onSnapshot(this.ListMark);
  }
  backPage2 = (Area_ID, Area_PID, Area_DID, Area_SDID, Ban_name) => {
    this.setState({
      page: 'Main',
      Area_ID, Area_PID, Area_DID, Area_SDID, Ban_name
    });
    this.tbSocialMap.where('Area_PID', '==', Area_PID).where('Area_DID', '==', Area_DID).where('Area_SDID', '==', Area_SDID)
      .where('Area_ID', '==', Area_ID)
      .onSnapshot(this.ListMark);
  }
  render() {
    const { Selected } = this.state;
    const { Geo_map_name, Geo_map_type, Geo_map_description } = this.state;
    const { Provinces, Districts, Sub_districts, Bans } = this.state;
    const { Area_ID, User_ID, Area_PID, Area_DID, Area_SDID, } = this.state;
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
      return <Loading></Loading>;
    } else if (this.state.page === 'List_users') {
      return <List_users back={this.backPage}></List_users>
    } else if (this.state.page === 'Select_ban') {
      return <Select_ban back={this.backPage2}></Select_ban>
    } else if (this.state.page === 'Main') {
      return (
        <Container>
          {/* main show */}

          {Selected === 1 ? (
            this.state.maptable ? (
              <Content>
                <View style={{ flex: 1, alignItems: 'center', margin: 10 }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      textAlign: 'center',
                      margin: 5,
                      fontSize: 18,
                    }}>
                    ตารางข้อมูล
                  </Text>
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
                      ชื่อพื้นที่
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        margin: 10,
                        width: '20%',
                        textAlign: 'center',
                      }}>
                      ลักษณะพื้นที่
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        margin: 10,
                        width: '20%',
                        textAlign: 'center',
                      }}>
                      ผู้เพิ่มข้อมูล
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        margin: 10,
                        width: '20%',
                        textAlign: 'center',
                      }}>
                      แก้ไข
                    </Text>
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
                        <View
                          style={{
                            flexDirection: 'row',
                            width: '20%',
                            margin: 10,
                          }}>
                          <TouchableOpacity
                            onPress={this.edit.bind(
                              this,
                              element,
                              element.Key,
                            )}>
                            <Image
                              source={require('../../assets/pencil.png')}
                              style={{
                                width: 25,
                                height: 25,
                                justifyContent: 'center',
                              }}></Image>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={this.delete.bind(this, element.Key)}>
                            <Image
                              source={require('../../assets/trash_can.png')}
                              style={{
                                width: 25,
                                height: 25,
                                justifyContent: 'center',
                              }}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </Content>
            ) : this.state.mapAddData ? (
              <Content style={{ padding: 20 }}>
                <View style={{ flex: 1, alignItems: 'center', marginBottom: 20 }}>
                  <Text style={styles.title}>เพิ่มข้อมูล</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'red' }}>*</Text>
                    <Text>กรุณากดเลือกพิกัดก่อนการเพิ่ม</Text>
                  </View>
                  <TouchableOpacity onPress={this.findCoordinates}>
                    <Text style={{ color: 'blue' }}>เลือกพิกัด</Text>
                  </TouchableOpacity>
                  <Item fixedLabel>
                    <Label>พิกัดที่เลือก :</Label>
                    <Label>{this.state.position.lat}</Label>
                    <Label>{this.state.position.lng}</Label>
                  </Item>
                  <Item fixedLabel>
                    <Label>ชื่อพื้นที่ :</Label>
                    <Input
                      value={Geo_map_name}
                      onChangeText={str => this.setState({ Geo_map_name: str })}
                    />
                  </Item>
                  <Picker
                    selectedValue={Geo_map_type}
                    style={{ width: 300 }}
                    onValueChange={str => this.setState({ Geo_map_type: str })}>
                    <Picker.Item key="0" label="ประเภท" value="" />
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
                  <Item fixedLabel>
                    <Label>คำอธิบาย :</Label>
                    <Textarea
                      rowSpan={4}
                      value={Geo_map_description}
                      onChangeText={str =>
                        this.setState({ Geo_map_description: str })
                      }
                      placeholder="คำอธิบาย ของ บุคคล สถานที่ หรือกิจกรรมที่เกิดขึ้นบนพื้นที่"
                    />
                  </Item>
                  {this.state.Map_iamge_URL === '' ? (
                    <View></View>
                  ) : (
                      <Image
                        source={{ uri: this.state.Map_iamge_URL }}
                        style={{ height: 100, width: 100 }}></Image>
                    )}
                  <View style={{ flexDirection: 'row' }}>
                    <Button
                      info
                      style={{ margin: 10 }}
                      onPress={this.handleChoosePhoto.bind(this)}>
                      <Icon name="plus" type="AntDesign" />
                      <Text>เพิ่มรูปพื้นที่</Text>
                    </Button>
                    <Button
                      success
                      style={{ margin: 10 }}
                      onPress={this.onSubmit.bind(this)}>
                      <Icon name="save" type="AntDesign" />
                      <Text>บันทึก</Text>
                    </Button>
                  </View>
                  <Button
                    danger
                    style={{ marginTop: 10 }}
                    onPress={this.cancel.bind(this)}>
                    <Icon name="left" type="AntDesign" />
                    <Text>กลับ</Text>
                  </Button>
                  <View style={{ height: 20 }}></View>
                </View>
              </Content>
            ) : (
                  <MapView
                    onPress={this.onMapPress.bind(this)}
                    style={mstyle.map}
                    provider={PROVIDER_GOOGLE}
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
                    }}>
                    <Marker
                      coordinate={{
                        latitude: this.state.position.lat,
                        longitude: this.state.position.lng,
                      }}></Marker>
                    {this.state.listshowMarker}
                  </MapView>

                )
          ) : (
              <View></View>
            )}

          {/* เครื่องมือ 7 ชิ้น */}
          {Selected === 2 ? (
            isEmptyValue(this.state.Area_ID) ? (
              <Content>
                <TouchableOpacity
                  style={{ alignItems: 'center', padding: 10 }}
                  // onPress={this.select_ban.bind(this)}>
                  onPress={() => this.setState({ page: 'Select_ban' })}>
                  <Image
                    source={require('../../assets/gps.png')}
                    style={{ width: 75, height: 75 }}></Image>
                  <Text style={{ fontSize: 16, textAlign: 'center' }}>
                    เลือกหมู่บ้าน
                  </Text>
                </TouchableOpacity>
              </Content>
            ) : (
                <Content>
                  <Text
                    style={{ textAlign: 'center', fontSize: 20, color: '#0080ff', marginTop: 20 }}>
                    {this.state.Ban_name} หมู่ที่ {this.state.Area_ID + 1}
                  </Text>
                  <View
                    style={{
                      marginTop: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <TouchableOpacity
                      style={{ alignItems: 'center', padding: 10 }}
                      onPress={this.goToLocal_calendars.bind(this)}>
                      <Image
                        source={require('../../assets/calendar.png')}
                        style={{ width: 75, height: 75 }}></Image>
                      <Text style={{ fontSize: 16, textAlign: 'center' }}>
                        ปฎิทินชุมชน
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ alignItems: 'center', padding: 10 }}
                      onPress={this.goToLocal_historys.bind(this)}>
                      <Image
                        source={require('../../assets/search.png')}
                        style={{ width: 75, height: 75 }}></Image>
                      <Text style={{ fontSize: 16, textAlign: 'center' }}>
                        ประวัติศาสตตร์{'\n'}ชุมชน
                    </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      marginTop: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <TouchableOpacity
                      style={{ alignItems: 'center', padding: 10 }}
                      onPress={this.goToPersons.bind(this)}>
                      <Image
                        source={require('../../assets/historyuser.png')}
                        style={{ width: 75, height: 75 }}></Image>
                      <Text style={{ fontSize: 16, textAlign: 'center' }}>
                        ประวัติบุคคล{'\n'}ที่น่าสนใจ
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ alignItems: 'center', padding: 10 }}
                      // onPress={this.select_ban.bind(this)}>
                      onPress={() => this.setState({ page: 'Select_ban' })}>
                      <Image
                        source={require('../../assets/gps.png')}
                        style={{ width: 75, height: 75 }}></Image>
                      <Text style={{ fontSize: 16, textAlign: 'center' }}>
                        เลือกหมู่บ้าน
                    </Text>
                    </TouchableOpacity>
                  </View>
                </Content>
              )
          ) : (
              <View></View>
            )}
          {/* เลือกหมู่บ้าน */}
          {Selected === 3 ? (
            <Content>
              <Content>
                <View style={styles.container}>
                  <Text style={{ textAlign: 'center', margin: 20, fontSize: 30, color: '#0080ff' }}>เลือกหมู่บ้าน</Text>
                  <Picker
                    selectedValue={parseInt(Area_PID, 10)}
                    style={{ height: 50, width: 200 }}
                    onValueChange={this.onSelectProvince.bind(this)}>
                    <Picker.Item key="0" label="จังหวัด" value="" />
                    {Provinces.map((data, i) =>
                      <Picker.Item key={i + 1} label={data.value} value={data.Key} />
                    )}

                  </Picker>
                  <Picker
                    selectedValue={parseInt(Area_DID, 10)}
                    style={{ height: 50, width: 200 }}
                    onValueChange={this.onSelectDistrict.bind(this)}>
                    <Picker.Item key="0" label="อำเภอ" value="" />
                    {Districts.map((data, i) =>
                      <Picker.Item key={i + 1} label={data.value} value={data.Key} />
                    )}
                  </Picker>
                  <Picker
                    selectedValue={parseInt(Area_SDID, 10)}
                    style={{ height: 50, width: 200 }}
                    onValueChange={this.onSelectSub_district.bind(this)}>
                    <Picker.Item key="0" label="ตำบล" value="" />
                    {Sub_districts.map((data, i) =>
                      <Picker.Item key={i + 1} label={data.value} value={data.Key} />
                    )}
                  </Picker>

                  <Picker
                    selectedValue={parseInt(Area_ID, 10)}
                    style={{ height: 50, width: 200 }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ Area_ID: itemValue })
                    }>
                    <Picker.Item key="0" label="บ้าน" value="" />
                    {Bans.map((data, i) =>
                      <Picker.Item key={i + 1} label={data.value + " หมู่ที่" + (i + 1)} value={data.Key} />
                    )}
                  </Picker>
                  <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                    <Button success style={{ margin: 10 }} onPress={this.onSubmitBan.bind(this)}>
                      <Icon name='save' type="AntDesign" />
                      <Text>บันทึกข้อมูล</Text></Button>
                    <Button danger style={{ margin: 10, }} onPress={() => this.setState({ Selected: 2 })}>
                      <Icon name='left' type="AntDesign" />
                      <Text>กลับ</Text>
                    </Button>
                  </View>
                </View>
              </Content>
            </Content>
          ) : (
              <View></View>
            )
          }

          {/* footer tab */}
          {
            Selected === 1 ? (
              <Footer style={{ backgroundColor: '#ffffff' }}>
                {/* <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.findCoordinates.bind(this)} >
                                <Text style={{ textAlign: 'center', marginLeft: 5, marginRight: 5 }}>พิกัดที่เราอยู่</Text>
                            </TouchableOpacity> */}
                <View style={{ justifyContent: 'center', marginRight: 10 }}>
                  {!isEmptyValue(this.state.Ban_name) && <Text>
                    {this.state.Ban_name} หมู่ที่ {this.state.Area_ID + 1}
                  </Text>}
                </View>
                <TouchableOpacity
                  style={{ justifyContent: 'center' }}
                  onPress={this.cancel.bind(this)}>
                  <Image
                    source={require('../../assets/maps.png')}
                    style={{ width: 50, height: 50 }}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ justifyContent: 'center' }}
                  onPress={() =>
                    this.setState({ maptable: true, mapAddData: false })
                  }>
                  <Image
                    source={require('../../assets/table.png')}
                    style={{ width: 60, height: 60 }}></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.onSelected.bind(this, 1)}
                  onPress={() =>
                    this.setState({ maptable: false, mapAddData: true })
                  }>
                  <Image
                    source={require('../../assets/add.png')}
                    style={{ width: 50, height: 50 }}></Image>
                </TouchableOpacity>
              </Footer>
            ) : (
                <View></View>
              )
          }
          {/* <Foot navigation={this.props.navigation}></Foot> */}
          <Footer>
            <FooterTab style={styles.footer}>
              <TouchableOpacity
                style={{ alignItems: 'center', marginLeft: 10 }}
                onPress={this.onSelected.bind(this, 1)}>
                <Image
                  source={require('../../assets/desktop.png')}
                  style={{ width: 50, height: 50 }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={this.onSelected.bind(this, 2)}>
                <Image
                  source={require('../../assets/dropdown.png')}
                  style={{ width: 50, height: 50 }}></Image>
              </TouchableOpacity>
              {/* <TouchableOpacity style={{ alignItems: 'center' }} onPress={this.onSelected.bind(this, 3)}>
                                <Image source={require('../../assets/heartbeat.png')} style={{ width: 50, height: 50, }}></Image>
                            </TouchableOpacity> */}
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() => this.setState({ page: 'List_users' })}>
                <Image
                  source={require('../../assets/database.png')}
                  style={{ width: 50, height: 50 }}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: 'center', marginRight: 10 }}
                onPress={() => this.props.navigation.navigate('Profile')}>
                <Image
                  source={require('../../assets/user.png')}
                  style={{ width: 50, height: 50 }}></Image>
              </TouchableOpacity>
            </FooterTab>
          </Footer>
        </Container >
      );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);
