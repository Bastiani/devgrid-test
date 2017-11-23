import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View, Image, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BarCodeScanner, Camera, Permissions } from 'expo';
import logoGist from './assets/logo_gist.png';

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
  camera: {
    width: 100,
    height: 100,
    alignItems: 'center',
    transform: [{ rotate: '-90deg' }],
  },
  viewCamera: {
    height: 100,
    alignItems: 'center',
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gistUrl: '',
      content: '',
      message: '',
      hasCameraPermission: null,
      type: Camera.Constants.Type.front,
    };

    this.onShowGist = () => {
      const { gistUrl } = this.state;
      const reg = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      let gistId;
      try {
        gistId = reg.exec(gistUrl)[6];
      } catch (e) {
        gistId = gistUrl;
      }

      axios
        .get(`https://api.github.com/gists/${gistId}`)
        .then((response) => {
          console.log(response);
          const { content } = response.files[0];
          this.setState({ content });
        })
        .catch((e) => {
          console.log('aquiiii', e);
          const { message } = e.message;
          this.setState({ message });
          alert(e.message);
        });
    };

    this.handleBarCodeRead = ({ data }) => {
      this.setState({ gistUrl: data });
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  renderBarCode() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={styles.viewCamera}>
        <BarCodeScanner
          style={styles.camera}
          onBarCodeRead={this.handleBarCodeRead}
          type={this.state.type}
        />
      </View>
    );
  }

  render() {
    return (
      <View>
        <View>
          <View style={styles.header}>
            <Image style={styles.imgTop} source={logoGist} />
          </View>
          <View style={styles.initialForm}>
            <Text value={this.state.message} />
            <TextInput
              style={{ height: 50 }}
              placeholder="Gist URL"
              onChangeText={gistUrl => this.setState({ gistUrl })}
              value={this.state.gistUrl}
            />
            <Button
              onPress={this.onShowGist}
              title="Show Gist"
              color="cadetblue"
              accessibilityLabel="Show Gist"
            />
            {this.renderBarCode()}
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
