import React, { Component } from 'react'
import { View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native'
import Firebase from '../Firebase';
import Idelete from '../assets/trash_can.png';
import Iedit from '../assets/pencil.png';
import styles from '../styles/main.styles';
import { Container, Content, FooterTab, Footer, Item, Label, Input, Textarea, Form, Picker, Text, Button, Icon } from 'native-base';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import { isEmptyValue } from '../components/Methods';
import firestore from '@react-native-firebase/firestore';

export class LocalCalendarScreen extends Component {
    constructor(props) {
        super(props);
        this.tbLocalCalendar = firestore().collection('LOCAL_CALENDARS');
        //getl);
        this.state = {
            status_add: false,
            edit_ID: '',
            //data class
            dataCalendar1: [],
            dataCalendar2: [],
            statusSave: "",
            Month1: "",
            Month2: "",
            mouth: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
            showMouth1: [],
            showMouth2: [],
            Name_activity: "",
            //getuser
            ...this.props.fetchReducer.user,
            selected: 1,
            loading: false,

        }
    }



    onCollectionUpdate = (querySnapshot) => {
        console.log("calendar size", querySnapshot.size)
        const dataCalendar1 = [];
        const dataCalendar2 = [];
        var count = 1;

        querySnapshot.forEach((doc) => {
            const { Name_activity, Month1, Month2, Type_activity } = doc.data();
            const mn1 = parseInt(Month1, 10);
            const mn2 = parseInt(Month2, 10);
            var temp = [];


            if (Type_activity === 'เศรษฐกิจ') {
                dataCalendar1.push({
                    Key: doc.id,
                    Name_activity,
                    Month1: this.state.mouth[mn1 - 1],
                    Month2: this.state.mouth[mn2 - 1],
                    Type_activity
                });
            } else {

                dataCalendar2.push({
                    Key: doc.id,
                    Name_activity,
                    Month1: this.state.mouth[mn1 - 1],
                    Month2: this.state.mouth[mn2 - 1],
                    Type_activity
                });
            }
        });
        this.setState({
            dataCalendar1,
            dataCalendar2
        });
    }

    delete(id) {
        firestore().collection('LOCAL_CALENDARS').doc(id).delete().then(() => {
            console.log("Document successfully deleted!");

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    edit(id) {
        this.setState({ loading: true });
        firestore().collection('LOCAL_CALENDARS').doc(id).get().then((doc) => {
            const { Name_activity, Type_activity } = doc.data();
            const { mouth } = this.state;
            const Month1 = parseInt(doc.data().Month1, 10);
            const Month2 = parseInt(doc.data().Month2, 10);
            const showMouth2 = [];
            for (let index = Month1; index <= 12; index++) {
                showMouth2.push(<Picker.Item key={index} label={mouth[index - 1] + ""} value={index} />)
            }

            this.setState({
                Name_activity, Month1, Month2, Type_activity, edit_ID: id, selected: 3, loading: false, showMouth2
            })


        }).catch((error) => {
            console.error("Error document: ", error);
        });
    }
    cancelEdit = (e) => {
        this.setState({
            Name_activity: '', Month1: '', Month2: '', Type_activity: '', edit_ID: '', selected: 1
        })
    }
    componentDidMount() {
        this.authListener();
    }
    authListener() {
        if (isEmptyValue(this.state.User_ID)) {
            this.props.navigation.navigate('Home');
        } else {
            const { Area_ID, Area_PID, Area_DID, Area_SDID, Name } = this.state;
            this.unsubscribe = this.tbLocalCalendar
                .where('Area_PID', '==', Area_PID).where('Area_DID', '==', Area_DID).where('Area_SDID', '==', Area_SDID)
                .where('Area_ID', '==', Area_ID)
                .onSnapshot(this.onCollectionUpdate);
            this.genrateMonth(0, 0);
        }


    }



    genrateMonth(str, d) {

        var Month1 = 1;
        if (d === 0) {
            Month1 = 1;
        }
        if (d === 1) {
            Month1 = str;
            this.setState({
                Month1: str
            })
        }
        if (d === 2) {
            Month1 = this.state.Month1;
            this.setState({
                Month2: str
            })
        }
        const showMouth1 = [], showMouth2 = [];
        const { mouth, } = this.state;
        const mn1 = parseInt(Month1, 10);

        for (let index = 1; index <= 12; index++) {
            showMouth1.push(<Picker.Item key={index} label={mouth[index - 1] + ""} value={index} />)
        }
        for (let index = mn1; index <= 12; index++) {
            showMouth2.push(<Picker.Item key={index} label={mouth[index - 1] + ""} value={index} />)

        }

        this.setState({
            showMouth1,
            showMouth2
        })
    }
    onSubmit = e => {
        e.preventDefault()
        this.setState({ loading: true });
        const { Name_activity, Month1, Month2, User_ID, Type_activity, Name, edit_ID,
            Area_ID, Area_PID, Area_DID, Area_SDID,
        } = this.state;
        if (Name_activity === '' || Month1 === '' || Month2 === '' || Type_activity === '') {
            this.setState({
                loading: false
            });
            Alert.alert("กรุณากรอกข้อมูลให้ครบ");
        } else {
            if (edit_ID !== '') {
                this.tbLocalCalendar.doc(edit_ID).set({
                    Name_activity, Type_activity
                    , Month1, Month2, Informer_ID: User_ID, Informer_name: Name
                    , Area_ID, Area_PID, Area_DID, Area_SDID
                }).then((docRef) => {
                    this.setState({
                        Name_activity: "", Month1: "", Month2: "", Type_activity: '',
                        selected: 1, edit_ID: '', loading: false
                    });
                    Alert.alert("บันทึกข้อมูลสำเร็จ");

                }).catch((error) => {
                    this.setState({
                        loading: false
                    });
                    Alert.alert("บันทึกข้อมูลไม่สำเร็จ");
                    console.error("Error adding document: ", error);
                });

            } else {
                this.tbLocalCalendar.add({
                    Name_activity, Type_activity
                    , Month1, Month2, Informer_ID: User_ID, Informer_name: Name
                    , Area_ID, Area_PID, Area_DID, Area_SDID
                }).then((docRef) => {
                    this.setState({
                        Name_activity: "", Month1: "", Month2: "", Type_activity: '',
                        selected: 1, loading: false
                    });
                    Alert.alert("บันทึกข้อมูลสำเร็จ");

                }).catch((error) => {
                    this.setState({
                        loading: false
                    });
                    Alert.alert("บันทึกข้อมูลไม่สำเร็จ");
                    console.error("Error adding document: ", error);
                });

            }
        }


    }
    render() {
        const { Month1, Month2, Name_activity, Type_activity } = this.state;
        if (this.state.loading) {
            return (<ActivityIndicator size={'large'}></ActivityIndicator>)
        } else {
            return (
                <Container>
                    <Text style={styles.title}>บ้าน {this.state.Ban_name}หมู่ที่{this.state.Area_ID + 1}</Text>

                    {this.state.selected === 1 ?
                        <Content>
                            <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                                <Text style={{ fontWeight: 'bold', margin: 10, width: '35%', textAlign: 'center' }}>รายการ</Text>
                                <Text style={{ fontWeight: 'bold', margin: 10, width: '25%', textAlign: 'center' }}>ช่วงเวลา</Text>
                                <Text style={{ fontWeight: 'bold', margin: 10, width: '20%', textAlign: 'center' }}>แก้ไข</Text>
                            </View>
                            <Text style={{ textAlign: 'center', color: 'red', backgroundColor: '#c0c0c0' }}>เศรษฐกิจ</Text>
                            {this.state.dataCalendar1.map((element, i) =>
                                <View Key={i} style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ margin: 10, width: '35%', textAlign: 'center' }}>
                                        {element.Name_activity}</Text>
                                    <Text style={{ margin: 10, width: '25%', textAlign: 'center' }}>
                                        {element.Month1}-{element.Month2}</Text>
                                    <View style={{ margin: 10, width: '20%', flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={this.edit.bind(this, element.Key)}>
                                            <Image source={require('../assets/pencil.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.delete.bind(this, element.Key)}>
                                            <Image source={require('../assets/trash_can.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            <View style={{ backgroundColor: '#c0c0c0' }}>
                                <Text style={{ textAlign: 'center', color: 'red' }}>วัฒนธรรมประเพณี</Text>
                            </View>

                            {this.state.dataCalendar2.map((element, i) =>
                                <View Key={i} style={{ flex: 1, flexDirection: 'row', }}>

                                    <Text style={{ margin: 10, width: '35%', textAlign: 'center' }}>
                                        {element.Name_activity}</Text>
                                    <Text style={{ margin: 10, width: '25%', textAlign: 'center' }}>
                                        {element.Month1}-{element.Month2}</Text>
                                    <View style={{ margin: 10, width: '20%', flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={this.edit.bind(this, element.Key)}>
                                            <Image source={require('../assets/pencil.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.delete.bind(this, element.Key)}>
                                            <Image source={require('../assets/trash_can.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                        </Content> : <View></View>
                    }

                    {this.state.selected === 3 ?
                        <Content style={{ padding: 20 }}>
                            <Item fixedLabel >
                                <Label>ชื่อ</Label>
                                <Input value={Name_activity}
                                    onChangeText={str => this.setState({ Name_activity: str })} placeholder="ชื่อ กิจกรรม ประเพณี หรือสิ่งที่ทำ" />
                            </Item>
                            <Item fixedLabel >
                                <Label>ประเภท</Label>
                                <Picker
                                    selectedValue={Type_activity}
                                    placeholder="เลือกประเภทกิจกรรม"
                                    onValueChange={str => this.setState({ Type_activity: str })}>
                                    <Picker.Item key="1" label="วัฒนธรรมประเพณี" value="วัฒนธรรมประเพณี" />
                                    <Picker.Item key="2" label="เศรษฐกิจ" value="เศรษฐกิจ" />
                                </Picker>
                            </Item>
                            <Item fixedLabel >
                                <Label>เดือนที่เริ่ม</Label>
                                <Picker
                                    selectedValue={Month1}
                                    placeholder="เลือกเดือนที่เริ่ม"
                                    onValueChange={str => this.genrateMonth(str, 1)}>
                                    {this.state.showMouth1}

                                </Picker>
                            </Item>
                            <Item fixedLabel >
                                <Label>เดือนที่สิ้นสุด</Label>
                                <Picker
                                    selectedValue={Month2}
                                    placeholder="เลือกเดือนที่สิ้นสุด"
                                    onValueChange={str => this.genrateMonth(str, 2)}>
                                    {this.state.showMouth2}

                                </Picker>
                            </Item>



                            <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                                <Button success style={{ margin: 10 }} onPress={this.onSubmit.bind(this)}>
                                    <Icon name='save' type="AntDesign" />
                                    <Text>บันทึก</Text></Button>
                                <Button danger style={{ margin: 10 }} onPress={this.cancelEdit.bind(this)}>
                                    <Icon name='left' type="AntDesign" />
                                    <Text>กลับ</Text></Button>
                            </View>

                        </Content>

                        : <View></View>
                    }
                    <Footer>
                        <FooterTab style={styles.footer}>
                            <TouchableOpacity onPress={() => this.setState({ selected: 1 })}>
                                <Text style={{ textAlign: 'center', marginLeft: '30%' }}>ปฏิทิน</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({ selected: 3 })}>
                                <Text style={{ textAlign: 'center', marginRight: '30%' }}>เพิ่มข้อมูล</Text>
                            </TouchableOpacity>
                        </FooterTab>
                    </Footer>
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

export default connect(mapStateToProps, mapDispatchToProps)(LocalCalendarScreen);

