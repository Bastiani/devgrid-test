import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View, Image, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import QRCodeScanner from 'react-native-qrcode-scanner';

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    height: 50,
    backgroundColor: 'powderblue',
    paddingTop: 10,
  },
  imgTop: {
    resizeMode: 'stretch',
    width: 100,
    height: 35,
  },
  initialForm: {
    padding: 25,
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { gistId: '', content: '', message: '' };

    this.onShowGist = () => () => {
      const { gistId } = this.state;
      axios
        .get(`https://api.github.com/gists/${gistId}`)
        .then((response) => {
          const { content } = response.files[0];
          this.setState({ content });
        })
        .catch((e) => {
          const { message } = e.message;
          this.setState({ message });
        });
    };

    this.readQRCode = (e) => {
      this.setState({ gistId: e.data });
    };
  }

  render() {
    return (
      <View>
        <View>
          <View style={styles.header}>
            <Image style={styles.imgTop} source={require('./assets/logo_gist.png')} />
          </View>
          <View style={styles.initialForm}>
            <Text value={this.state.message} />
            <TextInput
              style={{ height: 50 }}
              placeholder="Gist URL"
              onChangeText={gistId => this.setState({ gistId })}
              value={this.state.gistId}
            />
            <QRCodeScanner
              onRead={this.readQRCode(this)}
              topContent={
                <Text style={styles.centerText}>
                  Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your
                  computer and scan the QR code.
                </Text>
              }
              bottomContent={
                <TouchableOpacity style={styles.buttonTouchable}>
                  <Text style={styles.buttonText}>OK. Got it!</Text>
                </TouchableOpacity>
              }
            />
            <Button
              onPress={() => this.onShowGist()}
              title="Show Gist"
              color="cadetblue"
              accessibilityLabel="Show Gist"
            />
            <TextInput
              style={{ height: 50 }}
              placeholder="Gist Content"
              value={this.state.content}
              multiline
            />
          </View>
        </View>
      </View>
    );
  }
}
export default App;
