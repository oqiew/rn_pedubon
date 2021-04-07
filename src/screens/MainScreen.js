import React, { Component } from 'react'
import { Text, TouchableOpacity, Image } from 'react-native'
import { Container, Content, Footer, FooterTab, Grid, Col, Icon } from 'native-base'
import styles from '../styles/main.styles';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import { routeName } from '../routes/RouteConstant';
import themeStyle from '../styles/theme.style';
import firestore from '@react-native-firebase/firestore';
import { TableName } from '../database/constan';
import { isEmptyValue } from '../components/Methods';
import mainStyles from '../styles/main.styles';

export class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.tbAreas = firestore().collection(TableName.Areas);
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
    componentDidMount() {

    }

    render() {
        return (
            <Container style={{ backgroundColor: themeStyle.background }}>
                <Content contentContainerStyle={mainStyles.background}>
                    <Text style={{ textAlign: 'center', fontSize: 24 }}>
                        {this.state.area_name}</Text>
                    <Text style={{ textAlign: 'center', fontSize: 24, color: '#01aeae' }}>
                        {this.state.area_type}</Text>
                    <Grid>
                        <Col style={{ height: 200, padding: 10 }}>
                            <TouchableOpacity
                                style={{ alignItems: 'center', padding: 10, height: 120 }}
                                onPress={() => this.props.navigation.navigate(routeName.Maps)}
                            >
                                <Image
                                    source={require('../assets/maps.png')}
                                    style={{ width: 75, height: 75 }}></Image>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                    แผนที่ทั้งหมด</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ alignItems: 'center', padding: 10, height: 120 }}
                                onPress={() => this.props.navigation.navigate(routeName.LocalCalendar)}
                            >
                                <Image
                                    source={require('../assets/calendar.png')}
                                    style={{ width: 75, height: 75 }}></Image>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                    ปฎิทินชุมชน
                    </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ alignItems: 'center', padding: 10, height: 120 }}
                                onPress={() => this.props.navigation.navigate(routeName.Persons)}
                            >
                                <Image
                                    source={require('../assets/historyuser.png')}
                                    style={{ width: 75, height: 75 }}></Image>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                    ประวัติบุคคล{'\n'}ที่น่าสนใจ
                    </Text>
                            </TouchableOpacity>
                        </Col>
                        <Col style={{ height: 500, padding: 10 }}>
                            <TouchableOpacity
                                style={{ alignItems: 'center', padding: 10, height: 120 }}
                                onPress={() => this.props.navigation.navigate(routeName.SocialMaps)}
                            >
                                <Image
                                    source={require('../assets/gps.png')}
                                    style={{ width: 75, height: 75 }}></Image>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                    แผนที่ชุมชน</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ alignItems: 'center', padding: 10, height: 120 }}
                                onPress={() => this.props.navigation.navigate(routeName.LocalHistory)}
                            >
                                <Image
                                    source={require('../assets/search.png')}
                                    style={{ width: 75, height: 75 }}></Image>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                    ประวัติศาสตตร์{'\n'}ชุมชน
                    </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ alignItems: 'center', padding: 10, height: 120 }}
                                onPress={() => this.props.navigation.navigate(routeName.AddBan)}
                            >
                                <Image
                                    source={require('../assets/list.png')}
                                    style={{ width: 75, height: 75 }}></Image>
                                <Text style={{ fontSize: 16, textAlign: 'center' }}>
                                    เพิ่มหมู่บ้าน{'\n'}
                                </Text>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </Content>
                <Footer>
                    <FooterTab style={styles.footer}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate(routeName.Main)}
                        >
                            <Image
                                source={require('../assets/dropdown.png')}
                                style={{ width: 50, height: 50 }}></Image>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate(routeName.ListUser)}
                        >
                            <Image
                                source={require('../assets/database.png')}
                                style={{ width: 50, height: 50 }}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate(routeName.Profile)}
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

const mapStateToProps = state => ({
    fetchReducer: state.fetchReducer,
});

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);