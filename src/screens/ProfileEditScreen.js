import React, { Component } from 'react';
import Firebase from '../Firebase';
import styles from '../styles/main.styles';
import ImagePicker from 'react-native-image-picker';
import { Icon, Input, Label, Item, Picker, DatePicker, Text, Button, Container, Content, } from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob';
import {
    ScrollView,
    View,
    Image,
    Alert

} from 'react-native';
import data_provinces from '../data/provinces';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import { GetCurrentDate, isEmptyValue } from '../components/Methods';
import Loading from '../components/Loading';
import firestore from '@react-native-firebase/firestore';
class ProfileEditScreen extends Component {
    constructor(props) {
        super(props);
        this.tbUsers = firestore().collection('USERS');
        console.log(this.props.fetchReducer.user)
        if (isEmptyValue(this.props.fetchReducer.user.Name)) {
            this.state = {
                ...this.props.fetchReducer.user,
                Name: '', Last_name: '', Nickname: '', Sex: '', Phone_number: '',
                Line_ID: '', Facebook: '', Birthday: '', Position: '', Department: '',
                Province_ID: '', District_ID: '', Sub_district_ID: '', Avatar_URL: '',
                Area_ID: '', Role: '', Area_PID: '', Area_DID: '', Area_SDID: '',
                Province: '', District: '', Sub_district: '', User_type: '', bd: '', Ban_name: '',
                //List Data
                Provinces: [],
                Districts: [],
                Sub_districts: [],

                //temp date
                day: '',
                month: '',
                year: '',

                new_user: false,

                loading: false,
                showBirthday: false,
            }

        } else {
            this.state = {
                ...this.props.fetchReducer.user,
                //List Data
                Provinces: [],
                Districts: [],
                Sub_districts: [],

                //temp date
                day: '',
                month: '',
                year: '',

                new_user: false,

                loading: false,
                showBirthday: false,
            }
        }

    }
    authListener() {
        if (!isEmptyValue(this.state.User_ID)) {
            if (!isEmptyValue(this.state.Name)) {
                const { Province_ID, District_ID, Sub_district_ID, Birthday } = this.state;
                var d1 = new Date(Birthday.seconds * 1000);
                var day = d1.getDate();
                var month = (parseInt(d1.getMonth(), 10) + 1);
                var year = d1.getFullYear();
                this.setState({
                    day, month, year,
                    Province_ID: parseInt(Province_ID, 10),
                    District_ID: parseInt(District_ID, 10),
                    Sub_district_ID: parseInt(Sub_district_ID, 10),
                })
                this.listProvinces();
                this.listDistrict(Province_ID);
                this.listSub_district(Province_ID, District_ID);
            } else {
                this.listProvinces();
                this.listDistrict(0);
                this.setState({
                    new_user: true
                })
            }
        }
    }
    selectDate = date => {
        this.setState({
            Birthday: date,
        });
    };
    componentDidMount() {
        this.authListener();
    }
    listProvinces = () => {
        const Provinces = [];
        data_provinces.forEach((doc, i) => {

            Provinces.push({
                Key: i,
                value: doc[0]
            })
        })
        this.setState({
            Provinces
        })
    }
    listDistrict = (pid) => {
        const Districts = [];
        data_provinces[pid][1].forEach((doc, i) => {
            Districts.push({
                Key: i,
                value: doc[0]
            })
        })
        if (this.state.Name !== '') {
            this.setState({
                Districts,

            })
        } else {
            this.setState({
                Districts,
                District_ID: '',
                Sub_district_ID: '',
            })
        }

    }
    listSub_district = (pid, did) => {
        const Sub_districts = [];

        data_provinces[pid][1][did][2][0].forEach((doc, i) => {

            Sub_districts.push({
                Key: i,
                value: doc[0]
            })
        })
        if (this.state.Name !== '') {
            this.setState({
                Sub_districts,

            })
        } else {
            this.setState({
                Sub_districts,
                Sub_district_ID: '',
            })
        }
    }


    onSelectProvince = (value, index) => {


        if (value === '') {

            this.setState({
                Districts: [],
                District_ID: '',
                Sub_districts: [],
                Sub_district_ID: '',
            })
        } else {
            this.setState({
                Province_ID: value
            })
            this.listDistrict(value);
        }

    }
    onSelectDistrict = (value, index) => {

        if (value === '') {
            this.setState({
                Sub_districts: [],
                Sub_district_ID: '',
            })
        } else {
            this.setState({
                District_ID: value
            })
            this.listSub_district(this.state.Province_ID, value);
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        })

        const { Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday, Position, Department,
            Province_ID, District_ID, Sub_district_ID, Email, Avatar_URL,
            Area_ID, Role, Area_PID, Area_DID, Area_SDID, User_ID,
            Province, District, Sub_district, User_type, bd,
        } = this.state;
        let Ban_name = '';
        if (!isEmptyValue(this.state.Ban_name)) {
            Ban_name = this.state.Ban_name
        }
        if (isEmptyValue(Avatar_URL)) {
            this.setState({
                loading: false
            })
            Alert.alert("กรุณาอัพโหลดรูปภาพของคุณ")
        } else {
            if (Name === '' || Last_name === '' || Nickname === '' || Sex === '' || Phone_number === '' ||
                Birthday === '' || Position === '' || Department === '' ||
                Province_ID === '' || District_ID === '' || Sub_district_ID === '' || Email === '') {
                Alert.alert("กรุณากรอกข้อมูลให้ครบ");
                this.setState({
                    loading: false
                })
            } else {

                if (this.state.new_user) {
                    //add data user 
                    this.tbUsers.doc(User_ID).set({
                        Name, Last_name, Nickname, Sex, Phone_number,
                        Line_ID, Facebook, Birthday, Position, Department,
                        Province_ID, District_ID, Sub_district_ID, Email, Avatar_URL,
                        Add_date: GetCurrentDate("/"), Area_ID, Role, Area_PID, Area_DID, Area_SDID,

                    }).then((docRef) => {
                        this.setState({
                            loading: false
                            , showBirthday: false
                        })
                        const Province = data_provinces[Province_ID][0];
                        const District = data_provinces[Province_ID][1][District_ID][0];
                        if (!isEmptyValue(Area_ID)) {
                            Ban_name = data_provinces[Area_PID][1][Area_DID][2][0][Area_SDID][1][0][Area_ID][1];
                        }
                        const Sub_district = data_provinces[Province_ID][1][District_ID][2][0][Sub_district_ID][0];
                        var d1 = new Date(Birthday.seconds * 1000);
                        let bd = d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();
                        this.props.fetch_user({
                            User_ID,
                            Name, Last_name, Nickname, Sex, Phone_number,
                            Line_ID, Facebook, Birthday, Position, Department,
                            Province_ID, District_ID, Sub_district_ID, Email, Avatar_URL,
                            Area_ID, Role, Area_PID, Area_DID, Area_SDID,
                            Province, District, Sub_district, User_type, bd, Ban_name
                        });
                        this.props.navigation.navigate('Main')
                        Alert.alert('บันทึกสำเร็จ');
                    })
                        .catch((error) => {
                            this.setState({
                                loading: false
                            })
                            Alert.alert('บันทึกไม่สำเร็จ');
                            console.error("Error adding document: ", error);
                        });

                } else {
                    //update
                    this.tbUsers.doc(User_ID).update({
                        Name, Last_name, Nickname, Sex, Phone_number,
                        Line_ID, Facebook, Birthday: new Date(Birthday.seconds * 1000), Position, Department,
                        Province_ID, District_ID, Sub_district_ID, Email, Avatar_URL, Area_PID, Area_DID, Area_SDID,
                        Add_date: GetCurrentDate("/"), Area_ID, Role,
                    }).then((docRef) => {

                        this.setState({
                            loading: false
                            , showBirthday: false
                        })
                        const Province = data_provinces[Province_ID][0];
                        const District = data_provinces[Province_ID][1][District_ID][0];
                        if (!isEmptyValue(Area_ID)) {
                            Ban_name = data_provinces[Area_PID][1][Area_DID][2][0][Area_SDID][1][0][Area_ID][1];
                        }
                        const Sub_district = data_provinces[Province_ID][1][District_ID][2][0][Sub_district_ID][0];
                        var d1 = new Date(Birthday.seconds * 1000);
                        let bd = d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();

                        this.props.fetch_user({
                            User_ID,
                            Name, Last_name, Nickname, Sex, Phone_number,
                            Line_ID, Facebook, Birthday, Position, Department,
                            Province_ID, District_ID, Sub_district_ID,
                            Email, Avatar_URL,
                            Area_ID, Role, Area_PID, Area_DID, Area_SDID,
                            Province, District, Sub_district,
                            User_type, bd, Ban_name

                        });
                        Alert.alert("อัพเดตสำเร็จ");
                    })
                        .catch((error) => {
                            this.setState({
                                loading: false
                            })
                            Alert.alert('อัพเดตไม่สำเร็จ');
                            console.error("Error update document: ", error);
                        });

                }

            }
        }


    }
    handleChoosePhoto = () => {
        const options = {
            title: 'เลือกรูปโปรไฟล์',
            takePhotoButtonTitle: 'ถ่ายรูป',
            chooseFromLibraryButtonTitle: 'เลือกรูปในคลัง',
            cancelButtonTitle: 'ยกเลิก',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri }

                // You can also display the image using data:
                //const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    imgSource: source,
                    imageUri: response.uri,
                    isUploaded: false,

                });

                this.uploadImage(this.state.User_ID);
            }
        });


    }

    uploadImage = async (filename) => {
        console.log('start upload :' + filename)
        var image = Platform.OS === 'ios' ? this.state.imageUri.replace('file://', '') : this.state.imageUri;
        const Blob = RNFetchBlob.polyfill.Blob;
        window.Blob = Blob;
        const tempWindowXMLHttpRequest = window.XMLHttpRequest;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;


        let uploadBlob = null
        const imageRef = Firebase.storage().ref('Avatar').child('user' + filename);
        let mime = 'image/jpg';
        RNFetchBlob.fs.readFile(image, 'base64')
            .then((data) => {


                return Blob.build(data, { type: `${mime};BASE64` });
            })
            .then((blob) => {

                uploadBlob = blob;
                return imageRef.put(blob, { contentType: mime });
            })
            .then(() => {

                uploadBlob.close();
                return imageRef.getDownloadURL();
            })
            .then((url) => {
                // URL of the image uploaded on Firebase storage
                console.log(url);
                window.XMLHttpRequest = tempWindowXMLHttpRequest;
                this.setState({ Avatar_URL: url, isUploaded: true });

            })
            .catch((error) => {
                console.log("error image", error);

            })
    }

    selectDate = date => {
        var day = date.getDate();
        var month = (parseInt(date.getMonth(), 10) + 1);
        var year = date.getFullYear();
        this.setState({
            Birthday: date,
            day,
            month,
            year,
            showBirthday: true
        });
    };

    render() {
        //step create Email

        const { Email, } = this.state;
        //User Profile
        const { Name, Last_name, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday, Position, Department,
            Province_ID, District_ID, Sub_district_ID,
            Role, Avatar_URL
        } = this.state;
        //List data
        const { Provinces, Districts, Sub_districts, User_types } = this.state;
        if (this.state.loading) {
            return (<Loading></Loading>)
        } else {
            return (
                <Container>
                    <Content>

                        <View style={styles.container}>
                            {(isEmptyValue(Avatar_URL) ?
                                <Image source={require('../assets/user.png')} style={styles.avatar}></Image>
                                : <Image source={{ uri: Avatar_URL }} style={styles.avatar}></Image>)}

                            <View>
                                <Button style={{ margin: 10 }} onPress={this.handleChoosePhoto.bind(this)}>
                                    <Icon name='plus' type="AntDesign" />
                                    <Text>เลือกรูป</Text>
                                </Button>
                            </View>


                            <Item fixedLabel >
                                <Label>ชื่อ :</Label>
                                <Input value={Name} onChangeText={str => this.setState({ Name: str })} />
                            </Item>
                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>นามสกุล :</Label>
                                <Input value={Last_name} onChangeText={str => this.setState({ Last_name: str })} />
                            </Item>
                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>ชื่อเล่น :</Label>
                                <Input value={Nickname} onChangeText={str => this.setState({ Nickname: str })} />
                            </Item>
                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>เพศ :</Label>
                                <Picker
                                    selectedValue={Sex}
                                    onValueChange={str => this.setState({ Sex: str })}>
                                    <Picker.Item label="เลือกเพศ" value="" />
                                    <Picker.Item label="ชาย" value="ชาย" />
                                    <Picker.Item label="หญิง" value="หญิง" />
                                    <Picker.Item label="อื่นๆ" value="อื่นๆ" />

                                </Picker>
                            </Item>

                            <Item>
                                {/* {console.log('true', this.state.showBirthday)} */}
                                {this.state.showBirthday ? <Text></Text> : <Text style={{ fontSize: 16 }}>
                                    {this.state.day + "/" + this.state.month + "/" + this.state.year}
                                </Text>

                                }
                                <DatePicker

                                    maximumDate={new Date()}
                                    placeHolderText="วันเกิด"
                                    dateFormat="dd/MM/yyyy"
                                    onDateChange={this.selectDate}
                                    placeholderText="วัน/เดือน/ปี(ค.ศ.)"
                                    animationType="fade"
                                />

                            </Item>

                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>เบอร์มือถือ :</Label>
                                <Input value={Phone_number} onChangeText={str => this.setState({ Phone_number: str })} />
                            </Item>
                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>Facebook :</Label>
                                <Input value={Facebook} onChangeText={str => this.setState({ Facebook: str })} />
                            </Item>
                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>Line_ID :</Label>
                                <Input value={Line_ID} onChangeText={str => this.setState({ Line_ID: str })} />
                            </Item>
                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>ประเภทผู้ใช้ :</Label>
                                <Picker
                                    selectedValue={this.state.User_type}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ User_type: itemValue })}>
                                    <Picker.Item key="0" label="เลือกประเภทผู้ใช้" value="" />
                                    <Picker.Item key="1" label="ผู้บริหาร" value="ผู้บริหาร" />
                                    <Picker.Item key="2" label="พี่เลี้ยง" value="พี่เลี้ยง" />
                                    <Picker.Item key="3" label="แกนนำเด็ก" value="แกนนำเด็ก" />


                                </Picker>
                            </Item>

                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>ตำแหน่ง :</Label>
                                <Input value={Position} onChangeText={str => this.setState({ Position: str })} />
                            </Item>
                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>หน่วยงาน :</Label>
                                <Input value={Department} onChangeText={str => this.setState({ Department: str })} />
                            </Item>

                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>ประเภทผู้ใช้ :</Label>
                                <Picker
                                    selectedValue={Province_ID}
                                    onValueChange={this.onSelectProvince.bind(this)}>
                                    <Picker.Item key="0" label="เลือกจังหวัด" value="" />
                                    {Provinces.map((data, i) =>
                                        < Picker.Item key={i + 1} label={data.value} value={data.Key} />
                                    )}

                                </Picker>
                            </Item>
                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>ประเภทผู้ใช้ :</Label>
                                <Picker
                                    selectedValue={District_ID}
                                    onValueChange={this.onSelectDistrict.bind(this)}>
                                    <Picker.Item key="0" label="เลือกอำเภอ" value="" />
                                    {Districts.map((data, i) =>
                                        <Picker.Item key={i + 1} label={data.value} value={data.Key} />
                                    )}
                                </Picker>
                            </Item>
                            <Item fixedLabel style={{ marginTop: 20 }}>
                                <Label>ประเภทผู้ใช้ :</Label>
                                <Picker
                                    selectedValue={Sub_district_ID}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({ Sub_district_ID: itemValue })
                                    }>
                                    <Picker.Item key="0" label="เลือกตำบล" value="" />
                                    {Sub_districts.map((data, i) =>
                                        <Picker.Item key={i + 1} label={data.value} value={data.Key} />
                                    )}
                                </Picker>
                            </Item>





                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Button success style={{ margin: 10 }} onPress={this.onSubmit.bind(this)}>
                                        <Icon name='save' type="AntDesign" />
                                        <Text>บันทึก</Text></Button>
                                    <Button danger style={{ margin: 10 }} onPress={() => this.props.navigation.goBack()}>
                                        <Icon name='left' type="AntDesign" />
                                        <Text>กลับ</Text></Button>
                                </View>
                            </View>
                        </View>


                    </Content>
                </Container>
            )
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen);
