import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import {connect} from 'react-redux';

import {Props, State, Toggleables, setStatePayload} from '../reducer';
import LoginFlow from './LoginFlow';

type SectionProps = Props & {
  Content: (props: any) => JSX.Element;
  badgeNumber?: number;
  description: string;
  icon: {Set: typeof Octicons; name: string; size: number};
  requiresLogin?: boolean;
  startExpandedKey?: 'expandFriendsSection';
  title: string;
};

function Section(props: SectionProps) {
  const {
    Content,
    badgeNumber,
    description,
    icon,
    requiresLogin,
    setState,
    startExpandedKey,
    title,
    user,
  } = props;
  const [enabled, setEnabled] = useState(false);
  const [wasAutoExpanded, setWasAutoExpanded] = useState<boolean>();
  const {Set} = icon;

  if (startExpandedKey && props[startExpandedKey] && !wasAutoExpanded) {
    setWasAutoExpanded(true); // Prevents endless loop
    setEnabled(true);
    setState({expandFriendsSection: false});
  }

  return (
    <View style={{marginBottom: enabled ? 50 : 30}}>
      {/* Section header clickable */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setEnabled(!enabled)}>
        <View
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            borderColor: enabled ? '#9CDCFE55' : '#fff1',
            borderRadius: 8,
            borderWidth: 1,
            flexDirection: 'row',
            height: 38,
            paddingHorizontal: 15,
            width: '100%',
          }}>
          {/* Section icon */}
          <View style={{alignItems: 'center', marginRight: 10, width: 25}}>
            <Set
              color={enabled ? '#fffd' : '#fff8'}
              {...icon}
              style={{paddingTop: 2}}
            />
          </View>

          {/* Section title */}
          <Text style={{color: enabled ? '#fffd' : '#fff8', fontSize: 16}}>
            {title}
          </Text>

          {/* Notification badges */}
          {!!badgeNumber && (
            <View
              style={{
                backgroundColor: `#f8ff70${enabled ? '' : 'bb'}`,
                borderRadius: 30,
                marginLeft: 15,
                paddingHorizontal: 5,
              }}>
              <Text style={{color: '#000', fontWeight: '700'}}>
                {badgeNumber}
              </Text>
            </View>
          )}

          {/* Expand / expanded arrow */}
          <Octicons
            color="#fff5"
            name={enabled ? 'chevron-down' : 'chevron-right'}
            size={18}
            style={{marginLeft: 'auto', paddingTop: 3}}
          />
        </View>

        {/* Description */}
        {enabled && description && (
          <View
            style={{
              backgroundColor: '#9CDCFE11',
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              borderColor: '#9CDCFE19',
              borderTopWidth: 0,
              borderWidth: 1,
              flex: 1,
              marginHorizontal: 10,
            }}>
            <Text
              style={{
                bottom: 1,
                color: '#fff6',
                fontWeight: '400',
                paddingLeft: 10,
                paddingVertical: 5,
              }}>
              {description}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {enabled && (
        <View style={{marginTop: 30, paddingHorizontal: 18}}>
          {requiresLogin && !user ? (
            <LoginFlow {...props} />
          ) : (
            <Content {...props} />
          )}
        </View>
      )}
    </View>
  );
}

export default connect(
  (s: State) => s,

  // Map dispatch into setState prop
  dispatch => ({
    setState: (payload: setStatePayload) =>
      dispatch({payload, type: 'SET_STATE'}),
    toggle: (key: Toggleables) => () => dispatch({key, type: 'TOGGLE'}),
  }),
)(Section);
