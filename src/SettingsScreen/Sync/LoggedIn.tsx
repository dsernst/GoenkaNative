import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import _ from 'lodash'
import React from 'react'
import { Alert, Platform, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'

import SitRow from '../../HistoryScreen/SitRow'
import { Props } from '../../reducer'

type LoggedInProps = Props & { user: FirebaseAuthTypes.User }

const LoggedIn = ({ autoSyncCompletedSits, history, onlineSits, setState, toggle, user }: LoggedInProps) => {
  const onlineSitsByDate = _.keyBy(onlineSits, oS => oS.date.getTime())
  const localSitsByDate = _.keyBy(history, s => s.date.getTime())

  const onlineOnlySits = onlineSits?.filter(os => !localSitsByDate[os.date.getTime()])

  // All sync'd if # local sits == # online sits, and there are no onlineOnlySits
  const allSynced = history.length === onlineSits?.length && !onlineOnlySits?.length

  return (
    <>
      {/* Login Info */}
      <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 30 }}>
        <Text style={{ color: '#fff9' }}>Verified as:</Text>
        <TouchableOpacity
          onLongPress={() =>
            Alert.alert('Would you like to logout?', '', [
              { text: 'Cancel' },
              {
                onPress: async () => {
                  await auth().signOut()
                },
                style: 'destructive',
                text: 'Logout',
              },
            ])
          }
          style={{ padding: 10, paddingRight: 0 }}
        >
          <Text style={{ alignSelf: 'center', color: '#fffd', fontStyle: 'italic', fontWeight: '500' }}>
            {prettyPhoneNumber(user.phoneNumber!)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sits on device: x */}
      <Text style={{ color: '#fff9', fontSize: 16, marginTop: 45 }}>
        You have&nbsp;
        <Text style={{ color: '#fffd', fontWeight: '500' }}>{history.length}</Text>
        &nbsp;sit{history.length !== 1 && 's'} recorded on this devices,
      </Text>

      {/* Sits online: y */}
      <Text style={{ color: '#fff9', fontSize: 16, marginTop: 15, paddingLeft: 39 }}>
        and&nbsp;
        <Text style={{ color: '#fffd', fontWeight: '500' }}>{!onlineSits ? '[loading...]' : onlineSits.length}</Text>
        &nbsp;sit{onlineSits?.length !== 1 && 's'} saved online.
      </Text>

      {/* Online only sits */}
      {onlineOnlySits?.length ? (
        <>
          <Text style={{ color: '#fffc', fontSize: 16, fontWeight: '600', marginTop: 30 }}>
            Online sits, not on your device:
          </Text>
          <ScrollView>
            {onlineOnlySits?.map((s, index) => (
              <View key={index}>
                <SitRow history={onlineOnlySits} i={s} index={index} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 20 }}>
                  {/* Discard btn */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      firestore()
                        .collection('sits')
                        .doc(s.id)
                        .delete()
                    }
                    style={{
                      alignItems: 'center',
                      borderColor: '#f58c8c',
                      borderRadius: 5,
                      borderWidth: 1,
                      flexDirection: 'row',
                      paddingHorizontal: 13,
                      paddingVertical: 4,
                    }}
                  >
                    <Octicons color="#fffa" name="trashcan" size={16} style={{ paddingRight: 15, top: 1 }} />
                    <Text style={{ color: '#fff9', fontSize: 16 }}>Discard</Text>
                  </TouchableOpacity>

                  {/* Download btn */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() =>
                      setState({ history: [s, ...history].sort((b, a) => a.date.getTime() - b.date.getTime()) })
                    }
                    style={{
                      alignItems: 'center',
                      borderColor: '#5594fa',
                      borderRadius: 5,
                      borderWidth: 1,
                      flexDirection: 'row',
                      paddingHorizontal: 15,
                    }}
                  >
                    <Octicons color="#fffa" name="cloud-download" size={16} style={{ paddingRight: 10, top: 1 }} />
                    <Text style={{ color: '#fff9', fontSize: 16 }}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={{ height: 40, marginTop: 30 }}>
            {allSynced ? (
              // All sync'd message
              <Text style={{ color: '#56cc6a', fontSize: 16, fontWeight: '700', marginTop: 10, textAlign: 'center' }}>
                All sync'ed &nbsp;&nbsp;&nbsp;ツ
              </Text>
            ) : (
              // Sync now button
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  // Upload all the local sits not already online
                  history
                    .filter(localSit => !onlineSitsByDate[localSit.date.getTime()]) // Only keep if not already synced
                    .forEach(unsyncedSit =>
                      firestore()
                        .collection('sits')
                        .add({ ...unsyncedSit, user_id: user.uid }),
                    )
                }}
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  borderColor: '#fff7',
                  borderRadius: 8,
                  borderWidth: 1,
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                  paddingVertical: 7,
                }}
              >
                <Octicons color="#fffa" name="sync" size={18} style={{ paddingLeft: 4, paddingTop: 2, width: 30 }} />
                <Text style={{ color: '#fff9', fontSize: 18 }}>Sync now</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* autoSyncCompletedSits Switch */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggle('autoSyncCompletedSits')}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
              paddingVertical: 15,
            }}
          >
            <Text
              style={{
                color: '#fff9',
                fontSize: 16,
                fontWeight: '400',
              }}
            >
              Auto-sync completed sits?
            </Text>
            <Switch
              onValueChange={toggle('autoSyncCompletedSits')}
              style={{
                alignSelf: 'flex-end',
                paddingVertical: 10,
                transform: Platform.OS === 'ios' ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [],
              }}
              thumbColor="white"
              trackColor={{ false: 'null', true: 'rgb(48, 209, 88)' }}
              value={autoSyncCompletedSits}
            />
          </TouchableOpacity>
        </>
      )}
    </>
  )
}

function prettyPhoneNumber(phoneNumber: string) {
  return `${phoneNumber.slice(0, -10)} ${phoneNumber.slice(-10, -7)}-${phoneNumber.slice(-7, -4)}-${phoneNumber.slice(
    -4,
  )}`
}

export default LoggedIn
