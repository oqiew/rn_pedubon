import React, { Component } from 'react'
import { View, TouchableOpacity, Image, Alert } from 'react-native'
import Timeline from 'react-native-timeline-flatlist'
import styles from '../styles/main.styles';
import { Container, Content, FooterTab, Footer, Item, Label, Input, Textarea, Form, Text, Icon, Button } from 'native-base';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import { isEmptyValue } from '../components/Methods';
import firestore from '@react-native-firebase/firestore';
import { TableName } from '../database/constan';
import { routeName } from '../routes/RouteConstant';
import themeStyle from '../styles/theme.style';
import Loading from '../components/Loading';
import PDHeader from '../components/header';
export class PersonHistoryScreen extends Component {
    constructor(props) {
        super(props);

        this.tbPersonHistorys = firestore()
            .collection(TableName.Social_maps).doc(this.props.route.params.id)
            .collection(TableName.Person_historys);
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

            edit_ID: '',

            //getuser
            ...this.props.fetchReducer.user,

            //select
            selected: 1,
            loading: false

        }

    }
    componentDidMount() {
        this.authListener();
    }
    authListener() {
        if (isEmptyValue(this.state.uid)) {
            this.props.navigation.navigate(routeName.Home);
        } else {
            this.tbPersonHistorys.onSnapshot(this.onCollectionUpdate);
        }
    }
    delete(id) {
        this.tbPersonHistorys.doc(id).delete().then(() => {
            console.log("Document successfully deleted!");

        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    edit(data) {
        const { Name_activity, Description, Year_start } = data;
        this.setState({
            Name_activity, Description, Year_start, edit_ID: data.Key, selected: 3
        })

    }
    cancelEdit = (e) => {
        this.setState({
            Name_activity: '', Description: '', Year_start: '', edit_ID: ''
        })
    }
    onCollectionUpdate = (querySnapshot) => {
        this.setState({
            loading: true
        })
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
            dataTimeline,
            loading: false
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
        e.preventDefault();
        this.setState({
            loading: true
        })
        const Person_ID = this.props.route.params.id;

        const { Name_activity, Description, Year_start, Name, uid, edit_ID } = this.state;
        if (Year_start.length < 4) {
            Alert.alert('บันทึกไม่สำเร็จ ปีไม่ถูกต้อง');
            this.setState({
                loading: false
            })

        } else if (Name_activity === '' || Description === '' || Year_start === '') {
            Alert.alert('บันทึกไม่สำเร็จ กรุณากรอกข้อมูลให้ครบ');
            this.setState({
                loading: false
            })
        } else {
            if (!isEmptyValue(edit_ID)) {
                this.tbPersonHistorys.doc(edit_ID).set({
                    Name_activity, Description
                    , Year_start, Informer_ID: uid, Informer_name: Name
                    , Person_ID
                }).then((docRef) => {
                    Alert.alert('บันทึกข้อมูลสำเร็จ');
                    this.setState({
                        Name_activity: "", Year_start: "", Description: "", edit_ID: '',
                        selected: 1, loading: false
                    });


                }).catch((error) => {
                    Alert.alert('บันทึกข้อมูลไม่สำเร็จ');
                    console.error("Error adding document: ", error);
                    this.setState({
                        loading: false
                    })
                });
            } else {
                this.tbPersonHistorys.add({
                    Name_activity, Description
                    , Year_start, Informer_ID: uid, Informer_name: Name
                    , Person_ID
                }).then((docRef) => {
                    Alert.alert('บันทึกมูลสำเร็จ');
                    this.setState({
                        Name_activity: "", Year_start: "", Description: "",
                        selected: 1, loading: false
                    });

                }).catch((error) => {
                    Alert.alert('บันทึกมูลไม่สำเร็จ');
                    console.error("Error adding document: ", error);
                    this.setState({
                        loading: false
                    })
                });
            }
        }
    }
    onBack = () => {
        this.props.navigation.navigate(routeName.Persons)
    }
    render() {
        const { Name_activity, Description, Year_start, dataTimeline } = this.state;
        return (
            <Container style={{ backgroundColor: themeStyle.background }}>
                <Loading visible={this.state.loading}></Loading>
                <PDHeader name={"ประวัติชีวิต" + this.props.route.params.name} backHandler={this.onBack}></PDHeader>

                {this.state.selected === 1 &&
                    (dataTimeline.length === 0 ?
                        <Content contentContainerStyle={{ padding: 15 }}>
                            <Text style={{ textAlign: "center" }}>ยังไม่มีข้อมูล</Text>
                        </Content>
                        :
                        <Timeline
                            style={{ padding: 15 }}
                            lineColor='rgb(45,156,219)'
                            timeStyle={{ color: 'red', }}
                            descriptionStyle={{ color: 'gray' }}
                            data={dataTimeline}
                        />)
                }
                {this.state.selected === 2 &&
                    <Content contentContainerStyle={{ padding: 15 }} >
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
                                    <TouchableOpacity onPress={this.edit.bind(this, element)}>
                                        <Image source={require('../assets/pencil.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.delete.bind(this, element.Key)}>
                                        <Image source={require('../assets/trash_can.png')} style={{ width: 25, height: 25, justifyContent: 'center' }}></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>


                        )}
                        <View style={{ height: 20 }}></View>
                    </Content>
                }
                {this.state.selected === 3 &&
                    <Content contentContainerStyle={{ padding: 15 }}>
                        <Item fixedLabel >
                            <Label>ชื่อเหตุการณ์ :</Label>
                            <Input value={Name_activity}
                                style={{ backgroundColor: '#ffffff', borderRadius: 5 }}
                                onChangeText={str => this.setState({ Name_activity: str })} placeholder="ชื่อหัวข้อ เหตุการณ์ หรือกิจกรรม" />
                        </Item>
                        <Item stackedLabel >
                            <Label>คำอธิบาย :</Label>
                            <Textarea rowSpan={4} value={Description} style={{ backgroundColor: '#ffffff', borderRadius: 5, fontSize: 16, minWidth: '100%', maxWidth: '100%' }}
                                onChangeText={str => this.setState({ Description: str })} placeholder="คำอธิบาย เหตุการณ์ หรือกิจกรรมที่เกิดขึ้นกับชุมชน" />
                        </Item>
                        <Item fixedLabel >
                            <Label>ปีที่เริ่ม :</Label>
                            <Input value={Year_start} maxLength={4}
                                style={{ backgroundColor: '#ffffff', borderRadius: 5 }}
                                keyboardType={"number-pad"}
                                onChangeText={str => this.setState({ Year_start: str })} placeholder="ปีที่เริ่ม พ.ศ." />
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

                }

                <Footer>
                    <FooterTab style={styles.footer}>
                        <TouchableOpacity onPress={() => this.setState({ selected: 1 })}>
                            <Text style={[{ textAlign: 'center', padding: 5, borderRadius: 10 }
                                , this.state.selected === 1 && { backgroundColor: themeStyle.Color_green }]}>Timeline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ selected: 2 })}>
                            <Text style={[{ textAlign: 'center', padding: 5, borderRadius: 10 }
                                , this.state.selected === 2 && { backgroundColor: themeStyle.Color_green }]}>ตารางข้อมูล</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ selected: 3 })}>
                            <Text style={[{ textAlign: 'center', padding: 5, borderRadius: 10 }
                                , this.state.selected === 3 && { backgroundColor: themeStyle.Color_green }]}>เพิ่มข้อมูล</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(PersonHistoryScreen);