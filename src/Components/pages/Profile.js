import React, { Component } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Loading } from '../Methods';
import Firebase from '../../../Firebase';
import styles from '../../styles/main.styles';
import { Button, Text, Icon } from 'native-base';
import { fetch_user } from '../../actions';
import { connect } from 'react-redux';
import { isEmptyValue } from '../Methods';
import { CommonActions } from '@react-navigation/native';
export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.fetchReducer.user,
      loading: false,
    };
  }

  authListener() {
    if (isEmptyValue(this.state.User_ID)) {
      this.props.navigation.navigate('Login');
    } else {
      if (isEmptyValue(this.state.Name)) {
        this.props.navigation.navigate('Profile_edit');
      }
    }
  }
  selectDate = date => {
    this.setState({
      bd: date,
    });
  };
  componentDidMount() {
    // console.log(this.state)
    this.authListener();
  }
  logout = e => {
    e.preventDefault();
    this.props.fetch_user({});
    Firebase.auth()
      .signOut()
      .then(response => {

        this.props.navigation.dispatch(CommonActions.reset({ index: 1, routes: [{ name: 'Login' }] }));
        // this.props.navigation.navigate('Login');
      });

    console.log('logout');

  };
  render() {
    const {
      Name, Last_name, Nickname, Sex, Phone_number, Line_ID,
      Facebook, bd, Position, Department, Province, District, Sub_district,
      Avatar_URL, User_type, } = this.state;
    if (this.state.loading) {
      return <Loading></Loading>;
    } else {
      return (
        <ScrollView>
          <View style={styles.container}>
            {Avatar_URL === '' ? (
              <Image
                source={require('../../assets/user.png')}
                style={styles.avatar}></Image>
            ) : (
                <Image source={{ uri: Avatar_URL }} style={styles.avatar}></Image>
              )}

            <View style={{ marginTop: 10, flex: 1 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100, fontWeight: 'bold', fontSize: 16 }}>
                  ชื่อ :
                </Text>
                <Text style={{ fontSize: 16 }}>
                  {Name} {Last_name}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100, fontWeight: 'bold', fontSize: 16 }}>
                  ชื่อเล่น :
                </Text>
                <Text style={{ fontSize: 16 }}>{Nickname}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100, fontWeight: 'bold', fontSize: 16 }}>
                  เพศ :
                </Text>
                <Text style={{ fontSize: 16 }}>{Sex}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100, fontWeight: 'bold', fontSize: 16 }}>
                  วันเกิด :
                </Text>
                <Text style={{ fontSize: 16 }}>{bd}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100, fontWeight: 'bold', fontSize: 16 }}>
                  ประเภทผู้ใช้ :
                </Text>
                <Text style={{ fontSize: 16 }}>{User_type}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100, fontWeight: 'bold', fontSize: 16 }}>
                  เบอร์โทรศัพท์มือถือ :
                </Text>
                <Text style={{ fontSize: 16 }}>
                  {'\n'}
                  {Phone_number}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100, fontWeight: 'bold', fontSize: 16 }}>
                  Facebook :
                </Text>
                <Text style={{ fontSize: 16 }}>{Facebook}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100, fontWeight: 'bold', fontSize: 16 }}>
                  Line_ID :
                </Text>
                <Text style={{ fontSize: 16 }}>{Line_ID}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100, fontWeight: 'bold', fontSize: 16 }}>
                  ตำแหน่ง :
                </Text>
                <Text style={{ fontSize: 16 }}>{Position}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100, fontWeight: 'bold', fontSize: 16 }}>
                  หน่วยงาน :
                </Text>
                <Text style={{ fontSize: 16 }}>{Department}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 100, fontWeight: 'bold', fontSize: 16 }}>
                  ที่อยู่ :
                </Text>
                <Text style={{ fontSize: 16 }}>
                  ตำบล{Sub_district}
                  {'\n'} อำเภอ{District}
                  {'\n'} จังหวัด{Province}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Button
                info
                style={{ margin: 10 }}
                onPress={() => this.props.navigation.navigate('Profile_edit')}>
                <Icon name="edit" type="AntDesign" />
                <Text>แก้ไข</Text>
              </Button>
              <Button
                danger
                style={{ margin: 10 }}
                onPress={() => this.props.navigation.navigate('Main')}>
                <Icon name="left" type="AntDesign" />
                <Text>กลับ</Text>
              </Button>
            </View>
            <Button
              danger
              style={{ margin: 10 }}
              onPress={this.logout.bind(this)}>
              <Icon name="closecircleo" type="AntDesign" />
              <Text>ออกจากระบบ</Text>
            </Button>
          </View>
        </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
