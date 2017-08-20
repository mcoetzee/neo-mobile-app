import React, { Component } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../../styles';
import TextInput from '../../components/text-input';
import Text from '../../components/text';
import Button from '../../components/button';
import * as actions from './action-creators';
import { connect } from 'react-redux';

class LoginScreen extends Component {
  static navigationOptions = {
    title: <Text>Neo</Text>,
    headerStyle: styles.screenHeader
  }

  constructor(props) {
    super(props);
    this.state = { wif: '', message: '' };
  }

  handleSubmit = () => {
    const wif = this.state.wif.trim();
    if (!wif) {
      return;
    }

    this.props.loadWallet(wif)
      .then(response => {
        if (response.payload && response.payload.public) {
          // Success
          this.setState({ wif: '', message: '' });
          this.props.navigation.navigate('Home');
        } else {
          this.setState({ message: 'Could not log in with this key' });
        }
      });
  };

  render() {
    return (
      <KeyboardAwareScrollView style={styles.screenContainer}>
        {!!this.state.message &&
          <View style={{ marginTop: 20 }}>
            <Text>{this.state.message}</Text>
          </View>
        }
        <TextInput
          placeholder="Enter your private key here (WIF)"
          value={this.state.wif}
          onChangeText={text => { this.setState({ wif: text }); }}
          returnKeyType="done"
          onSubmitEditing={this.handleSubmit}
        />
        <View style={{ marginTop: 20 }}>
          <Button type="primary" onPress={this.handleSubmit}>
            Log in
          </Button>
          <Button onPress={() => this.props.navigation.navigate('NewWallet')}>
            Create New Wallet
          </Button>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default connect(null, actions)(LoginScreen);