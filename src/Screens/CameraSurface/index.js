import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, CameraRoll } from 'react-native';
import { RNCamera } from 'react-native-camera';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

class CameraScreen extends React.PureComponent {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    recordOptions: {
      mute: false,
      maxDuration: 300,
      quality: RNCamera.Constants.VideoQuality['2160p'],
    },
    isRecording: false,
  };

  toggleFacing = () => {
    const { type } = this.state;
    this.setState({
      type: type === 'back' ? 'front' : 'back',
    });
  };

  toggleFlash = () => {
    const { flash } = this.state;
    this.setState({
      flash: flashModeOrder[flash],
    });
  };

  takeVideo = async () => {
    const { recordOptions } = this.state;
    const { navigation } = this.props;
    if (this.camera) {
      try {
        const promise = this.camera.recordAsync(recordOptions);

        if (promise) {
          this.setState({ isRecording: true });
          const data = await promise;
          CameraRoll.saveToCameraRoll(data.uri, 'video');
          navigation.navigate('VideoPreview', {
            uri: data.uri,
          });
          this.setState({ isRecording: false });
        }
      } catch (e) {
        return null;
      }
    }
  };

  stopVideoRecording = () => {
    this.camera.stopRecording();
  };

  render() {
    const { flash, autoFocus, zoom, whiteBalance, ratio, depth, type, isRecording } = this.state;
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.cameraView}
          type={type}
          flashMode={flash}
          autoFocus={autoFocus}
          zoom={zoom}
          whiteBalance={whiteBalance}
          ratio={ratio}
          focusDepth={depth}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
        >
          <View style={styles.topBtnContainer}>
            <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing}>
              <Text style={styles.flipText}> FLIP </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flipButton} onPress={this.toggleFlash}>
              <Text style={styles.flipText}> FLASH: {flash} </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomBtnContainer}>
            <TouchableOpacity
              style={[
                styles.flipButton,
                isRecording ? styles.recordingBackGround : styles.nonRecordingBackground,
              ]}
              onPress={isRecording ? this.stopVideoRecording : this.takeVideo}
            >
              {isRecording ? (
                <Text style={styles.flipText}> ☕ </Text>
              ) : (
                <Text style={styles.flipText}> REC </Text>
              )}
            </TouchableOpacity>
          </View>
        </RNCamera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  cameraView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBtnContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomBtnContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  flipButton: {
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingBackGround: {
    backgroundColor: 'white',
  },
  nonRecordingBackground: {
    backgroundColor: 'darkred',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
});

export default CameraScreen;
