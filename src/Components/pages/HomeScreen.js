import React, { Component } from 'react';
import Firebase from '../../../Firebase';
import { View, Image } from 'react-native';
import { Container, Content, Footer, Button, Text } from 'native-base';
import Loading from '../Loading';
import { fetch_user } from '../../actions';
import { connect } from 'react-redux';
import data_provinces from '../../data/provinces';
import { isEmptyValue } from '../Methods';
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page: 'Home'
    };
    this.goTopage(this);
  }

  componentDidMount() {
    this.goTopage(this);
  }
  goTopage = (e) => {

    console.log("start")
    this.setState({
      loading: true,
    });

    Firebase.auth().onAuthStateChanged(user => {
      if (user) {
        Firebase.firestore().collection('USERS').doc(user.uid).get().then(doc => {
          if (doc.exists) {
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
              User_ID: user.uid, Province, District, Sub_district, bd, Ban_name,
              ...doc.data(),
            });
            if (!this.props.fetchReducer.isFectching) {
              // this.props.navigation.navigate('Main');
              console.log('Main');
              this.setState({
                loading: false,
                page: 'Main'
              });
            }

          } else {
            this.props.fetch_user({ User_ID: user.uid, Email: user.email });
            this.setState({
              loading: false,
              page: 'Profile_edit'
            });
            // this.props.navigation.navigate('Profile_edit');
            console.log('Profile_edit');

          }
        });
      } else {
        this.props.fetch_user({});
        this.setState({
          loading: false,
        });
        this.props.navigation.navigate('Login');


      }
    });
  }
  onLogin = () => {

    if (this.props.fetchReducer.user === [] || isEmptyValue(this.props.fetchReducer.user.User_ID)) {
      this.props.navigation.navigate('Login');
    } else {
      this.props.navigation.navigate(this.state.page)
    }

  }
  render() {

    if (this.state.loading) {
      return <Loading></Loading>;
    } else {
      return (
        <Container>
          <Content>
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60, }}>
              <Image
                source={require('../../assets/local.png')}
                style={{ width: 170, height: 170 }}></Image>
              <Text style={{ fontSize: 32, textAlign: 'center' }}>
                โครงการสร้างเสริมสุขภาวะเด็กและเยาวชน จังหวัดอุบลราชธานี
              </Text>
            </View>
            <Button info style={{ margin: 30, justifyContent: 'center', alignItems: 'center', }}
              onPress={this.onLogin.bind(this)}>
              <Text>เข้าสู่ระบบ</Text>
            </Button>
          </Content>
          <Footer style={{ backgroundColor: '#ffffff', height: 150 }}>
            {/* <FooterTab style={{  }}> */}
            <Image
              source={require('../../assets/sss.png')}
              style={{ width: 110, height: 110 }}
            />
            <Image
              source={require('../../assets/4ctPED.png')}
              style={{ width: 110, height: 110 }}
            />
            <Image
              source={require('../../assets/silc.png')}
              style={{ width: 100, height: 100 }}
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
