import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, BackHandler } from 'react-native';
import { Container, Content, FooterTab, Footer, Icon, Header, Item, Input, } from 'native-base';
import firebase from '../../../Firebase';
import styles from '../../styles/main.styles';
import Loading from '../Loading';
import data_provinces from '../../data/provinces.json'
export class List_users extends Component {
    constructor(props) {
        super(props);
        this.tbUsers = firebase.firestore().collection('USERS');
        this.state = {
            //get name form id
            Province: '', District: '', Tumbon: '', User_type: '',

            Provinces: [],
            Districts: [],
            Tumbons: [],
            List_users: [],

            //ค้นหา
            search_name: '',

            loading: false


        }
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.back();
            return true;
        })
    }
    componentDidMount() {
        this.unsubscribe = this.tbUsers.onSnapshot(this.getUsers);
    }

    getUsers = (querySnapshot) => {

        const List_users = [];
        let count = 1;
        querySnapshot.forEach(doc => {
            const { Name, Last_name, Nickname,
                Position, Department, Province_ID,
                District_ID, Sub_district_ID, Avatar_URL, User_type
            } = doc.data();

            const Province = data_provinces[Province_ID][0];
            const District = data_provinces[Province_ID][1][District_ID][0];
            const Sub_district = data_provinces[Province_ID][1][District_ID][2][0][Sub_district_ID][0];
            // var d1 = new Date(Birthday.seconds * 1000);
            // let bd = d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();    
            List_users.push({
                number: count++,
                Avatar_URL,
                Name: Name + " " + Last_name + "(" + Nickname + ")",
                User_type,
                work: Position + ":" + Department,
                District, Sub_district,
            });

        });

        this.setState({
            List_users,
            loading: false
        })
    }
    clearSearch() {
        this.setState({ search_name: '' });
        this.unsubscribe = this.tbUsers.onSnapshot(this.getUsers);
    }
    searchuser() {
        if (this.state.search_name !== '') {
            this.unsubscribe = this.tbUsers
                .where('Name', '==', this.state.search_name)
                .onSnapshot(this.getUsers);
        }
    }
    seleteType(name) {
        this.unsubscribe = this.tbUsers
            .where('User_type', '==', name)
            .onSnapshot(this.getUsers);
    }
    render() {
        const { List_users, } = this.state;
        if (this.state.loading) {
            return (<Loading></Loading>)
        } else {
            return (
                <Container>
                    <Header searchBar rounded>
                        <Item>
                            <Icon name="ios-people" />
                            <Input placeholder="ค้นหาชื่อ" value={this.state.search_name} onChangeText={str => this.setState({ search_name: str })} />
                            <TouchableOpacity onPress={this.clearSearch.bind(this)}>
                                <Icon name="close" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.searchuser.bind(this)}>
                                <Icon name="ios-search" />
                            </TouchableOpacity>

                        </Item>
                    </Header>
                    <Content>
                        <ScrollView>
                            {List_users.map((element, i) =>
                                <View key={i} style={{ padding: 10, marginLeft: 10, marginRight: 10, flexDirection: 'row' }}>
                                    <Image source={{ uri: element.Avatar_URL }} style={{ width: 50, height: 50, borderRadius: 50, marginRight: 20 }} ></Image>
                                    <Text style={{ fontSize: 16, width: 150, marginRight: 5 }}>{element.Name} {'\n'} {element.work}</Text>
                                    <Text style={{ fontSize: 16 }}>{element.User_type}</Text>
                                </View>
                            )}

                        </ScrollView>
                    </Content>
                    <Footer >
                        <FooterTab >
                            <TouchableOpacity onPress={this.clearSearch.bind(this)} style={{ alignItems: 'center', justifyContent: 'center', padding: 5 ,marginLeft:10}} >
                                <Text style={{ color: '#ffffff' }}>ทั้งหมด</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.seleteType.bind(this, 'ผู้บริหาร')} style={{ alignItes: 'center', justifyContent: 'center', padding: 5 }} >
                                <Text style={{ color: '#ffffff' }}>ผู้บริหาร</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.seleteType.bind(this, 'พี่เลี้ยง')} style={{ alignItes: 'center', justifyContent: 'center', padding: 5 }} >
                                <Text style={{ color: '#ffffff' }}>พี่เลี้ยง</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.seleteType.bind(this, 'แกนนำเด็ก')} style={{ alignItes: 'center', justifyContent: 'center', padding: 5,marginRight:10 }} >
                                <Text style={{ color: '#ffffff' }}>แกนนำเด็ก</Text>
                            </TouchableOpacity>
                        </FooterTab>
                    </Footer>
                </Container>
            )
        }

    }
}

export default List_users
