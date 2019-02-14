import React, { PureComponent } from 'react';
import {
  Image,
  View,
  StyleSheet,
  PermissionsAndroid,
  Button,
  ActivityIndicator,
  Text,
  CameraRoll,
} from 'react-native';
import Video from 'react-native-video';
import { RNFFmpeg } from 'react-native-ffmpeg';

import { resourcePath, getSaveVideoCommand } from './../../utils/video-utils';

const duck = require('./../../assets/img1.gif');

class VideoPreview extends PureComponent {
  state = {
    isLoading: false,
  };

  async componentDidMount() {
    this.requestExternalStoragePermission();
  }

  requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'My App Storage Permission',
          message: 'My App needs access to your storage ' + 'so you can save your photos',
        }
      );
      return granted;
    } catch (err) {
      // console.error('Failed to request permission ', err);
      return null;
    }
  };

  getMediaInformation = async pathName => {
    const info = await RNFFmpeg.getMediaInformation(pathName);
    await CameraRoll.saveToCameraRoll(`file://${info.path}`, 'video');
  };

  saveVideo = async () => {
    const { navigation } = this.props;
    try {
      const uri = navigation.getParam('uri');
      const image1 = await resourcePath('img1.gif');
      const { pathName, command } = getSaveVideoCommand(image1, uri.split('file://')[1]);
      this.setState({ isLoading: true });
      await RNFFmpeg.execute(command, ' ');
      this.setState({ isLoading: false });
      this.getMediaInformation(pathName);
    } catch (err) {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { navigation } = this.props;
    const { isLoading } = this.state;
    const uri = navigation.getParam('uri');

    return (
      <View style={styles.container}>
        <Video
          source={{
            uri: uri ? uri : 'https://www.radiantmediaplayer.com/media/bbb-360p.mp4',
          }}
          repeat={true}
          ref={ref => {
            this.player = ref;
          }} // Store reference
          style={styles.videoContainer}
        />
        <Button style={styles.saveVdoBtn} title="Save Video" onPress={this.saveVideo} />
        <Image source={duck} style={styles.imageView} />
        {isLoading && (
          <View style={styles.loaderOuterContainer}>
            <View style={styles.loaderInnerContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Loading...</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  imageView: {
    height: 100,
    width: 100,
    position: 'absolute',
    top: 50,
    left: 50,
  },
  saveVdoBtn: {
    bottom: 0,
  },
  loaderOuterContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderInnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 'auto',
    width: 'auto',
  },
});

export default VideoPreview;
