import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Icon, Input, Label, Item, Button } from 'native-base';
import Loading from '../Loading';
import styles from '../../styles/main.styles';
import Firebase from '../../../Firebase';
import { fetch_user } from '../../actions';
import { connect } from 'react-redux';
import data_provinces from '../../data/provinces.json'
import { isEmptyValue } from '../Methods';
export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            Password: '',
            Confirm_password: '',
            pass: true,
            icon: 'eye',
            loading: false,
            resetPass: false,
            register: false,
        }

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
    onLoginButtonPress = (e) => {
        e.preventDefault(); .3
        const { Email, Password } = this.state;
        console.log('start login')
        this.setState({ loading: true });
        Firebase.auth().signInWithEmailAndPassword(Email, Password)
            .then((user) => {
                Firebase.firestore().collection('USERS').where("Email", "==", Email).get().then((querySnapshot) => {
                    if (querySnapshot.size === 0) {
                        this.setState({
                            loading: false
                        });
                        console.log('login to Profile_edit');
                        this.props.fetch_user({ User_ID: user.uid });
                        this.props.navigation.navigate('Profile_edit');
                    } else {
                        this.setState({
                            loading: false
                        });
                        console.log('login to main');
                        querySnapshot.forEach((doc) => {

                            const { Province_ID, Sub_district_ID, District_ID, Area_PID, Area_DID, Area_ID, Area_SDID, Birthday } = doc.data();
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
                                User_ID: user.uid, Province, District, Sub_district, bd, Ban_name,
                                ...doc.data(),
                            });
                        })
                        this.props.navigation.navigate('Home');
                    }
                }
                );
            })
            .catch((msgError) => {
                this.setState({ loading: false });
                Alert.alert(msgError.message);
            });

    }

    componentDidMount() {

        // const { navigation } = this.props;
        // this.focusListener = navigation.addListener('willFocus', () => {
        //     Firebase.auth().onAuthStateChanged((user) => {
        //         if (user) {
        //             Firebase.firestore().collection('USERS').where("Email", "==", user.email).get().then((querySnapshot) => {
        //                 if (querySnapshot.size === 0) {
        //                     this.setState({
        //                         loading: false
        //                     });
        //                     this.props.navigation.navigate('Profile_edit');
        //                 } else {
        //                     this.setState({
        //                         loading: false
        //                     });
        //                     this.props.navigation.navigate('Home');
        //                 }
        //             }
        //             );
        //         } else {
        //             this.props.fetch_user({ User_ID: user.uid })
        //         }
        //     })
        // });


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
    onRegister() {
        const { Email, Password, Confirm_password } = this.state;
        if (Email !== '' && Password !== '' && Confirm_password !== '') {
            if (Password.length < 8 || Confirm_password.length < 8 || Password.length > 16 || Confirm_password.length > 16) {
                Alert.alert("ความยาวของรหัสผ่านไม่ถูกต้อง");
            } else {
                if (Password !== Confirm_password) {
                    console.log(Password + "=" + Confirm_password);
                    Alert.alert("พาสเวิร์ด ไม่ตรงกัน");
                } else {
                    Firebase.auth().createUserWithEmailAndPassword(Email, Password)
                        .then(doc => {
                            Alert.alert("บันทึก อีเมลล์สำเร็จ");
                            this.setState({
                                loading: false
                            })
                            this.props.fetch_user({ User_ID: doc.uid, Email })
                            this.props.navigation.navigate('Profile_edit');
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
    render() {
        if (this.state.loading) {
            return (<Loading></Loading>);
        } else {
            if (this.state.resetPass) {
                return (<View style={styles.container}>
                    <Text style={{ textAlign: 'center', margin: 20, fontSize: 30, color: '#0080ff' }}>รีเซ็ตรหัสผ่าน</Text>
                    <Image
                        source={require('../../assets/pedubon.png')}
                        style={{ width: 200, height: 200 }}
                    />

                    <Item floatingLabel style={{ marginTop: 20 }}>
                        <Icon active name='mail'></Icon>
                        <Label>email</Label>
                        <Input onChangeText={str => this.setState({ Email: str })} />
                    </Item>
                    <View style={{ flexDirection: 'column', margin: 20 }}>
                        <TouchableOpacity style={styles.btn_info} onPress={this.onResetPassword.bind(this)}>
                            <Text style={{ color: '#ffffff', fontSize: 18 }}>ส่งลิ้ง</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn_danger} onPress={() => this.setState({ resetPass: false, Email: '' })}>
                            <Text style={{ color: '#ffffff', fontSize: 18 }}>ยกเลิก</Text>
                        </TouchableOpacity>
                    </View>


                </View >)
            } else if (this.state.register) {
                return (
                    <View style={styles.container}>
                        <Text style={{ textAlign: 'center', margin: 20, fontSize: 30, color: '#0080ff' }}>สมัครสมาชิก</Text>
                        <Image
                            source={require('../../assets/user.png')}
                            style={{ width: 150, height: 150 }}
                        />
                        <Item floatingLabel style={{ marginTop: 20 }}>
                            <Icon active name='mail'></Icon>
                            <Label>email</Label>
                            <Input onChangeText={str => this.setState({ Email: str })} />
                        </Item>
                        <Item floatingLabel>
                            <Icon active name='lock'></Icon>
                            <Label>password 8-16 character</Label>
                            <Input secureTextEntry={this.state.pass} onChangeText={str => this.setState({ Password: str })} />
                            <Icon name={this.state.icon} onPress={this.hidePass.bind(this)}></Icon>
                        </Item>
                        <Item floatingLabel>
                            <Icon active name='lock'></Icon>
                            <Label>Confirm password 8-16 character</Label>
                            <Input secureTextEntry={this.state.pass} onChangeText={str => this.setState({ Confirm_password: str })} />
                            <Icon name={this.state.icon} onPress={this.hidePass.bind(this)}></Icon>
                        </Item>
                        <View style={{ marginBottom: 10 }}></View>
                        <View style={{ margin: 20 }}>
                            <TouchableOpacity style={styles.btn_info} onPress={this.onRegister.bind(this)}>
                                <Text style={{ color: '#ffffff', fontSize: 18 }}>สมัคร</Text>
                            </TouchableOpacity >
                            <TouchableOpacity style={styles.btn_danger} onPress={() => this.setState({ register: false, Email: '' })}>
                                <Text style={{ color: '#ffffff', fontSize: 18 }}>ยกเลิก</Text>
                            </TouchableOpacity >
                        </View>
                    </View>
                )
            } else {
                return (

                    <View style={styles.container}>
                        <Text style={{ textAlign: 'center', margin: 20, fontSize: 30, color: '#0080ff' }}>เข้าสู่ระบบ</Text>
                        <Image
                            source={require('../../assets/pedubon.png')}
                            style={{ width: 200, height: 200 }}
                        />

                        <Item floatingLabel style={{ marginTop: 20 }}>
                            <Icon active name='mail'></Icon>
                            <Label>email</Label>
                            <Input onChangeText={str => this.setState({ Email: str })} />
                        </Item>
                        <Item floatingLabel>
                            <Icon active name='lock'></Icon>
                            <Label>password</Label>
                            <Input secureTextEntry={this.state.pass} minLegth={4} onChangeText={str => this.setState({ Password: str })} />
                            <Icon name={this.state.icon} onPress={this.hidePass.bind(this)}></Icon>
                        </Item>

                        <Button
                            success
                            style={{ margin: 20, padding: 10 }}
                            onPress={this.onLoginButtonPress.bind(this)}>
                            {/* <Icon name="colsecircleo" type="AntDesign" /> */}
                            <Text style={{ color: '#ffffff', fontSize: 24 }}>เข้าสู่ระบบ</Text>
                        </Button>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => this.setState({ resetPass: true })}>
                                <Text style={{ color: '#0080ff', textAlign: 'center', marginRight: 10, textDecorationLine: 'underline', fontSize: 20 }}>ลืมรหัสผ่าน</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.openRegister.bind(this)}>
                                <Text style={{ color: '#0080ff', textAlign: 'center', textDecorationLine: 'underline', fontSize: 20 }}>สมัครสมาชิก</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )
            }
        }


    }
}
//Used to add reducer's into the props
const mapStateToProps = (state) => ({
    fetchReducer: state.fetchReducer
})

//used to action (dispatch) in to props
const mapDispatchToProps = {
    fetch_user
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
