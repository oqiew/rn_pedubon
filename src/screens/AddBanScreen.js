import React, { Component } from 'react'
import Loading from '../components/Loading';
import { View, TouchableOpacity, Image, Alert, ScrollView } from 'react-native'
import styles from '../styles/main.styles';
import { Container, Content, FooterTab, Footer, Item, Label, Input, Picker, Text, Button, Icon, Row, Col } from 'native-base';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import { isEmptyValue } from '../components/Methods';
import firestore from '@react-native-firebase/firestore';
import { TableName } from '../database/constan';
import { routeName } from '../routes/RouteConstant';
import themeStyle from '../styles/theme.style';
import PDHeader from '../components/header';
import { getPixelSizeForLayoutSize } from 'react-native/Libraries/Utilities/PixelRatio';
import { element } from 'prop-types';

export class AddBanScreen extends Component {
    constructor(props) {
        super(props)
        this.tbAreas = firestore().collection(TableName.Areas);
        this.tbBans = firestore().collection(TableName.Bans);
        this.state = {
            loading: false,
            ...this.props.fetchReducer.user,
            status: 'start',
            area: '',
            ban: '',
            bans: [],
            edit: '',
        }
    }
    componentDidMount() {
        this.queryarea()
        this.tbBans.where('Area_ID', '==', this.state.Area_ID).onSnapshot(this.onListBans)
    }
    onListBans = (query) => {
        const bans = [];
        query.forEach(doc => {
            bans.push({
                ID: doc.id,
                ...doc.data()
            })
        });
        this.setState({
            bans
        })
    }
    queryarea = async () => {
        const area = await this.getArea(this.state.Area_ID)
        this.setState({
            area
        })
    }
    onBack = () => {
        this.props.navigation.navigate(routeName.Main)
    }
    _onAdd = () => {
        this.setState({
            status: 'add'
        })
    }
    _onAddban = () => {
        this.setState({
            loading: true
        })

        const { ban, Area_ID, area, status, edit, uid } = this.state;
        if (status === 'add') {
            this.tbBans.add({
                Name: ban,
                Area_ID,
                Province_name: area.Province_name,
                District_name: area.District_name,
                Create_date: firestore.Timestamp.now(),
                Update_date: firestore.Timestamp.now(),
                Create_By_ID: uid
            }).then((result) => {
                this.setState({
                    ban: '',
                    loading: false
                })
            }).catch((error) => {
                console.log('error', error)
                this.setState({
                    loading: false
                })
            })
        } else if (status === 'edit' && !isEmptyValue(edit)) {
            console.log(uid)
            this.tbBans.doc(edit.ID).update({
                Name: ban,
                Area_ID,
                Province_name: area.Province_name,
                District_name: area.District_name,
                Update_date: firestore.Timestamp.now(),
                Create_By_ID: uid
            }).then((result) => {
                this.setState({
                    ban: '',
                    edit: '',
                    loading: false
                })
            }).catch((error) => {
                console.log('error', error)
                this.setState({
                    loading: false
                })
            })
        }

    }
    _onDelete(ID) {
        this.tbBans.doc(ID).delete().then((result) => {
            console.log('delete success', ID)
        }).catch((error) => {
            console.log('can not delete', error)
        })
    }
    getArea = async (Area_ID) => {
        return new Promise((resolve, reject) => {
            this.tbAreas.doc(Area_ID).get().then((doc) => {
                if (doc.exists) {
                    resolve({ ID: doc.id, ...doc.data() })
                } else {
                    reject('')
                }
            })
        })
    }
    render() {
        const { status, area, ban, Role, User_type } = this.state;
        return (
            <Container style={{ backgroundColor: themeStyle.background }}>
                <PDHeader name={'เพิ่มหมู่บ้าน'} backHandler={this.onBack}></PDHeader>
                <Loading visible={this.state.loading}></Loading>
                <Content contentContainerStyle={{ padding: 15, }} >

                    <Text style={{ textAlign: 'center', fontSize: 24 }}>
                        {this.state.area_name}</Text>
                    <Text style={{ textAlign: 'center', fontSize: 24 }}>
                        ({this.state.area_type})</Text>

                    {status === 'start' &&
                        <View>
                            <View style={{ marginTop: 10, justifyContent: 'center', flex: 1, flexDirection: 'row' }}>

                                {(User_type === 'พี่เลี้ยง' || Role === 'admin') && <Button primary onPress={this._onAdd}>
                                    <Text style={{ fontSize: 26 }}>เพิ่ม</Text>
                                </Button>}
                            </View>
                        </View>
                    }
                    {(status === 'add' || status === 'edit') &&
                        <View>
                            <View style={{ marginTop: 10, justifyContent: 'center', flex: 1, flexDirection: 'column' }}>
                                <Text style={{ textAlign: 'center', fontSize: 24 }}>อำเภอ{area.District_name}</Text>
                                <Text style={{ textAlign: 'center', fontSize: 24 }}>จังหวัด{area.Province_name}</Text>
                            </View>
                            <Item fixedLabel style={{ marginTop: 5 }}>
                                <Label>ชื่อ :</Label>
                                <Input value={ban}
                                    placeholder="หมู่บ้าน,ชุมชน"
                                    onChangeText={str => this.setState({ ban: str })} />
                                <Button onPress={this._onAddban}><Text>บันทึก</Text></Button>
                                <Button danger onPress={() => this.setState({ ban: '', edit: '', status: 'start' })}><Text>กลับ</Text></Button>
                            </Item>
                        </View>
                    }
                    <View style={{ borderBottomWidth: 1, margin: 10 }}></View>
                    <ScrollView style={{ marginTop: 10 }}>
                        {(User_type === 'พี่เลี้ยง' || Role === 'admin') ? this.state.bans.map((element, i) =>
                            <TouchableOpacity key={i} style={{
                                flexDirection: "row", borderColor: '#ff9dce', borderWidth: 1,
                                margin: 5, padding: 5, borderRadius: 5,
                            }}>
                                <Row>
                                    <Col>
                                        <Text style={{ textAlign: 'left' }}>{element.Name}</Text>

                                    </Col>
                                    <Col>
                                        <Row style={{ justifyContent: 'space-around' }}>
                                            <TouchableOpacity onPress={() => this.setState({ status: 'edit', edit: element, ban: element.Name })}>
                                                <Text style={{ color: 'green' }}>แก้ไข</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={this._onDelete.bind(this, element.ID)}>
                                                <Text style={{ color: 'red' }}>ลบ</Text>
                                            </TouchableOpacity>
                                        </Row>

                                    </Col>
                                </Row>
                            </TouchableOpacity>
                        ) :
                            this.state.bans.map((element, i) =>
                                <TouchableOpacity key={i} style={{
                                    flexDirection: "row", borderColor: '#ff9dce', borderWidth: 1,
                                    margin: 5, padding: 5, borderRadius: 5,
                                }}>
                                    <Row>
                                        <Col>
                                            <Text style={{ textAlign: 'left' }}>{element.Name}</Text>

                                        </Col>
                                        <Col>

                                        </Col>
                                    </Row>
                                </TouchableOpacity>
                            )
                        }
                    </ScrollView>


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

export default connect(mapStateToProps, mapDispatchToProps)(AddBanScreen);