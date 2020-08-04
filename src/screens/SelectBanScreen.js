import React, { Component } from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import Firebase from '../Firebase';
import styles from '../styles/main.styles';
import { Icon, Input, Label, Item, Picker, Text, Button, Container, Content } from 'native-base';
import data_provinces from '../data/provinces';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import { isEmptyValue } from '../components/Methods';
import firestore from '@react-native-firebase/firestore';
export class SelectBanScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props.fetchReducer.user,
            Provinces: [],
            Districts: [],
            Sub_districts: [],
            Bans: [],


        }
    }
    componentDidMount() {

        if (!isEmptyValue(this.state.User_ID)) {
            if (!isEmptyValue(this.state.Name)) {
                if (!isEmptyValue(this.state.Area_ID)) {
                    this.listProvinces();
                    this.listDistrict(this.state.Area_PID);
                    this.listSub_district(this.state.Area_PID, this.state.Area_DID);
                    this.listBans(this.state.Area_PID, this.state.Area_DID, this.state.Area_SDID);
                } else {
                    this.listProvinces();
                }

            }
        } else {
            this.props.navigation.navigate('Home');
        }
    }
    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);

    }
    listProvinces = () => {
        const Provinces = [];
        data_provinces.forEach((doc, i) => {
            // console.log(doc)
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
            //  console.log(doc)
            Districts.push({
                Key: i,
                value: doc[0]
            })
        })
        if (pid !== '') {
            this.setState({
                Districts,

            })
        } else {
            this.setState({
                Districts,
                Area_DID: '',
                Area_SDID: '',
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
        if (did !== '') {
            this.setState({
                Sub_districts,

            })
        } else {
            this.setState({
                Sub_districts,
                Area_SDID: '',
            })
        }
    }
    listBans = (pid, did, sdid) => {
        const Bans = [];

        data_provinces[pid][1][did][2][0][sdid][1][0].forEach((doc, i) => {


            Bans.push({
                Key: i,
                value: doc[1]
            })
        })
        if (this.state.User_ID !== '') {
            this.setState({
                Bans,

            })
        } else {
            this.setState({
                Bans,
                Area_ID: '',
            })
        }
    }

    onSelectProvince = (e) => {

        if (e === '') {
            this.setState({
                Districts: [],
                Area_DID: '',
                Sub_districts: [],
                Area_SDID: '',
                Bans: [],
                Area_ID: '',
            })
        } else {
            this.setState({
                Area_PID: e
            })
            this.listDistrict(e);
        }
    }
    onSelectDistrict = (e) => {

        if (e === '') {
            this.setState({
                Sub_districts: [],
                Area_SDID: '',
                Bans: [],
                Area_ID: ''
            })
        } else {
            this.setState({
                Area_DID: e
            })
            this.listSub_district(this.state.Area_PID, e);
        }
    }
    onSelectSub_district = (e) => {

        if (e === '') {
            this.setState({
                Bans: [],
                Area_ID: '',
            })
        } else {
            this.setState({
                Area_SDID: e
            })
            this.listBans(this.state.Area_PID, this.state.Area_DID, e);
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        const { User_ID, Name, Last_name, Nickname, Sex, Phone_number, Province, District, Sub_district, User_type, bd,
            Line_ID, Facebook, Birthday, Position, Department,
            Province_ID, District_ID, Sub_district_ID, Email, Avatar_URL,
            Area_ID, Role, Area_PID, Area_DID, Area_SDID, } = this.state;
        const Ban_name = data_provinces[Area_PID][1][Area_DID][2][0][Area_SDID][1][0][Area_ID][1];

        firestore().collection('USERS').doc(this.state.User_ID).update({
            Area_ID, Area_PID, Area_DID, Area_SDID
        }).then((doc) => {
            this.props.fetch_user({
                User_ID, Name, Last_name, Nickname, Sex, Phone_number, Province, District, Sub_district, User_type, bd,
                Line_ID, Facebook, Birthday, Position, Department, Ban_name,
                Province_ID, District_ID, Sub_district_ID, Email, Avatar_URL,
                Area_ID, Role, Area_PID, Area_DID, Area_SDID
            });
            this.setState({
                Ban_name
            })
            Alert.alert("บันทึกสำเร็จ");

        }).catch((error) => {
            console.log(error)
            Alert.alert("บันทึกไม่สำเร็จ");

        })

    }

    render() {
        const { Provinces, Districts, Sub_districts, Bans } = this.state;
        const { Area_ID, User_ID, Area_PID, Area_DID, Area_SDID, Ban_name } = this.state;
        return (
            <Container>
                <Content>
                    <View style={styles.container}>
                        <Text style={{ textAlign: 'center', margin: 20, fontSize: 30, color: '#0080ff' }}>เลือกหมู่บ้าน</Text>
                        <Item fixedLabel>
                            <Label>จังหวัด :</Label>
                            <Picker
                                selectedValue={parseInt(Area_PID, 10)}
                                style={{ height: 50, width: 200 }}
                                onValueChange={this.onSelectProvince.bind(this)}>
                                <Picker.Item key="0" label="เลือกจังหวัด" value="" />
                                {Provinces.map((data, i) =>
                                    <Picker.Item key={i + 1} label={data.value} value={data.Key} />
                                )}

                            </Picker>
                        </Item>
                        <Item fixedLabel>
                            <Label>อำเภอ :</Label>
                            <Picker
                                selectedValue={parseInt(Area_DID, 10)}
                                style={{ height: 50, width: 200 }}
                                onValueChange={this.onSelectDistrict.bind(this)}>
                                <Picker.Item key="0" label="เลือกอำเภอ" value="" />
                                {Districts.map((data, i) =>
                                    <Picker.Item key={i + 1} label={data.value} value={data.Key} />
                                )}
                            </Picker>
                        </Item>

                        <Item fixedLabel>
                            <Label>ตำบล :</Label>
                            <Picker
                                selectedValue={parseInt(Area_SDID, 10)}
                                style={{ height: 50, width: 200 }}
                                onValueChange={this.onSelectSub_district.bind(this)}>
                                <Picker.Item key="0" label="เลือกตำบล" value="" />
                                {Sub_districts.map((data, i) =>
                                    <Picker.Item key={i + 1} label={data.value} value={data.Key} />
                                )}
                            </Picker>
                        </Item>
                        <Item fixedLabel>
                            <Label>บ้าน :</Label>
                            <Picker
                                selectedValue={parseInt(Area_ID, 10)}
                                style={{ height: 50, width: 200 }}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({ Area_ID: itemValue })
                                }>
                                <Picker.Item key="0" label="เลือกบ้าน" value="" />
                                {Bans.map((data, i) =>
                                    <Picker.Item key={i + 1} label={data.value + " หมู่ที่" + (i + 1)} value={data.Key} />
                                )}
                            </Picker>
                        </Item>

                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                            <Button success style={{ margin: 10 }} onPress={this.onSubmit.bind(this)}>
                                <Icon name='save' type="AntDesign" />
                                <Text>บันทึกข้อมูล</Text></Button>
                            <Button danger style={{ margin: 10, }} onPress={() => this.props.navigation.goBack()}>
                                <Icon name='left' type="AntDesign" />
                                <Text>กลับ</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectBanScreen);
