import React, { Component } from 'react'
import { View, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/main.styles';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import { Container, Content, Item, Label, Input, Icon, Button, Text, Alert } from 'native-base';
import { isEmptyValue } from '../components/Methods';
import Firebase from '../Firebase';
import firestore from '@react-native-firebase/firestore';
import themeStyle from '../styles/theme.style';
import { routeName } from '../routes/RouteConstant';
import { TableName } from '../database/constan';
import Loading from '../components/Loading';
import PDHeader from '../components/header';
export class PersonsScreen extends Component {
    constructor(props) {
        super(props);
        this.tbSocialMaps = firestore().collection(TableName.Social_maps);
        //getl);
        this.state = {
            loading: false,
            //data
            HName: '', HLastname: '', Haddress: '',
            HAge: '', HCareer: '',
            listLifeStorys: [],

            //data
            status_add: false,
            edit_ID: '',

            //getuser
            ...this.props.fetchReducer.user,

            //select
            selected: 1,
        }

    }
    componentDidMount() {
        this.authListener();
    }
    authListener() {
        if (isEmptyValue(this.state.uid)) {
            this.props.navigation.navigate('Home');
        } else {
            const { Area_ID } = this.state;
            this.unsubscribe = this.tbSocialMaps
                .where('Area_ID', '==', Area_ID)
                .where('Geo_map_type', '==', 'home')
                .where('Important', '==', true)
                .onSnapshot(this.onCollectionUpdate);
        }
    }

    edit(data) {

        const { HName, HLastname, HAddress,
            HAge, HCareer, Geo_map_description, } = data;


        this.setState({
            HName, HLastname, HAddress,
            HAge, HCareer, Geo_map_description, edit_ID: data.Key, selected: 2
        })
    }
    cancelEdit = (e) => {
        this.setState({
            HName: '', HLastname: '', HAddress: '',
            HAge: '', HCareer: '', Geo_map_description: '', edit_ID: ''
            , selected: 1
        })
    }
    onCollectionUpdate = (querySnapshot) => {
        const listLifeStorys = [];
        this.setState({
            loading: true
        })
        querySnapshot.forEach((doc) => {
            const { Informer_name, HAddress, HAge, HCareer,
                Map_image_URL, Geo_map_name, Geo_map_description, HName, HLastname } = doc.data();

            // var temp = parseInt();
            listLifeStorys.push({
                Key: doc.id,
                Map_image_URL,
                HName,
                HLastname,
                HAddress,
                HAge,
                HCareer,
                Geo_map_description,
                Informer_name,
            });

        });

        this.setState({
            listLifeStorys,
            loading: false
        });
    }

    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    goToEdit = (eid, eName) => {
        this.props.navigation.navigate(routeName.PersonHistory, { id: eid, name: eName });
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        })
        const { HName, HLastname, HAddress, HAge,
            HCareer, Geo_map_description, Area_ID, edit_ID, Name, uid } = this.state;
        if (HName === '' || HLastname === '' || HAddress === '' || HAge === '' ||
            HCareer === '' || Geo_map_description === '') {
            Alert.alert('กรุณากรอกข้อมูลให้ครบ');
            this.setState({
                loading: false
            })
        } else {
            this.tbSocialMaps.doc(edit_ID).update({
                Informer_name: Name,
                Geo_ban_ID: Area_ID,
                HName,
                HLastname,
                HAddress,
                HAge,
                HCareer,
                Geo_map_description,
                Informer_ID: uid,
                Update_date: firestore.Timestamp.now(),

            }).then((result) => {
                this.setState({
                    HName: '',
                    HLastname: '',
                    HAddress: '',
                    HAge: '',
                    HCareer: '',
                    Geo_map_description: '',
                    edit_ID: '',
                    selected: 1,
                    loading: false
                })
            }).catch((error) => {
                Alert.alert('บันทึกข้อมูลสำเร็จ');
                this.setState({
                    loading: false
                })
            });
        }

    }
    onBack = () => {
        this.props.navigation.navigate(routeName.Main)
    }
    render() {
        const { HName, HLastname, HAddress,
            HAge, HCareer, Geo_map_description, Ban_name } = this.state;
        return (
            <Container style={{ backgroundColor: themeStyle.background }}>
                <PDHeader name={'บุคคลที่น่าสนใจ'} backHandler={this.onBack}></PDHeader>
                <Loading visible={this.state.loading}></Loading>
                <Content contentContainerStyle={{ padding: 15 }}>

                    {this.state.selected === 1 &&
                        <>
                            <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                                <Text style={{ fontWeight: 'bold', margin: 10, width: '35%', textAlign: 'center' }}>รายการ</Text>
                                <Text style={{ fontWeight: 'bold', margin: 10, width: '25%', textAlign: 'center' }}>ผู้เพิ่มข้อมูล</Text>
                                <Text style={{ fontWeight: 'bold', margin: 10, width: '20%', textAlign: 'center' }}>แก้ไข</Text>
                            </View>
                            {this.state.listLifeStorys.map((element, i) =>
                                <View Key={i} style={{ flexDirection: 'row', }}>
                                    <View style={{ flexDirection: 'column', margin: 10, width: '35%' }}>
                                        <Image source={{ uri: element.Map_image_URL }} style={{ width: 50, height: 50 }}></Image>
                                        <Text>{element.HName} {element.HLastname} </Text>
                                    </View>
                                    <Text style={{ margin: 10, width: '25%', textAlign: 'center' }}>{element.Informer_name}</Text>
                                    <View style={{ width: '20%', justifyContent: 'center', flexDirection: 'column' }}>
                                        {!isEmptyValue(element.HName) &&
                                            <TouchableOpacity onPress={this.goToEdit.bind(this, element.Key, element.HName)}
                                                style={{ flexDirection: 'row', margin: 5 }}>
                                                <Image source={require('../assets/zoom.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                                <Text>ประวัติ</Text>
                                            </TouchableOpacity>
                                        }
                                        <TouchableOpacity onPress={this.edit.bind(this, element)} style={{ flexDirection: 'row', margin: 5 }}>
                                            <Image source={require('../assets/pencil.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                            <Text>แก้ไข</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                            <View style={{ height: 20 }}></View>
                        </>
                    }
                    {this.state.selected === 2 &&
                        <>

                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>เพิ่มข้อมูล</Text>
                            <View style={{ flex: 1, alignItems: 'center', marginBottom: 20 }}>
                                <Item fixedLabel >
                                    <Label>ชื่อจริง<Text style={{ color: 'red' }}>*</Text> :</Label>
                                    <Input value={HName}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 5 }}
                                        placeholder="ชื่อจริง"
                                        onChangeText={str => this.setState({ HName: str })} />
                                </Item>
                                <Item fixedLabel >
                                    <Label>นามสกุล<Text style={{ color: 'red' }}>*</Text> :</Label>
                                    <Input rowSpan={4} value={HLastname}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 5 }}
                                        placeholder="ชื่อจริง"
                                        onChangeText={str => this.setState({ HLastname: str })} />
                                </Item>
                                <Item fixedLabel >
                                    <Label>ที่อยู่<Text style={{ color: 'red' }}>*</Text> :</Label>
                                    <Input rowSpan={4} value={HAddress}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 5 }}
                                        onChangeText={str => this.setState({ HAddress: str })} placeholder="บ้านเลขที่ หมู่บ้าน" />
                                </Item>
                                <Item fixedLabel >
                                    <Label>อายุ<Text style={{ color: 'red' }}>*</Text> :</Label>
                                    <Input value={HAge} keyboardType='numeric'
                                        style={{ backgroundColor: '#ffffff', borderRadius: 5 }}
                                        placeholder="อายุ"
                                        style={{ backgroundColor: '#ffffff', borderRadius: 5 }}
                                        onChangeText={str => this.setState({ HAge: str })} />
                                </Item>
                                <Item fixedLabel >
                                    <Label>อาชีพ<Text style={{ color: 'red' }}>*</Text> :</Label>
                                    <Input value={HCareer}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 5 }}
                                        placeholder="อาชีพ"
                                        style={{ backgroundColor: '#ffffff', borderRadius: 5 }}
                                        onChangeText={str => this.setState({ HCareer: str })} />
                                </Item>
                                <Item fixedLabel >
                                    <Label>บทบาท<Text style={{ color: 'red' }}>*</Text> :</Label>
                                    <Input value={Geo_map_description}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 5 }}
                                        onChangeText={str => this.setState({ Geo_map_description: str })} placeholder="บทบาท ความสัมพันธ์ ในชุมชน" />
                                </Item>
                                <View style={{ flexDirection: 'row' }}>
                                    <Button
                                        success
                                        style={{ margin: 10 }}
                                        onPress={this.onSubmit.bind(this)}>
                                        <Icon name="save" type="AntDesign" />
                                        <Text>บันทึก</Text>
                                    </Button>
                                    <Button
                                        danger
                                        style={{ marginTop: 10 }}
                                        onPress={this.cancelEdit.bind(this)}>
                                        <Icon name="left" type="AntDesign" />
                                        <Text>กลับ</Text>
                                    </Button>
                                </View>
                            </View>
                        </>

                    }
                </Content>
            </Container >
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

export default connect(mapStateToProps, mapDispatchToProps)(PersonsScreen);

