import React from 'react'
import { Image, ScrollView, StatusBar, Text, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import TitleBar from './TitleBar'

function FriendsMarketingScreen() {
  return (
    <>
      <TitleBar name="ADDING FRIENDS" style={{ marginBottom: 1 }} />
      <StatusBar hidden={true} />

      <ScrollView indicatorStyle="white" style={{ paddingHorizontal: 25, paddingTop: 50 }}>
        <Ionicons color="#fff4" name="ios-people" size={83} style={{ alignSelf: 'center', marginBottom: 40 }} />
        <Text style={{ color: '#fffc', fontSize: 18, lineHeight: 26 }}>
          Sometimes meditation can feel a bit isolating, so GoenkaTimer lets you{' '}
          <Text style={{ color: '#fff', fontWeight: '600' }}>add friends</Text> to automatically share when you complete
          sits:
        </Text>
        <Image
          source={require('./friend_notif_example.png')}
          style={{ height: 240, resizeMode: 'contain', width: '100%' }}
        />
        <Text style={{ color: '#fff8', fontSize: 15, lineHeight: 26, marginTop: 0 }}>
          Staying connected with a supportive community can be very helpful to building a stronger practice.
        </Text>
        <View style={{ height: 210 }} />
      </ScrollView>
    </>
  )
}

FriendsMarketingScreen.paddingHorizontal = 2

export default FriendsMarketingScreen
