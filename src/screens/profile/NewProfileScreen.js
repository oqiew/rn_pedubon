import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native'
import Loading from '../../components/Loading'
import { routeName } from '../../routes/RouteConstant'
import { Icon, Input, Label, Item, Picker, Text, Button, Container, Content, } from 'native-base';
import { fetch_user } from '../../actions';
import Storage from '@react-native-firebase/storage'
import { connect } from 'react-redux';
import styles from '../../styles/main.styles';
import themeStyle from '../../styles/theme.style';
import ImagePicker from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer'
import { isEmptyValue, isEmptyValues } from '../../components/Methods';
import DatePicker from 'react-native-datepicker'
import PDHeader from '../../components/header';
import firestore from '@react-native-firebase/firestore';
import { TableName } from '../../database/constan';
import { ScrollView } from 'react-native-gesture-handler';


const style_private = StyleSheet.create({
    image: {
        borderRadius: 10, width: 200, height: 200, marginHorizontal: 5, marginVertical: 5,
        borderWidth: 2, borderColor: themeStyle.Color_content,
    }
})


export class NewProfileScreen extends Component {
    constructor(props) {
        super(props)
        this.tbUser = firestore().collection(TableName.Users);
        this.state = {
            loading: false,
            uid: this.props.fetchReducer.user.uid,
            email: this.props.fetchReducer.user.email,
            step: 1,
            Name: '',
            Lastname: '',
            Nickname: '',
            Sex: 'ชาย',
            Phone_number: '',
            Line_ID: '',
            Facebook: '',
            Birthday: '',
            Birthday_format: '',
            Position: '',
            avatar_uri: '',
            Avatar_URL: '',
            Role: '',
            Local_ID: '',
            User_type: '',
            query_areas: [],
            Area_ID: '',
            areas: [],
            area: '',
            dominance: ''
        }
    }
    componentDidMount() {
        firestore().collection(TableName.Areas).onSnapshot(this.onUpdateAreas);
    }
    onUpdateAreas = (querySnapshot) => {
        const query_areas = []
        querySnapshot.forEach(element => {
            query_areas.push({
                areaID: element.id,
                ...element.data()
            })
        });

        this.setState({
            query_areas
        })
    }
    uploadImage() {
        console.log("upload image")
        return new Promise((resolve, reject) => {
            const imageRef = Storage().ref('User').child('user' + this.state.uid + '.jpg')
            let mime = 'image/jpg';
            imageRef.putFile(this.state.avatar_uri, { contentType: mime })
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
                            avatar_uri: uri
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        })
    }
    _onNext = () => {
        if (this.state.step === 1) {
            if (isEmptyValue(this.state.avatar_uri) === false) {
                this.setState({
                    step: this.state.step + 1
                })
            } else {
                Alert.alert("กรุณาอัพโหลดรูปภาพ")
            }

        } else if (this.state.step === 2) {
            if (isEmptyValue(this.state.User_type) === false) {
                this.setState({
                    step: this.state.step + 1
                })
            } else {
                Alert.alert("กรุณาเลือกประเภท")
            }
        } else if (this.state.step === 3) {
            const { Name, Lastname, Nickname, Sex, Birthday_format } = this.state;
            if (isEmptyValues([Name, Lastname, Nickname, Sex, Birthday_format]) === false) {
                this.setState({
                    step: this.state.step + 1
                })
            } else {
                Alert.alert("กรุณากรอกข้อมูลที่สำคัญให้ครบ")
            }
        }
    }
    _onPrevious = () => {
        this.setState({
            step: this.state.step - 1
        })
    }
    _onSave = async () => {
        this.setState({
            loading: true
        })
        const { uid, email, avatar_uri, Name, Lastname, Nickname, Sex, Phone_number, User_type,
            Line_ID, Facebook, Birthday_format, Position, Area_ID, } = this.state;

        if (isEmptyValue(Area_ID)) {
            Alert.alert("กรุณาเลือกพื้นที่")
            this.setState({
                loading: false
            })
        } else {
            console.log("add")
            const Avatar_URL = await this.uploadImage();
            if (isEmptyValue(Avatar_URL)) {
                Alert.alert("อัพโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่")
                this.setState({
                    loading: false
                })
            } else {
                console.log("start add")
                const Birthday_array = Birthday_format.split('-');
                const Birthday = new Date(Birthday_array[2], (parseInt(Birthday_array[1], 10) - 1), Birthday_array[0]);
                this.tbUser.doc(uid).set({
                    Name, Lastname, Nickname, Sex, Phone_number, User_type, Email: email, Birthday,
                    Line_ID, Facebook, Birthday_format, Position, Area_ID, Avatar_URL, Create_date: firestore.Timestamp.now()
                }).then((success) => {
                    Alert.alert("บันทึกข้อมูลสำเร็จ")
                    this.props.fetch_user({
                        uid, email, avatar_uri, Name, Lastname, Nickname, Sex, Phone_number, User_type,
                        Line_ID, Facebook, Birthday_format, Position, Area_ID, Avatar_URL, Birthday,
                    });
                    this.setState({
                        loading: false
                    })

                    this.props.navigation.navigate(routeName.Main);

                }).catch((error) => {
                    Alert.alert("บันทึกข้อมูลไม่สำเร็จ");
                    this.setState({
                        loading: false
                    })
                })
            }
        }

    }
    onChangeDominance = (dominance) => {
        if (dominance === '') {
            return [];
        }
        const { query_areas } = this.state;

        const regex = new RegExp(`${dominance.trim()}`, 'i');
        const areas = query_areas.filter(area => area.Dominance.search(regex) >= 0)
        this.setState({
            areas,
            dominance
        })
    }
    onAreaSearch = (area) => {
        const { query_areas } = this.state;
        const regex = new RegExp(`${area.trim()}`, 'i');
        const areas = query_areas.filter(area => area.Area_name.search(regex) >= 0)
        this.setState({
            areas,
            area
        })
    }
    onSelectArea = (data) => {
        this.setState({
            area: data.Area_name,
            Area_ID: data.areaID
        })
    }
    render() {
        const { Avatar_URL, avatar_uri } = this.state;
        const { step } = this.state;
        const { Name, Lastname, Nickname, Sex, Phone_number,
            Line_ID, Facebook, Birthday_format, Position,
        } = this.state;
        const { areas, area, dominance } = this.state;
        return (
            <Container style={{ backgroundColor: themeStyle.background }}>
                <PDHeader name="เพิ่มข้อมูลโปรไฟล์" backHandler={null}></PDHeader>
                <Loading visible={this.state.loading}></Loading>
                <Content contentContainerStyle={{ padding: 15 }}>
                    {step === 1 ?
                        // รูป
                        <View tyle={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 5 }}>อัพโหลดรูปโปรไฟล์</Text>
                            {isEmptyValue(avatar_uri) === false ?
                                <TouchableOpacity onPress={this._handleChoosePhoto} style={{ marginBottom: 20, alignItems: 'center' }}>
                                    <Image style={[style_private.image]} source={{ uri: avatar_uri }} />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={this._handleChoosePhoto} style={{ marginBottom: 20, alignItems: 'center' }}>
                                    <View style={[style_private.image, { backgroundColor: themeStyle.Color_white, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Icon name='plus' backgroundColor={themeStyle.Color_white} style={{ color: themeStyle.Color_content, fontSize: 60 }} type="AntDesign" />
                                    </View>
                                </TouchableOpacity>}
                        </View>
                        : step === 2 ?
                            // หน้าเลือกประเภท
                            <View style={{ alignItems: 'center', marginBottom: 10 }}>
                                <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 5 }}>ประเภทผู้ใช้ {this.state.User_type}</Text>
                                {['ผู้บริหาร', 'พี่เลี้ยง', 'แกนนำเด็ก'].map((element) =>
                                    <TouchableOpacity
                                        onPress={() => this.setState({
                                            User_type: element
                                        })}
                                        style={[styles.item, { height: 50, borderRadius: 10, width: 150, backgroundColor: themeStyle.Color_content }]}>
                                        <Text style={{ fontSize: 24, color: themeStyle.Color_white }}>{element}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            : step === 3 ?
                                // ข้อมูลส่วนตัว
                                <View style={{ marginBottom: 10 }}>
                                    <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 5 }}>ข้อมูลส่วนตัว {this.state.User_type}</Text>
                                    <Item fixedLabel >
                                        <Label>ชื่อ<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <Input value={Name}
                                            placeholder="ชื่อจริงไม่ต้องใส่คำนำหน้า"
                                            onChangeText={str => this.setState({ Name: str })} />
                                    </Item>
                                    <Item fixedLabel style={{ marginTop: 5 }}>
                                        <Label>นามสกุล<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <Input value={Lastname}
                                            placeholder="นามสกุล"
                                            onChangeText={str => this.setState({ Lastname: str })} />
                                    </Item>
                                    <Item fixedLabel style={{ marginTop: 5 }}>
                                        <Label>ชื่อเล่น<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <Input value={Nickname}
                                            placeholder="ชื่อเล่น"
                                            onChangeText={str => this.setState({ Nickname: str })} />
                                    </Item>
                                    <Item fixedLabel style={{ marginTop: 5 }}>
                                        <Label>เพศ<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <Picker
                                            mode="dropdown"
                                            placeholder="เลือกเพศ"
                                            iosIcon={<Icon name="down" type="AntDesign"></Icon>}
                                            style={{ left: -56 }}
                                            selectedValue={Sex}
                                            onValueChange={str => this.setState({ Sex: str })}>
                                            <Picker.Item label="ชาย" value="ชาย" />
                                            <Picker.Item label="หญิง" value="หญิง" />
                                            <Picker.Item label="อื่นๆ" value="อื่นๆ" />
                                        </Picker>
                                    </Item>
                                    <Item fixedLabel style={{ marginTop: 5 }}>
                                        <Label>วันเกิด<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <DatePicker
                                            style={{ width: 200 }}
                                            date={Birthday_format}
                                            mode="date"
                                            placeholder="เลือกวันเกิด(ค.ศ.)"
                                            format="DD-MM-YYYY"
                                            maxDate={new Date()}
                                            confirmBtnText="ตกลง"
                                            cancelBtnText="ยกเลิก"
                                            duration={300}
                                            customStyles={{
                                                dateIcon: {
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: 4,
                                                    marginRight: 0,
                                                },
                                                dateInput: {
                                                    marginRight: 36,
                                                },
                                                placeholderText: {
                                                    fontSize: 16,
                                                    color: '#5c5c5c',
                                                },
                                            }}
                                            onDateChange={(date) => { this.setState({ Birthday_format: date }) }}
                                        // onDateChange={(date) => { console.log(new Date(date)) }}
                                        />

                                    </Item>
                                    <Item fixedLabel style={{ marginTop: 5 }}>
                                        <Label>เบอร์มือถือ :</Label>
                                        <Input value={Phone_number}
                                            placeholder="เบอร์มือถือ"
                                            keyboardType="number-pad"
                                            onChangeText={str => this.setState({ Phone_number: str })} />
                                    </Item>
                                    <Item fixedLabel style={{ marginTop: 5 }}>
                                        <Label>Facebook :</Label>
                                        <Input value={Facebook}
                                            placeholder="Facebook"
                                            onChangeText={str => this.setState({ Facebook: str })} />
                                    </Item>
                                    <Item fixedLabel style={{ marginTop: 5 }}>
                                        <Label>Line_ID :</Label>
                                        <Input value={Line_ID}
                                            placeholder="Line_ID"
                                            onChangeText={str => this.setState({ Line_ID: str })} />
                                    </Item>
                                    <Item fixedLabel style={{ marginTop: 5 }}>
                                        <Label>ตำแหน่ง :</Label>
                                        <Input value={Position}
                                            placeholder="ตำแหน่งในสภาเด็ก"
                                            onChangeText={str => this.setState({ Position: str })} />
                                    </Item>
                                </View>
                                :
                                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 5 }}>เลือกองค์กรปกครองส่วนท้องถิ่น {this.state.User_type}</Text>
                                    <Item fixedLabel style={{ marginTop: 5 }}>
                                        <Label>รูปแบบ อปท<Text style={{ color: themeStyle.Color_red }}>*</Text> :</Label>
                                        <Picker
                                            mode="dropdown"
                                            placeholder="เลือกรูปแบบ อปท"
                                            iosIcon={<Icon name="down" type="AntDesign"></Icon>}
                                            style={{ left: -56 }}
                                            selectedValue={dominance}
                                            onValueChange={str => this.onChangeDominance(str)}>
                                            <Picker.Item label="องค์การบริหารส่วนจังหวัด" value="องค์การบริหารส่วนจังหวัด" />
                                            <Picker.Item label="เทศบาลนคร" value="เทศบาลนคร" />
                                            <Picker.Item label="เทศบาลเมือง" value="เทศบาลเมือง" />
                                            <Picker.Item label="เทศบาลตำบล" value="เทศบาลตำบล" />
                                            <Picker.Item label="องค์การบริหารส่วนตำบล" value="องค์การบริหารส่วนตำบล" />
                                        </Picker>
                                    </Item>
                                    {isEmptyValue(dominance) === false && <Item fixedLabel style={{ marginTop: 5 }}>
                                        <Label>อปท :</Label>
                                        <Input value={area}
                                            placeholder="ค้นหา อปท"
                                            onChangeText={str => this.onAreaSearch(str)} />
                                    </Item>}

                                    {areas.length !== 0 &&
                                        <View style={{ height: 200 }}>
                                            <ScrollView>
                                                {areas.map((element, i) =>
                                                    <TouchableOpacity key={i}
                                                        onPress={this.onSelectArea.bind(this, element)}
                                                        style={{ margin: 5, width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
                                                        <Text style={{ fontSize: 18 }}>{element.Area_name}</Text>
                                                        <Text style={{ color: themeStyle.Color_green, marginLeft: 5 }}>เลือก</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </ScrollView>
                                        </View>
                                    }
                                </View>
                    }
                    {/* ปุ่มกด */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        {this.state.step !== 1 &&
                            <Button primary style={{ marginLeft: 10, marginRight: 10 }} onPress={this._onPrevious}>
                                <Text style={{ fontSize: 26 }}>ก่อนหน้า</Text>
                            </Button>}
                        {this.state.step < 4 &&
                            <Button primary style={{ marginLeft: 10, marginRight: 10 }} onPress={this._onNext}>
                                <Text style={{ fontSize: 26 }}>ถัดไป</Text>
                            </Button>}
                        {this.state.step === 4 &&
                            <Button primary style={{ marginLeft: 10, marginRight: 10 }} onPress={this._onSave}>
                                <Text style={{ fontSize: 26 }}>บันทึกข้อมูล</Text>
                            </Button>}
                    </View>
                </Content>

            </Container >
        )
    }
}


const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer,
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewProfileScreen);

