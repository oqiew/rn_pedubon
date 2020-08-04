import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/main.styles';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import { Container, Content, FooterTab, Footer, Item, Label, Input, Textarea, Form } from 'native-base';
import { isEmptyValue } from '../components/Methods';
import Firebase from '../Firebase';
import firestore from '@react-native-firebase/firestore';

export class PersonsScreen extends Component {
    constructor(props) {
        super(props);
        this.tbUserHome = firestore().collection('SOCIAL_MAPS');
        //getl);
        this.state = {

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
        if (isEmptyValue(this.state.User_ID)) {
            this.props.navigation.navigate('Home');
        } else {
            const { Area_ID, Area_PID, Area_DID, Area_SDID, Name } = this.state;
            this.unsubscribe = this.tbUserHome
                .where('Area_PID', '==', Area_PID).where('Area_DID', '==', Area_DID).where('Area_SDID', '==', Area_SDID)
                .where('Area_ID', '==', Area_ID).where('Geo_map_type', '==', 'home')
                .onSnapshot(this.onCollectionUpdate);
        }
    }
    delete(id) {
        this.tbUserHome.doc(id).get().then((doc) => {
            if (doc.exists) {
                var desertRef = Firebase.storage().refFromURL(doc.data().Map_iamge_URL);
                desertRef.delete().then(function () {
                    this.tbUserHome.doc(id).delete().then(() => {
                        console.log("delete user and image sucess");

                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                }).catch(function (error) {
                    console.log("image No such document! ");
                });
                firestore().collection('PERSON_HISTORYS').where('Person_ID', '==', id).onSnapshot((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        firestore().collection('PERSON_HISTORYS').doc(doc.id).delete().then(() => {
                            console.log("delete child sucess");
                        }).catch((error) => {
                            console.error("Error removing child document: ", error);
                        });
                    })
                })
            } else {
                console.log("user No such document! " + id);
            }

        });


    }
    edit(id) {
        this.tbUserHome.doc(id).get().then((doc) => {
            const { HName, HLastname, HAddress,
                HAge, HCareer, Geo_map_description, } = doc.data();
            if (HName === '' || HLastname === '' || HAddress === '' ||
                HAge === '' || HCareer === '' || HName === undefined || HLastname === undefined || HAddress === undefined ||
                HAge === undefined || HCareer === undefined) {
                this.setState({
                    Geo_map_description, edit_ID: id, selected: 2
                })
            } else {
                console.log('edit')
                this.setState({
                    HName, HLastname, HAddress,
                    HAge, HCareer, Geo_map_description, edit_ID: id, selected: 2
                })
            }


        }).catch((error) => {
            console.error("Error document: ", error);
        });
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

        querySnapshot.forEach((doc) => {
            const { Informer_name, HAddress, HAge, HCareer,
                Map_iamge_URL, Geo_map_name, Geo_map_description, HName, HLastname } = doc.data();

            // var temp = parseInt();
            listLifeStorys.push({
                Key: doc.id,
                Map_iamge_URL,
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
            listLifeStorys
        });
    }

    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);



    }
    goToEdit = (eid, eName) => {
        this.props.navigation.navigate('PersonHistory', { id: eid, name: eName });

    }
    onSubmit = (e) => {
        e.preventDefault();
        const { HName, HLastname, HAddress, HAge,
            HCareer, Geo_map_description, Area_ID, edit_ID, Name, User_ID } = this.state;
        if (HName === '' || HLastname === '' || HAddress === '' || HAge === '' ||
            HCareer === '' || Geo_map_description === '') {
            alert('กรุณากรอกข้อมูลให้ครบ');
        } else {
            this.tbUserHome.doc(edit_ID).update({
                Informer_name: Name,
                Geo_ban_ID: Area_ID,
                HName,
                HLastname,
                HAddress,
                HAge,
                HCareer,
                Geo_map_description,
                Informer_ID: User_ID

            }).then((result) => {
                this.setState({
                    HName: '',
                    HLastname: '',
                    HAddress: '',
                    HAge: '',
                    HCareer: '',
                    Geo_map_description: '',
                    edit_ID: '',
                    selected: 1
                })
            }).catch((error) => {
                alert('บันทึกข้อมูลสำเร็จ');
            });
        }

    }
    render() {
        const { HName, HLastname, HAddress,
            HAge, HCareer, Geo_map_description, Ban_name } = this.state;
        return (
            <Container>
                <Text style={styles.title}>บ้าน {this.state.Ban_name}หมู่ที่{this.state.Area_ID + 1}</Text>

                {this.state.selected === 1 ?
                    <Content style={{ padding: 20 }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                            <Text style={{ fontWeight: 'bold', margin: 10, width: '35%', textAlign: 'center' }}>รายการ</Text>
                            <Text style={{ fontWeight: 'bold', margin: 10, width: '25%', textAlign: 'center' }}>ผู้เพิ่มข้อมูล</Text>
                            <Text style={{ fontWeight: 'bold', margin: 10, width: '20%', textAlign: 'center' }}>แก้ไข</Text>
                        </View>
                        {this.state.listLifeStorys.map((element, i) =>

                            <View Key={i} style={{ flexDirection: 'row', }}>
                                <View style={{ flexDirection: 'column', margin: 10, width: '35%' }}>
                                    <Image source={{ uri: element.Map_iamge_URL }} style={{ width: 50, height: 50 }}></Image>
                                    <Text>{element.HName} {element.HLastname} </Text>
                                </View>
                                <Text style={{ margin: 10, width: '25%', textAlign: 'center' }}>{element.Informer_name}</Text>
                                <View style={{ margin: 10, width: '20%', textAlign: 'center', flexDirection: 'row' }}>
                                    {element.HName !== undefined ?
                                        <TouchableOpacity onPress={this.goToEdit.bind(this, element.Key, element.HName)}>
                                            <Image source={require('../assets/zoom.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                        </TouchableOpacity>
                                        : <View></View>}
                                    <TouchableOpacity onPress={this.edit.bind(this, element.Key)} >
                                        <Image source={require('../assets/pencil.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.delete.bind(this, element.Key)}>
                                        <Image source={require('../assets/trash_can.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        <View style={{ height: 20 }}></View>
                    </Content> : <View></View>
                }
                {this.state.selected === 2 ?
                    <Content style={{ padding: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>เพิ่มข้อมูล</Text>
                        <Item fixedLabel >
                            <Label>ชื่อ :</Label>
                            <Input value={HName}
                                onChangeText={str => this.setState({ HName: str })} />
                        </Item>
                        <Item fixedLabel >
                            <Label>นามสกุล :</Label>
                            <Input rowSpan={4} value={HLastname}
                                onChangeText={str => this.setState({ HLastname: str })} />
                        </Item>
                        <Item fixedLabel >
                            <Label>ที่อยู่ :</Label>
                            <Input rowSpan={4} value={HAddress}
                                onChangeText={str => this.setState({ HAddress: str })} placeholder="บ้านเลขที่ หมู่บ้าน" />
                        </Item>
                        <Item fixedLabel >
                            <Label>อายุ :</Label>
                            <Input value={HAge} keyboardType='numeric'
                                onChangeText={str => this.setState({ HAge: str })} />
                        </Item>
                        <Item fixedLabel >
                            <Label>อาชีพ :</Label>
                            <Input value={HCareer}
                                onChangeText={str => this.setState({ HCareer: str })} />
                        </Item>
                        <Item fixedLabel >
                            <Label>บทบาท:</Label>
                            <Input value={Geo_map_description}
                                onChangeText={str => this.setState({ Geo_map_description: str })} placeholder="บทบาท ความสัมพันธ์ ในชุมชน" />
                        </Item>
                        <View style={{ flex: 1, alignItems: 'center', marginBottom: 50 }}>
                            <TouchableOpacity style={styles.btn_info} onPress={this.onSubmit.bind(this)}>
                                <Text style={styles.btnTxt}>บันทึก</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btn_danger} onPress={this.cancelEdit.bind(this)}>
                                <Text style={styles.btnTxt}>ยกเลิก</Text>
                            </TouchableOpacity>
                        </View>
                    </Content>

                    : <View></View>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(PersonsScreen);

