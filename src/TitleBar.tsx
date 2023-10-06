import React from 'react';
import {Text, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {version} from '../package.json';

interface TitleBarProps {
  name: string;
  showVersion?: boolean;
  style?: ViewStyle;
}

const TitleBar = (props: TitleBarProps) => {
  const insets = useSafeAreaInsets();
  const marginTop = insets.top > 0 ? insets.top : 4;

  return (
    <View
      style={[
        {
          backgroundColor: '#40514718',
          borderColor: '#40514758',
          borderTopWidth: 1,
          marginBottom: 20,
          marginTop,
          paddingVertical: 10,
        },
        props.style || {},
      ]}>
      <Text
        style={{
          alignSelf: 'center',
          color: '#fffa',
          fontSize: 11,
          fontWeight: '500',
        }}>
        {props.name}
      </Text>
      {props.showVersion && (
        <Text
          style={{
            color: '#fff3',
            fontSize: 11,
            position: 'absolute',
            right: 29,
            top: 10,
          }}>
          v{version}
        </Text>
      )}
    </View>
  );
};

export default TitleBar;
