import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    height: 70,
    backgroundColor: 'powderblue',
    paddingTop: 27,
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
  comment: {
    paddingTop: 25,
  },
  viewFormGist: {
    paddingTop: 25,
  },
});

export default styles;
