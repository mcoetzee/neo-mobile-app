import React, { Component } from 'react';
import ValidationService from '../../services/ValidationService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import styles, { colors } from '../../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import TextInput from '../../components/text-input';
import Text from '../../components/text';
import Button, { InlineButton } from '../../components/button';
import * as actions from './action-creators';
import { connect } from 'react-redux';

class SendScreen extends Component {
  static navigationOptions = {
    title: 'Send',
    headerStyle: styles.screenHeader,
    headerTitleStyle: { color: 'white' }
  }

  constructor(props) {
    super(props);
    this.assets = [
      { title: 'NEO', value: 'Neo' },
      { title: 'GAS', value: 'Gas' },
    ];
    this.state = { sending: false, asset: 'Neo', address: '', amount: '', message: '' };
  }

  handleAddressChange = address => this.setState({ address })
  handleAmountChange = amount => this.setState({ amount })
  handleAssetChange = asset => this.setState({ asset })

  handleSubmit = () => {
    const { asset } = this.state;
    const address = this.state.address.trim();
    const amount = this.state.amount.trim();

    const addressMessage = ValidationService.validateAddress(address);
    const amountMessage = ValidationService.validateAmountToSend(asset, amount, this.props.balance);

    this.setState({ addressMessage, amountMessage });
    if (addressMessage || amountMessage) {
      return;
    }

    this.setState({ sending: true });

    this.props.sendAsset(this.props.network, address, this.props.address.wif, asset, amount)
      .then(response => {
        this.setState({ sending: false });
        if (response.payload.error) {
          Toast.show('Transaction failed.', {
            duration: 20000,
            position: Toast.positions.BOTTOM,
            shadow: false,
            animation: true,
            hideOnPress: true,
            backgroundColor: colors.orange,
            textColor: colors.black
          });
          this.setState({ message: response.payload.error.message || 'Something went wrong processing this transaction' });
        } else {
          this.setState({ amount: '' });
          Toast.show('Transaction complete! Your balance will automatically update when the blockchain has processed it.', {
            duration: 6000,
            position: Toast.positions.BOTTOM,
            shadow: false,
            animation: true,
            hideOnPress: true,
            backgroundColor: colors.primaryGreen,
            textColor: colors.black
          });
          this.props.navigation.goBack();
        }
      });
  }

  render() {
    const { sending, address, asset, amount, addressMessage, amountMessage, message } = this.state;
    return (
      <KeyboardAwareScrollView style={styles.screenContainer}>
        <Spinner visible={sending} overlayColor="rgba(14, 18, 22, 0.89)"/>
        {!!message &&
          <View style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: colors.orange, padding: 7 }}>
            <Text style={{ color: colors.orange }}>{message}</Text>
          </View>
        }

        <View style={{ marginTop: 20 }}>
          <Text>Public Address</Text>
        </View>

        <TextInput
          placeholder="Enter the address to send to"
          value={address}
          onChangeText={this.handleAddressChange}
          returnKeyType="done"
        />
        {!!addressMessage &&
          <View>
            <Text style={{ color: colors.orange, marginTop: 0 }}>{addressMessage}</Text>
          </View>
        }

        <View style={{ marginTop: 20 }}>
          <Text>Asset</Text>
        </View>

        <View style={
          {
            marginTop: 10,
            flex: 1,
            flexDirection: 'row',
            borderBottomColor: colors.grey,
            borderBottomWidth: StyleSheet.hairlineWidth,
            paddingBottom: 10
          }
        }>
          <InlineButton
            onPress={() => this.handleAssetChange('Neo')}
          >
            <Text style={asset === 'Neo' ? selectedAssetStyle : assetStyle}>
              NEO
            </Text>
          </InlineButton>
          <Text style={{ color: colors.halfGrey }}>/</Text>
          <InlineButton
            onPress={() => this.handleAssetChange('Gas')}
          >
            <Text style={asset === 'Gas' ? selectedAssetStyle : assetStyle}>
              GAS
            </Text>
          </InlineButton>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text>Amount</Text>
        </View>

        <TextInput
          placeholder="Enter the amount to send"
          value={this.state.amount}
          keyboardType="numeric"
          onChangeText={this.handleAmountChange}
          returnKeyType="done"
        />
        {!!amountMessage &&
          <View>
            <Text style={{ color: colors.orange, marginTop: 0 }}>{amountMessage}</Text>
          </View>
        }

        <View style={{
          flex: 1,
          flexDirection: 'row',
          marginTop: 20,
        }}>
          <Button
            type="primary"
            onPress={this.handleSubmit}
            icon={
              <Icon
                name="send"
                size={18}
                color={colors.primaryGreen}
                style={{ alignSelf: 'center', paddingLeft: 6, paddingTop: 4 }}
              />
            }
            style={{ marginRight: 10 }}
            >
            Send
          </Button>
        </View>

      </KeyboardAwareScrollView>
    );
  }
}

const selectedAssetStyle = {
  color: colors.primaryGreen,
  fontSize: 16,
};

const assetStyle = {
  color: colors.grey,
  fontSize: 16,
};

const mapStateToProps = state => {
  return {
    address: state.data.wallet.address,
    balance: state.data.wallet.balance,
    network: state.data.network,
  };
}

export default connect(mapStateToProps, actions)(SendScreen);