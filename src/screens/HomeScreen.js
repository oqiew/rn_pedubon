import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { Container, Content, Footer, Text, Icon, Input, Label, Item, Button } from 'native-base';
import Loading from '../components/Loading';
import { fetch_user } from '../actions';
import { connect } from 'react-redux';
import Firebase from '../Firebase'
import data_provinces from '../data/provinces.json';
import styles from '../styles/main.styles';
import { isEmptyValue } from '../components/Methods';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';



class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            //user login
            Email: '',
            Password: '',
            Confirm_password: '',
            pass: true,
            icon: 'eye',
            resetPass: false,
            register: false,
            step: 1
        };

    }

    componentDidMount() {
        this.onStart(this);
    }


    setProfile = (uid, email) => {
        console.log(uid)
        Firebase.firestore().collection('USERS').doc(uid).get().then(doc => {
            if (doc.exists) {
                console.log("set profile")
                const {
                    Province_ID, District_ID, Sub_district_ID, Birthday, Area_PID, Area_DID, Area_SDID, Area_ID
                } = doc.data();
                var Ban_name = '';
                const Province = data_provinces[Province_ID][0];
                const District = data_provinces[Province_ID][1][District_ID][0];
                if (!isEmptyValue(Area_ID)) {
                    Ban_name = data_provinces[Area_PID][1][Area_DID][2][0][Area_SDID][1][0][Area_ID][1];
                }
                const Sub_district = data_provinces[Province_ID][1][District_ID][2][0][Sub_district_ID][0];
                var d1 = new Date(Birthday.seconds * 1000);
                let bd = d1.getDate() + "/" + (parseInt(d1.getMonth(), 10) + 1) + "/" + d1.getFullYear();
                this.props.fetch_user({
                    User_ID: uid, Province, District, Sub_district, bd, Ban_name,
                    ...doc.data(),
                });

                if (!this.props.fetchReducer.isFectching) {
                    this.props.navigation.navigate('Main');
                    console.log('Main');
                    this.setState({
                        loading: false,
                        // page: 'Main'
                    });
                } else {
                    this.setState({
                        loading: false,
                        // page: 'Main'
                    });
                    console.log('error')
                }

            } else {
                this.props.fetch_user({ User_ID: uid, Email: email });
                this.setState({
                    loading: false,
                    // page: 'Profile_edit'
                });
                this.props.navigation.navigate('ProfileEdit');
                console.log('firebase none profile', this.props.fetchReducer.user);

            }
        }).catch(error => {

            this.props.fetch_user({ User_ID: uid, Email: email });
            this.setState({
                loading: false,
                // page: 'Profile_edit'
            });
            this.props.navigation.navigate('ProfileEdit');
            console.log('set profile', this.props.fetchReducer.user);
        });


    }
    hidePass() {
        if (this.state.pass) {
            this.setState({
                icon: 'eye-off',
                pass: false
            })
        } else {
            this.setState({
                icon: 'eye',
                pass: true
            })
        }
    }
    openRegister() {
        this.setState({
            register: true
        })
    }
    onResetPassword = (e) => {
        e.preventDefault();
        Firebase.auth().sendPasswordResetEmail(this.state.Email)
            .then((doc) => {
                this.setState({
                    resetPass: false
                })
                Alert.alert("กรุณาเช็คอีเมลของท่าน");
            })
            .catch(error => {
                Alert.alert("ตั้งรหัสผ่านใหม่ไม่สำเร็จ กรุณากรอกข้อมูลอีเมลให้ถูกต้อง");
            });
    }


    onStart = (e) => {
        console.log('welcome')
        this.setState({
            loading: true,
        });
        Firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setProfile(user.uid, user.email)
                this.setState({
                    loading: false
                })
            } else {
                this.props.fetch_user({});
                this.setState({
                    loading: false,
                });
            }
        })
    }
    onResetPassword = (e) => {
        e.preventDefault();
        auth().sendPasswordResetEmail(this.state.Email)
            .then((doc) => {
                this.setState({
                    step: 1,
                })
                Alert.alert("กรุณาเช็คอีเมลของท่าน");
            })
            .catch(error => {
                Alert.alert("ตั้งรหัสผ่านใหม่ไม่สำเร็จ กรุณากรอกข้อมูลอีเมลให้ถูกต้อง");
            });
    }
    onRegister() {
        console.log("create email")
        this.setState({
            loading: true
        })
        const { Email, Password, Confirm_password } = this.state;
        if (Email !== '' && Password !== '' && Confirm_password !== '') {
            if (Password.length < 8 || Confirm_password.length < 8 || Password.length > 16 || Confirm_password.length > 16) {
                Alert.alert("ความยาวของรหัสผ่านไม่ถูกต้อง");
            } else {
                if (Password !== Confirm_password) {
                    console.log(Password + "=" + Confirm_password);
                    Alert.alert("พาสเวิร์ด ไม่ตรงกัน");
                    this.setState({
                        loading: false,

                    })
                } else {
                    Firebase.auth().createUserWithEmailAndPassword(Email, Password)
                        .then(doc => {
                            Alert.alert("บันทึก อีเมลล์สำเร็จ");
                            this.setState({
                                loading: false,
                                step: 1
                            })
                            this.props.fetch_user({ User_ID: doc.user.uid, Email })
                            console.log('register success')
                            this.props.navigation.navigate('ProfileEdit');
                        }).catch(error => {
                            //can not use email show warnin
                            Alert.alert("บันทึก อีเมลล์ไม่สำเร็จ");
                            this.setState({
                                loading: false
                            })
                        })
                }
            }
        } else {
            Alert.alert("กรอกข้อมูลไม่ครบ บันทึกไม่สำเร็จ");
            this.setState({
                loading: false
            })
        }
    }

    onLoginButtonPress = (e) => {
        e.preventDefault(); .3
        const { Email, Password } = this.state;
        this.setState({ loading: true });
        Firebase.auth().signInWithEmailAndPassword(Email, Password)
            .then((user) => {
                console.log('login success', user.user.uid)
                if (Platform.OS === 'ios') {
                    this.setProfile(user.uid, user.email);
                } else {
                    this.setProfile(user.user.uid, user.user.email);
                }
            })
            .catch((msgError) => {
                this.setState({ loading: false });
                this.props.fetch_user({})
                Alert.alert("can not login", msgError.message);
            });

    }
    render() {

        if (this.state.loading) {
            return <Loading></Loading>;
        } else {
            return (
                <Container>
                    <Content>
                        <View
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 20, }}>
                            <Image
                                source={require('../assets/pedubon.png')}
                                style={{ width: 130, height: 130 }}
                            />
                            <Text style={{ fontSize: 32, textAlign: 'center' }}>
                                โครงการสร้างเสริม{'\n'}สุขภาวะเด็กและเยาวชน
                                {'\n'}จังหวัดอุบลราชธานี</Text>

                            {this.state.step === 1 ?
                                <View style={styles.container}>
                                    <Item floatingLabel style={{ marginTop: 10 }}>
                                        <Icon active name='mail'></Icon>
                                        <Label>email</Label>
                                        <Input onChangeText={str => this.setState({ Email: str })}
                                            value={this.state.Email} />
                                    </Item>
                                    <Item floatingLabel style={{ marginTop: 5 }}>
                                        <Icon active name='lock'></Icon>
                                        <Label>password</Label>
                                        <Input secureTextEntry={this.state.pass} minLegth={4}
                                            value={this.state.Password}
                                            onChangeText={str => this.setState({ Password: str })} />
                                        <Icon name={this.state.icon} onPress={this.hidePass.bind(this)}></Icon>
                                    </Item>

                                    <View>
                                        <Button
                                            success
                                            style={{ margin: 20, padding: 10 }}
                                            onPress={this.onLoginButtonPress.bind(this)}>
                                            {/* <Icon name="colsecircleo" type="AntDesign" /> */}
                                            <Text style={{ color: '#ffffff', fontSize: 24 }}>เข้าสู่ระบบ</Text>
                                        </Button>
                                    </View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => this.setState({ step: 2 })}>
                                            <Text style={{ color: '#0080ff', textAlign: 'center', marginRight: 10, textDecorationLine: 'underline', fontSize: 20 }}>ลืมรหัสผ่าน</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({ step: 3 })}>
                                            <Text style={{ color: '#0080ff', textAlign: 'center', textDecorationLine: 'underline', fontSize: 20 }}>สมัครสมาชิก</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                                : this.state.step === 2 ?

                                    <View style={styles.container}>
                                        <Text style={{ textAlign: 'center', fontSize: 26, color: '#0080ff' }}>รีเซ็ตรหัสผ่าน</Text>
                                        <Item floatingLabel style={{ marginTop: 10 }}>
                                            <Icon active name='mail'></Icon>
                                            <Label>email</Label>
                                            <Input onChangeText={str => this.setState({ Email: str })}
                                                value={this.state.Email}
                                            />
                                        </Item>
                                        <View style={{ flexDirection: 'row', margin: 10 }}>
                                            <TouchableOpacity style={styles.btn_info} onPress={this.onResetPassword.bind(this)}>
                                                <Text style={{ color: '#ffffff', fontSize: 18 }}>ส่งลิ้ง</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.btn_danger} onPress={() => this.setState({ step: 1, Email: '' })}>
                                                <Text style={{ color: '#ffffff', fontSize: 18 }}>ยกเลิก</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    <View style={styles.container}>
                                        <Text style={{ textAlign: 'center', fontSize: 26, color: '#0080ff' }}>สมัครสมาชิก</Text>
                                        <Item floatingLabel style={{ marginTop: 10 }}>
                                            <Icon active name='mail'></Icon>
                                            <Label>email</Label>
                                            <Input onChangeText={str => this.setState({ Email: str })}
                                                value={this.state.Email} />
                                        </Item>
                                        <Item floatingLabel>
                                            <Icon active name='lock'></Icon>
                                            <Label>password</Label>
                                            <Input secureTextEntry={this.state.pass} onChangeText={str => this.setState({ Password: str })} />
                                            <Icon name={this.state.icon} onPress={this.hidePass.bind(this)}></Icon>
                                        </Item>
                                        <Item floatingLabel>
                                            <Icon active name='lock'></Icon>
                                            <Label>Confirm password</Label>
                                            <Input secureTextEntry={this.state.pass} onChangeText={str => this.setState({ Confirm_password: str })} />
                                            <Icon name={this.state.icon} onPress={this.hidePass.bind(this)}></Icon>
                                        </Item>
                                        <View style={{ marginBottom: 10 }}></View>
                                        <View style={{ margin: 10, flexDirection: 'row' }}>
                                            <TouchableOpacity style={styles.btn_info} onPress={this.onRegister.bind(this)}>
                                                <Text style={{ color: '#ffffff', fontSize: 18 }}>สมัคร</Text>
                                            </TouchableOpacity >
                                            <TouchableOpacity style={styles.btn_danger} onPress={() => this.setState({ step: 1, Email: '', Password: '', Confirm_password: '' })}>
                                                <Text style={{ color: '#ffffff', fontSize: 18 }}>ยกเลิก</Text>
                                            </TouchableOpacity >
                                        </View>
                                    </View>
                            }



                        </View>
                    </Content>
                    <Footer style={{ backgroundColor: '#ffffff', height: 'auto' }}>
                        {/* <FooterTab style={{  }}> */}
                        <Image
                            source={require('../assets/sss.png')}
                            style={{ width: 80, height: 80 }}
                        />
                        <Image
                            source={require('../assets/4ctPED.png')}
                            style={{ width: 80, height: 80 }}
                        />
                        <Image
                            source={require('../assets/silc.png')}
                            style={{ width: 70, height: 70 }}
                        />
                    </Footer>
                </Container>
            );
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
