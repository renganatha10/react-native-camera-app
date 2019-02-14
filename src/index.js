import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import HomeRouter from './routes';

class AppLoader extends PureComponent {
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HomeRouter />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
  },
});

export default AppLoader;
