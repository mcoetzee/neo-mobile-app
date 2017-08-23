import React, { Component } from 'react';
import { Linking, StyleSheet, View, ScrollView, RefreshControl, TouchableHighlight } from 'react-native';
import styles, { colors } from '../../styles';
import Text from '../../components/text';
import Button, { InlineButton } from '../../components/button';
import { connect } from 'react-redux';
import * as actions from './action-creators';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Title from './Title';

export class TransactionsScreen extends Component {
  static navigationOptions = {
    headerStyle: styles.screenHeader,
    headerTitle: (
      <Title />
    ),
    tabBarIcon: ({ tintColor }) => (
      <EntypoIcon
        name="list"
        size={25}
        color={tintColor}
      />
    ),
  }

  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }

  componentDidMount() {
    // this.props.navigation.setParams({ HeaderConnection: ConnectedHeader });
    this.handleLoad();
  }

  handleLoad() {
    const { loadTransactionHistory, network, address } = this.props;
    loadTransactionHistory(network, address.public);
  }

  handlePress(txid) {
    const api = this.props.network === "MainNet"
      ? "http://antcha.in"
      : "http://testnet.antcha.in";
    Linking.openUrl(`${api}/tx/hash/${txid}`);
  }

  render() {
    const { transactions } = this.props;
    return (
      <ScrollView style={styles.screenContainer}
        refreshControl={
          <RefreshControl
            refreshing={!!transactions.loading}
            onRefresh={this.handleLoad}
          />
        }
      >
        {transactions.data.map(tx => {
          return (
            <TouchableHighlight
              underlayColor={colors.quarterGrey}
            >
              <View key={tx.txid} style={{ paddingTop: 10, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.halfGrey }}>
                <Text>{tx.type} {tx.amount}</Text>
                <Text type="secondary">{tx.txid}</Text>
              </View>
            </TouchableHighlight>
          );
        })}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    address: state.data.wallet.address,
    network: state.data.network,
    transactions: state.data.wallet.transactions
  };
}

export default connect(mapStateToProps, actions)(TransactionsScreen);
