import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, BackHandler } from 'react-native';
import { Container, Content, FooterTab, Footer, Icon, Header, Item, Input, } from 'native-base';
import styles from '../styles/main.styles';
import data_provinces from '../data/provinces.json'
import Loading from '../components/Loading';
import firestore from '@react-native-firebase/firestore';
import { routeName } from '../routes/RouteConstant';
import { TableName } from '../database/constan';
import themeStyle from '../styles/theme.style';
import PDHeader from '../components/header';
export class ListUserScreen extends Component {
    constructor(props) {
        super(props);
        this.tbUsers = firestore().collection(TableName.Users);
        this.state = {
            users: [],
            queryUsers: [],

            //ค้นหา
            searchName: '',
            userType: 'ทั้งหมด',
            loading: false
        }
    }
    componentDidMount() {
        this.unsubscribe = this.tbUsers.onSnapshot(this.getUsers);
    }
    getUsers = (querySnapshot) => {
        this.setState({
            loading: true
        })
        const queryUsers = [];
        let count = 1;
        querySnapshot.forEach(doc => {
            const { Name, Lastname, Nickname,
                Position, Avatar_URL, User_type
            } = doc.data();

            queryUsers.push({
                number: count++,
                Avatar_URL,
                Name: Name + " " + Lastname + "(" + Nickname + ")",
                User_type,
                work: Position,
            });

        });

        this.setState({
            queryUsers,
            users: queryUsers,
            loading: false
        })
    }
    clearSearch() {
        this.setState({ searchName: '', userType: 'ทั้งหมด', users: this.state.queryUsers });
    }
    onSearchUser = (searchName) => {
        const { userType } = this.state;
        let queryUsers = this.state.queryUsers;
        if (userType !== 'ทั้งหมด') {
            queryUsers = this.state.users
        }
        const regex = new RegExp(`${searchName.trim()}`, 'i');
        const users = queryUsers.filter(searchName => searchName.Name.search(regex) >= 0)
        console.log(users)
        this.setState({
            searchName,
            users
        })
    }
    seleteType(name) {
        const { queryUsers } = this.state;
        const regex = new RegExp(`${name.trim()}`, 'i');
        const users = queryUsers.filter(name => name.User_type.search(regex) >= 0)
        this.setState({
            userType: name,
            users
        })
    }
    onBack = () => {
        this.props.navigation.navigate(routeName.Main)
    }
    render() {
        const { users, searchName } = this.state;

        return (
            <Container style={{ backgroundColor: themeStyle.background }}>
                <PDHeader name={'ทำเนียบ'} backHandler={this.onBack}></PDHeader>
                <Loading visible={this.state.loading}></Loading>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-people" />
                        <Input placeholder="ค้นหาชื่อ" value={searchName}
                            onChangeText={str => this.onSearchUser(str)} />
                        <TouchableOpacity onPress={this.clearSearch.bind(this)}>
                            <Icon name="close" />
                        </TouchableOpacity>

                    </Item>
                </Header>
                <Content>
                    <ScrollView>
                        {users.map((element, i) =>
                            <View key={i} style={{ padding: 10, marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Image source={{ uri: element.Avatar_URL }} style={{ width: 50, height: 50, borderRadius: 50, marginRight: 20 }} ></Image>
                                <Text style={{ fontSize: 16, width: 150, marginRight: 5 }}>{element.Name} {'\n'} {element.work}</Text>
                                <Text style={{ fontSize: 16 }}>{element.User_type}</Text>
                            </View>
                        )}

                    </ScrollView>
                </Content>
                <Footer >
                    <FooterTab style={styles.footer}>
                        <TouchableOpacity onPress={this.clearSearch.bind(this)}  >
                            <Text style={[{ color: '#000000', padding: 5, borderRadius: 10 }
                                , this.state.userType === 'ทั้งหมด' && { backgroundColor: themeStyle.Color_green }]}>ทั้งหมด</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.seleteType.bind(this, 'ผู้บริหาร')} >
                            <Text style={[{ color: '#000000', padding: 5, borderRadius: 10 }
                                , this.state.userType === 'ผู้บริหาร' && { backgroundColor: themeStyle.Color_green }]}>ผู้บริหาร</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.seleteType.bind(this, 'พี่เลี้ยง')} >
                            <Text style={[{ color: '#000000', padding: 5, borderRadius: 10 }
                                , this.state.userType === 'พี่เลี้ยง' && { backgroundColor: themeStyle.Color_green }]}>พี่เลี้ยง</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.seleteType.bind(this, 'แกนนำเด็ก')} >
                            <Text style={[{ color: '#000000', padding: 5, borderRadius: 10 }
                                , this.state.userType === 'แกนนำเด็ก' && { backgroundColor: themeStyle.Color_green }]}>แกนนำเด็ก</Text>
                        </TouchableOpacity>
                    </FooterTab>
                </Footer>
                <Footer>
                    <FooterTab style={styles.footer}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Main')}
                        >
                            <Image
                                source={require('../assets/dropdown.png')}
                                style={{ width: 50, height: 50 }}></Image>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('ListUser')}
                        >
                            <Image
                                source={require('../assets/database.png')}
                                style={{ width: 50, height: 50 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Profile')}
                        >
                            <Image
                                source={require('../assets/user.png')}
                                style={{ width: 50, height: 50 }}></Image>
                        </TouchableOpacity>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

export default ListUserScreen
