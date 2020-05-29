import React from 'react'
import { Alert, Dimensions, Platform, StatusBar, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import Octicon from 'react-native-vector-icons/Octicons'
import Tooltip from 'react-native-walkthrough-tooltip'

import { Props } from '../reducer'
import CustomOptions from './CustomOptions'
import pressPlay from './press-play'
import TypeSwitcher from './TypeSwitcher'

const { width: screenWidth } = Dimensions.get('window')

function MainScreen(props: Props) {
  const {
    displayName,
    history,
    incomingFriendRequests,
    isEnoughTime,
    notifications_allowed,
    onlineSits,
    recentlyJoinedContacts,
    setState,
    showHistoryBtnTooltip,
    toggle,
    user,
  } = props

  const numUnsyncdSits = user ? history.length - onlineSits?.length : 0
  const friendable = Number(user && (!displayName || !notifications_allowed))
  const numNotifications = numUnsyncdSits + friendable + incomingFriendRequests.length + recentlyJoinedContacts.length

  return (
    <>
      <TypeSwitcher
        selectView={index => props.setState({ mainScreenSwitcherIndex: index })}
        viewIndex={props.mainScreenSwitcherIndex}
      />

      {props.mainScreenSwitcherIndex === 0 && <CustomOptions {...props} />}

      {/* Bottom row */}
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 30,
          marginTop: 'auto',
        }}
      >
        {/* SettingsBtn */}
        <TouchableOpacity
          onPress={() => setState({ screen: 'SettingsScreen' })}
          style={{ padding: 15, paddingLeft: 0, width: 50 }}
        >
          <AntIcon color="#fff3" name="setting" size={30} />
          {!!numNotifications && (
            <View
              style={{
                backgroundColor: '#f8ff70',
                borderRadius: 30,
                left: 30,
                paddingHorizontal: 4,
                position: 'absolute',
                top: 5,
              }}
            >
              <Text style={{ color: '#000', fontSize: 11, fontWeight: '700' }}>{numNotifications}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* StartBtn */}
        <TouchableHighlight
          onPress={
            isEnoughTime
              ? pressPlay.bind(null, props)
              : () => {
                  Alert.alert('Not enough time', 'Lengthen the duration, or turn off the optional extras.')
                }
          }
          style={{
            alignItems: 'center',
            borderColor: '#008000',
            borderRadius: btnSize,
            borderWidth: 1,
            height: btnSize,
            justifyContent: 'center',
            opacity: isEnoughTime ? 1 : 0.3,
            width: btnSize,
          }}
        >
          <Text
            style={{
              color: '#73d45d',
              fontSize: 18,
              fontWeight: '500',
            }}
          >
            Start
          </Text>
        </TouchableHighlight>

        {/* HistoryBtn */}
        <Tooltip
          childContentSpacing={0}
          content={<Text style={{ color: '#000', fontWeight: '500' }}>Your history</Text>}
          contentStyle={{ backgroundColor: '#ccc', left: screenWidth / 2 - 78 }}
          isVisible={showHistoryBtnTooltip}
          onClose={toggle('showHistoryBtnTooltip')}
          placement="top"
          topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight! : 0}
        >
          <TouchableOpacity
            onPress={() => setState({ screen: 'HistoryScreen' })}
            style={{ padding: 15, paddingRight: 0, width: 50 }}
          >
            <Octicon color="#fffd" name="calendar" size={30} style={{ opacity: showHistoryBtnTooltip ? 0.6 : 0.2 }} />
          </TouchableOpacity>
        </Tooltip>
      </View>
    </>
  )
}

const btnSize = 80

export default MainScreen
