import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { Container, Content, Footer, FooterTab, Grid, Col, Icon } from 'native-base'
import styles from '../styles/main.styles';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import Loading from '../components/Loading';
import { isEmptyValue } from '../components/Methods';


export class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {

            loading: false,
            ...this.props.fetchReducer.user,
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            ...nextProps.fetchReducer.user
        })
    }
    render() {
        if (this.state.loading) {
            return <Loading></Loading>;
        } else {
            return (
                <Container>

                    <Content>
                        <View style={{ margin: 10 }}>
                            {!isEmptyValue(this.state.Ban_name) ?
                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', }}>
                                    <Text style={{ textAlign: 'center', fontSize: 18 }}>
                                        {this.state.Ban_name} หมู่ที่ {this.state.Area_ID + 1}
                                    </Text>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('SelectBan')}>
                                        <Icon name='edit' type="AntDesign" />
                                    </TouchableOpacity>
                                </View>
                                : <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 50 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 24 }}>
                                        คุณยังไม่ได้เลือกหมู่บ้าน
                                    </Text>
                                    <TouchableOpacity
                                        style={{ marginTop: 20 }}
                                        onPress={() => this.props.navigation.navigate('SelectBan')}>
                                        <Icon name='edit' style={{ fontSize: 50 }} type="AntDesign" />
                                    </TouchableOpacity>
                                </View>}
                        </View>


                        {!isEmptyValue(this.state.Area_ID) &&
                            <Grid>

                                <Col style={{ height: 200, padding: 10 }}>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 10 }}
                                        onPress={() => this.props.navigation.navigate('Maps')}
                                    >
                                        <Image
                                            source={require('../assets/maps.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            แผนที่ทั้งหมด</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 10 }}
                                        onPress={() => this.props.navigation.navigate('LocalCalendar')}
                                    >
                                        <Image
                                            source={require('../assets/calendar.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            ปฎิทินชุมชน
                    </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 10 }}
                                        onPress={() => this.props.navigation.navigate('Persons')}
                                    >
                                        <Image
                                            source={require('../assets/historyuser.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            ประวัติบุคคล{'\n'}ที่น่าสนใจ
                    </Text>
                                    </TouchableOpacity>
                                </Col>
                                <Col style={{ height: 200, padding: 10 }}>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 10 }}
                                        onPress={() => this.props.navigation.navigate('SocialMaps')}
                                    >
                                        <Image
                                            source={require('../assets/gps.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            แผนที่ชุมชน</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ alignItems: 'center', padding: 10 }}
                                        onPress={() => this.props.navigation.navigate('LocalHistory')}
                                    >
                                        <Image
                                            source={require('../assets/search.png')}
                                            style={{ width: 75, height: 75 }}></Image>
                                        <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                            ประวัติศาสตตร์{'\n'}ชุมชน
                    </Text>
                                    </TouchableOpacity>
                                </Col>
                            </Grid>}
                    </Content>
                    <Footer>
                        <FooterTab style={styles.footer}>

                            <TouchableOpacity
                                style={{ alignItems: 'center' }}
                                onPress={() => this.props.navigation.navigate('Main')}
                            >
                                <Image
                                    source={require('../assets/dropdown.png')}
                                    style={{ width: 50, height: 50 }}></Image>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ alignItems: 'center' }}
                                onPress={() => this.props.navigation.navigate('ListUser')}
                            >
                                <Image
                                    source={require('../assets/database.png')}
                                    style={{ width: 50, height: 50 }}></Image>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ alignItems: 'center', marginRight: 10 }}
                                onPress={() => this.props.navigation.navigate('Profile')}
                            >
                                <Image
                                    source={require('../assets/user.png')}
                                    style={{ width: 50, height: 50 }}></Image>
                            </TouchableOpacity>
                        </FooterTab>
                    </Footer>
                </Container >
            )
        }

    }
}

const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer,
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);