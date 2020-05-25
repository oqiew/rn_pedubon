import React, { Component } from 'react'
import { View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import Firebase from '../../../Firebase';
import Timeline from 'react-native-timeline-flatlist'
import Idelete from '../../assets/trash_can.png';
import Iedit from '../../assets/pencil.png';
import styles from '../../styles/main.styles';
import { fetch_user } from '../../actions';
import { connect } from 'react-redux';
import { isEmptyValue } from '../Methods';
import { Container, Content, FooterTab, Footer, Item, Label, Input, Textarea, Form, Text, Button, Icon } from 'native-base';

export class Local_historys extends Component {
    constructor(props) {
        super(props);
        this.tbLocalHistory = Firebase.firestore().collection('LOCAL_HISTORYS');
        //getl);
        this.state = {
            dataTimeline: [],
            localHistorys: [],
            statusSave: "",

            listYear: [],
            //data
            Name_activity: "",
            Description: "",
            Year_start: "",

            //data
            status_add: false,
            Ban_name: '',
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
            this.props.navigation.navigate('Login');
        } else {
            const { Area_ID, Area_PID, Area_DID, Area_SDID, Name } = this.state;
            this.unsubscribe = this.tbLocalHistory
                .where('Area_PID', '==', Area_PID).where('Area_DID', '==', Area_DID).where('Area_SDID', '==', Area_SDID)
                .where('Area_ID', '==', Area_ID)
                .onSnapshot(this.onCollectionUpdate);
        }


    }


    delete(id) {
        Firebase.firestore().collection('LOCAL_HISTORYS').doc(id).delete().then(() => {
            console.log("Document successfully deleted!");

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    edit(id) {
        Firebase.firestore().collection('LOCAL_HISTORYS').doc(id).get().then((doc) => {
            const { Name_activity, Description, Year_start } = doc.data();
            this.setState({
                Name_activity, Description, Year_start, edit_ID: id, selected: 3
            })

        }).catch((error) => {
            console.error("Error document: ", error);
        });
    }
    cancelEdit = (e) => {
        this.setState({
            Name_activity: '', Description: '', Year_start: '', edit_ID: ''
        })
    }
    onCollectionUpdate = (querySnapshot) => {

        const dataTimeline = [];
        const localHistorys = [];
        var count = 1;

        querySnapshot.forEach((doc) => {
            const { Name_activity, Year_start, Description, Informer_name } = doc.data();

            localHistorys.push({
                Key: doc.id,
                Name_activity, Description, Year_start, Informer_name,
            });



            count++;
        });

        this.setState({
            localHistorys
        });
        this.sortBy('Year_start');
        //sort show timeline
        var listYear = ["0"];
        count = 0;
        // console.log(this.state.localHistorys);
        this.state.localHistorys.forEach(element => {
            var temp = false;
            listYear.forEach(e => {
                if (e === element.Year_start) {
                    temp = false;
                } else {
                    listYear.push(element.Year_start);
                    temp = true;
                    return;
                }
            });

            if (temp) {
                dataTimeline.push(
                    { time: element.Year_start, title: element.Name_activity, description: element.Description });
            } else {
                dataTimeline.push(
                    { time: '', title: element.Name_activity, description: element.Description });
            }

        });

        this.setState({
            dataTimeline
        });

    }
    compareBy(key) {
        return function (a, b) {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        };
    }

    sortBy(key) {
        let arrayCopy = [...this.state.localHistorys];
        arrayCopy.sort(this.compareBy(key));
        this.setState({ localHistorys: arrayCopy });
    }


    onChange = (e) => {
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);



    }

    onSubmit = e => {
        e.preventDefault()
        const { Name_activity, Description, Year_start, Area_ID, Area_PID, Area_DID, Area_SDID, Name, User_ID, edit_ID } = this.state;
        if (Year_start.length < 4) {
            Alert.alert('บันทึกไม่สำเร็จ ปีไม่ถูกต้อง');

        } else if (Name_activity === '' || Description === '' || Year_start === '') {
            Alert.alert('บันทึกไม่สำเร็จ กรุณากรอกข้อมูลให้ครบ');

        } else {
            if (edit_ID !== '') {
                this.tbLocalHistory.doc(edit_ID).set({
                    Name_activity, Description
                    , Year_start, Informer_ID: User_ID, Informer_name: Name
                    , Area_ID, Area_PID, Area_DID, Area_SDID,
                }).then((docRef) => {
                    Alert.alert('บันทึกข้อมูลสำเร็จ');
                    this.setState({
                        Name_activity: "", Year_start: "", Description: "", edit_ID: '',
                        selected: 1,
                    });

                })
                    .catch((error) => {
                        Alert.alert('บันทึกข้อมูลไม่สำเร็จ');
                        console.error("Error adding document: ", error);
                    });
            } else {
                this.tbLocalHistory.add({
                    Name_activity, Description
                    , Year_start, Informer_ID: User_ID, Informer_name: Name
                    , Area_ID, Area_PID, Area_DID, Area_SDID,
                }).then((docRef) => {
                    Alert.alert('บันทึกมูลสำเร็จ');
                    this.setState({
                        Name_activity: "", Year_start: "", Description: "",
                        selected: 1,
                    });

                })
                    .catch((error) => {
                        Alert.alert('บันทึกมูลไม่สำเร็จ');
                        console.error("Error adding document: ", error);
                    });
            }
        }





    }
    render() {
        const { Name_activity, Description, Year_start } = this.state;

        return (
            <Container>
                <Text style={styles.title}>บ้าน {this.state.Ban_name}หมู่ที่{this.state.Area_ID + 1}</Text>
                {this.state.selected === 1 ?
                    <Timeline
                        lineColor='rgb(45,156,219)'
                        timeStyle={{ color: 'red', }}
                        descriptionStyle={{ color: 'gray' }}
                        data={this.state.dataTimeline}
                    /> : <View></View>
                }
                {this.state.selected === 2 ?
                    <Content style={{ padding: 20 }}>
                        <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 1 }}>
                            <Text style={{ fontWeight: 'bold', margin: 10, width: '35%', textAlign: 'center' }}>รายการ</Text>
                            <Text style={{ fontWeight: 'bold', margin: 10, width: '25%', textAlign: 'center' }}>ผู้เพิ่มข้อมูล</Text>
                            <Text style={{ fontWeight: 'bold', margin: 10, width: '20%', textAlign: 'center' }}>แก้ไข</Text>
                        </View>
                        {this.state.localHistorys.map((element) =>

                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ flexDirection: 'column', margin: 10, width: '35%' }}>
                                    <Text style={{ color: 'red' }}>
                                        {element.Year_start}
                                    </Text>
                                    <Text>{element.Name_activity} {element.Description}</Text>
                                </View>
                                <Text style={{ margin: 10, width: '25%', textAlign: 'center' }}>{element.Informer_name}</Text>
                                <View style={{ margin: 10, width: '20%', textAlign: 'center', flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={this.edit.bind(this, element.Key)}>
                                        <Image source={require('../../assets/pencil.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.delete.bind(this, element.Key)}>
                                        <Image source={require('../../assets/trash_can.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>


                        )}
                        <View style={{ height: 20 }}></View>
                    </Content> : <View></View>
                }
                {this.state.selected === 3 ?
                    <Content style={{ padding: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>เพิ่มข้อมูล</Text>
                        <Item fixedLabel >
                            <Input value={Name_activity}
                                onChangeText={str => this.setState({ Name_activity: str })} placeholder="ชื่อหัวข้อ เหตุการณ์ หรือกิจกรรม" />
                        </Item>
                        <Item fixedLabel >
                            <Textarea rowSpan={4} value={Description}
                                onChangeText={str => this.setState({ Description: str })} placeholder="คำอธิบาย เหตุการณ์ หรือกิจกรรมที่เกิดขึ้นกับชุมชน" />
                        </Item>
                        <Item fixedLabel >
                            <Input value={Year_start} maxLength={4} onChangeText={str => this.setState({ Year_start: str })} placeholder="ปีที่เริ่ม พ.ศ." />
                        </Item>
                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                            <Button success style={{ margin: 10 }} onPress={this.onSubmit.bind(this)}>
                                <Icon name='save' type="AntDesign" />
                                <Text>บันทึก</Text></Button>
                            <Button danger style={{ margin: 10 }} onPress={() => this.setState({ Name_activity: '', Description: '', Year_start: '', selected: 1, edit_ID: '' })}>
                                <Icon name='left' type="AntDesign" />
                                <Text>กลับ</Text></Button>
                        </View>

                    </Content>

                    : <View></View>
                }
                <Footer>
                    <FooterTab style={styles.footer}>
                        <TouchableOpacity onPress={() => this.setState({ selected: 1 })}>
                            <Text style={{ textAlign: 'center', marginLeft: 30 }}>Timeline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ selected: 2 })}>
                            <Text style={{ textAlign: 'center' }}>ตารางข้อมูล</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ selected: 3 })}>
                            <Text style={{ textAlign: 'center', marginRight: 30 }}>เพิ่มข้อมูล</Text>
                        </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(Local_historys);
