import React, { Component } from 'react';
import { Text, TextInput, View, Image, Button } from 'react-native';
import axios from 'axios';
import { BarCodeScanner, Camera, Permissions } from 'expo';
import styles from './assets/css/styles';
import logoGist from './assets/images/logo_gist.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      gistUrl: '',
      content: '',
      comment: '',
      loggedIn: false,
      hasCameraPermission: null,
      type: Camera.Constants.Type.front,
    };

    this.getGistId = () => {
      const { gistUrl } = this.state;
      const reg = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
      try {
        return reg.exec(gistUrl)[6];
      } catch (e) {
        return gistUrl;
      }
    };

    this.onShowGist = () => {
      const gistId = this.getGistId();

      axios
        .get(`https://api.github.com/gists/${gistId}`)
        .then((response) => {
          const { content } = response.data.files[Object.keys(response.data.files)[0]];
          this.setState({ content });
        })
        .catch(() => {
          alert('Error!');
        });
    };

    this.onSendComment = () => {
      const gistId = this.getGistId();
      axios({
        method: 'post',
        url: `https://api.github.com/gists/${gistId}/comments`,
        auth: {
          username: this.state.username,
          password: this.state.password,
        },
        data: {
          body: this.state.comment,
        },
      })
        .then(() => {
          alert('Comment successfully submitted!');
        })
        .catch(() => {
          alert('Error!');
        });
    };

    this.handleBarCodeRead = ({ data }) => {
      this.setState({ gistUrl: data });
    };

    this.loginUser = () => {
      axios({
        method: 'get',
        url: 'https://api.github.com/user',
        auth: {
          username: this.state.username,
          password: this.state.password,
        },
      })
        .then(() => {
          this.setState({ loggedIn: true });
        })
        .catch(() => {
          alert('Error!');
          this.setState({ loggedIn: false });
        });
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
    if (this.state.loggedIn) {
      return (
        <View style={styles.viewCamera}>
          <Text>QRCode Scanner</Text>
          <BarCodeScanner
            style={styles.camera}
            onBarCodeRead={this.handleBarCodeRead}
            type={this.state.type}
          />
        </View>
      );
    }
    return <View />;
  }

  renderLoginForm() {
    if (!this.state.loggedIn) {
      return (
        <View>
          <TextInput
            style={{ height: 50 }}
            placeholder="User"
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
          />
          <TextInput
            style={{ height: 50 }}
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            secureTextEntry
            value={this.state.password}
          />
          <Button
            onPress={this.loginUser}
            title="Sign In"
            color="cadetblue"
            accessibilityLabel="Sign In"
          />
        </View>
      );
    }
    return <View />;
  }

  renderGistForm() {
    if (this.state.loggedIn) {
      return (
        <View style={styles.viewFormGist}>
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
          <TextInput
            style={styles.comment}
            placeholder="Gist Comment"
            onChangeText={text => this.setState({ comment: text })}
            value={this.state.comment}
            multiline
            numberOfLines={4}
          />
          <Button
            onPress={this.onSendComment}
            title="Send Comment"
            color="cadetblue"
            accessibilityLabel="Send Comment"
          />
          <Text>{this.state.content}</Text>
        </View>
      );
    }
    return <View />;
  }

  render() {
    return (
      <View>
        <View style={styles.header}>
          <Image style={styles.imgTop} source={logoGist} />
        </View>
        <View style={styles.initialForm}>
          {this.renderBarCode()}
          {this.renderLoginForm()}
          {this.renderGistForm()}
        </View>
      </View>
    );
  }
}
export default App;
