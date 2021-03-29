import React, { Component } from 'react'
import { View, TouchableOpacity, Image, Alert } from 'react-native'
import styles from '../styles/main.styles';
import { Container, Content, FooterTab, Footer, Item, Label, Input, Picker, Text, Button, Icon } from 'native-base';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import { isEmptyValue } from '../components/Methods';
import firestore from '@react-native-firebase/firestore';
import { TableName } from '../database/constan';
import { routeName } from '../routes/RouteConstant';
import themeStyle from '../styles/theme.style';
import Loading from '../components/Loading';
import PDHeader from '../components/header';
import { element } from 'prop-types';

export class LocalCalendarScreen extends Component {
    constructor(props) {
        super(props);
        this.tbLocalCalendars = firestore().collection(TableName.Local_calendars);
        this.tbBans = firestore().collection(TableName.Bans)
        //getl);
        this.state = {
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
            Name_activity: '',
            ban: '',
            selected_ban: {
                Name: '',
                ID: ''
            },
            query_bans: [],
            bans: [],
            //getuser
            ...this.props.fetchReducer.user,
            selected: 1,
            loading: false,


        }
    }


    onListBans = (query) => {
        const query_bans = [];
        query.forEach(doc => {
            query_bans.push({
                ID: doc.id,
                ...doc.data()
            })
        });
        this.setState({
            query_bans,
            bans: query_bans
        })
    }
    onCollectionUpdate = (querySnapshot) => {
        const dataCalendar1 = [];
        const dataCalendar2 = [];
        querySnapshot.forEach((doc) => {
            const { Name_activity, Month1, Month2, Type_activity } = doc.data();
            const mn1 = parseInt(Month1, 10);
            const mn2 = parseInt(Month2, 10);
            if (Type_activity === 'เศรษฐกิจ') {
                dataCalendar1.push({
                    Key: doc.id,
                    Name_activity,
                    Month1: this.state.mouth[mn1 - 1],
                    Month2: this.state.mouth[mn2 - 1],
                    Month1db: Month1,
                    Month2db: Month2,
                    Type_activity
                });
            } else {
                dataCalendar2.push({
                    Key: doc.id,
                    Name_activity,
                    Month1: this.state.mouth[mn1 - 1],
                    Month2: this.state.mouth[mn2 - 1],
                    Month1db: Month1,
                    Month2db: Month2,
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
        this.tbLocalCalendars.doc(id).delete().then(() => {
            console.log("Document successfully deleted!");

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    edit(data) {
        this.setState({ loading: true });
        const { Name_activity, Type_activity } = data;
        const { mouth } = this.state;
        const Month1 = parseInt(data.Month1db, 10);
        const Month2 = parseInt(data.Month2db, 10);
        const showMouth2 = [];
        for (let index = Month1; index <= 12; index++) {
            showMouth2.push(<Picker.Item key={index} label={mouth[index - 1] + ""} value={index} />)
        }
        this.setState({
            Name_activity, Month1, Month2, Type_activity, edit_ID: data.Key, selected: 3, loading: false, showMouth2
        })
    }
    cancelEdit = (e) => {
        this.setState({
            Name_activity: '', Month1: '', Month2: '', Type_activity: '', edit_ID: '', selected: 2
        })
    }
    componentDidMount() {
        this.authListener();
    }
    authListener() {
        if (isEmptyValue(this.state.uid)) {
            this.props.navigation.navigate(routeName.Home);
        } else {
            if (!isEmptyValue(this.state.selected_ban.ID)) {
                this.unsubscribe = this.tbLocalCalendars
                    .where('Ban_ID', '==', this.state.selected_ban.ID)
                    .onSnapshot(this.onCollectionUpdate);
            }
            this.genrateMonth(0, 0);
            this.tbBans.onSnapshot(this.onListBans)
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
        const { Name_activity, Month1, Month2, uid, Type_activity, Name, edit_ID,
            Area_ID, selected_ban
        } = this.state;
        if (!isEmptyValue(selected_ban.ID)) {
            if (Name_activity === '' || Month1 === '' || Month2 === '' || Type_activity === '') {
                this.setState({
                    loading: false
                });
                Alert.alert("กรุณากรอกข้อมูลให้ครบ");
            } else {
                if (!isEmptyValue(edit_ID)) {
                    this.tbLocalCalendars.doc(edit_ID).set({
                        Name_activity, Type_activity
                        , Month1, Month2, Informer_ID: uid, Informer_name: Name
                        , Ban_ID: this.state.selected_ban.ID,
                    }).then((docRef) => {
                        this.setState({
                            Name_activity: "", Month1: "", Month2: "", Type_activity: '',
                            selected: 2, edit_ID: '', loading: false
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
                    this.tbLocalCalendars.add({
                        Name_activity, Type_activity, Create_date: firestore.Timestamp.now()
                        , Month1, Month2, Informer_ID: uid, Informer_name: Name
                        , Area_ID, Ban_ID: this.state.selected_ban.ID,
                    }).then((docRef) => {
                        this.setState({
                            Name_activity: "", Month1: "", Month2: "", Type_activity: '',
                            selected: 2, loading: false
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
        } else {
            console.log('ban null')
            this.setState({
                loading: false
            });
        }


    }
    onSearchBan = (ban) => {
        const { query_bans } = this.state;
        const regex = new RegExp(`${ban.trim()}`, 'i');
        const bans = query_bans.filter(ban => ban.Name.search(regex) >= 0)
        this.setState({
            bans,
            ban
        })
    }
    onSelectedBan(Name, ID) {
        this.unsubscribe = this.tbLocalCalendars
            .where('Ban_ID', '==', ID)
            .onSnapshot(this.onCollectionUpdate);
        this.setState({
            selected_ban: { Name, ID },
            selected: 2
        })
    }
    onBack = () => {
        this.props.navigation.navigate(routeName.Main)
    }
    render() {
        const { Month1, Month2, Name_activity, Type_activity, ban, bans, selected_ban } = this.state;

        return (
            <Container style={{ backgroundColor: themeStyle.background }}>
                {isEmptyValue(selected_ban) ? <PDHeader name={'ปฏิทินชุมชน'} backHandler={this.onBack}></PDHeader>
                    : <PDHeader name={'ปฏิทินชุมชน' + selected_ban.Name} backHandler={() => this.setState({ selected_ban: '', selected: 1 })}></PDHeader>}
                <Loading visible={this.state.loading}></Loading>
                <Content contentContainerStyle={{ padding: 15 }}>
                    {this.state.selected === 1 &&
                        <>
                            <Text style={{ fontSize: 24, textAlign: 'center' }}>เลือกหมู่บ้าน</Text>
                            <Item fixedLabel style={{ marginTop: 5 }}>
                                <Label>อปท :</Label>
                                <Input value={ban}
                                    placeholder="ค้นหา อปท"
                                    onChangeText={str => this.onSearchBan(str)} />
                            </Item>
                            {bans.map((element, i) =>
                                <TouchableOpacity style={{
                                    margin: 5, padding: 5, backgroundColor: '#ff80c0'
                                    , borderRadius: 5
                                }} onPress={this.onSelectedBan.bind(this, element.Name, element.ID)}>
                                    <Text style={{ color: "#ffffff", textAlign: "center" }}>{element.Name}</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    }
                    {this.state.selected === 2 &&
                        <>
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
                                        <TouchableOpacity onPress={this.edit.bind(this, element)}>
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
                                        <TouchableOpacity onPress={this.edit.bind(this, element)}>
                                            <Image source={require('../assets/pencil.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.delete.bind(this, element.Key)}>
                                            <Image source={require('../assets/trash_can.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                        </>
                    }
                    {this.state.selected === 3 &&
                        < >
                            <Item fixedLabel >
                                <Label>ชื่อ</Label>
                                <Input value={Name_activity}
                                    onChangeText={str => this.setState({ Name_activity: str })} placeholder="ชื่อ กิจกรรม ประเพณี หรือสิ่งที่ทำ" />
                            </Item>
                            <Item fixedLabel >
                                <Label>ประเภท</Label>
                                <Picker
                                    mode="dropdown"
                                    placeholder="เลือกประเภทกิจกรรม"
                                    iosIcon={<Icon name="down" type="AntDesign"></Icon>}
                                    selectedValue={Type_activity}
                                    onValueChange={str => this.setState({ Type_activity: str })}>
                                    <Picker.Item key="1" label="วัฒนธรรมประเพณี" value="วัฒนธรรมประเพณี" />
                                    <Picker.Item key="2" label="เศรษฐกิจ" value="เศรษฐกิจ" />
                                </Picker>
                            </Item>
                            <Item fixedLabel >
                                <Label>เดือนที่เริ่ม</Label>
                                <Picker
                                    selectedValue={Month1}
                                    onValueChange={str => this.genrateMonth(str, 1)}>
                                    <Picker.Item key="0" label="เลือกเดือนที่เริ่ม" value="" />
                                    {this.state.showMouth1}

                                </Picker>
                            </Item>
                            <Item fixedLabel >
                                <Label>เดือนที่สิ้นสุด</Label>
                                <Picker
                                    selectedValue={Month2}
                                    onValueChange={str => this.genrateMonth(str, 2)}>
                                    <Picker.Item key="0" label="เลือกเดือนที่สิ้นสุด" value="" />
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
                        </>
                    }
                </Content>
                <Footer>
                    <FooterTab style={styles.footer}>
                        <TouchableOpacity onPress={() => this.setState({ selected: 1 })}>
                            <Text style={[{ textAlign: 'center', padding: 5, borderRadius: 10 }
                                , this.state.selected === 1 && { backgroundColor: themeStyle.Color_green }]}>หมู่บ้าน</Text>
                        </TouchableOpacity>
                        {!isEmptyValue(selected_ban.Name) &&
                            <>
                                <TouchableOpacity onPress={() => this.setState({ selected: 2 })}>
                                    <Text style={[{ textAlign: 'center', padding: 5, borderRadius: 10 }
                                        , this.state.selected === 2 && { backgroundColor: themeStyle.Color_green }]}>ปฏิทิน</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ selected: 3 })}>
                                    <Text style={[{ textAlign: 'center', padding: 5, borderRadius: 10 }
                                        , this.state.selected === 3 && { backgroundColor: themeStyle.Color_green }]}>เพิ่มข้อมูล</Text>
                                </TouchableOpacity>
                            </>
                        }

                    </FooterTab>
                </Footer>
            </Container>
        )
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

