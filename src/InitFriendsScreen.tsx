import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React, {useRef, useState} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';

import BackButton from './BackButton';
import {Props} from './reducer';
import EnterPhone from './SettingsScreen/EnterPhone';
import EnterVerificationCode from './SettingsScreen/EnterVerificationCode';
import EnableNotificationPermissions from './SettingsScreen/Friends/EnableNotificationPermissions';
import SetDisplayName from './SettingsScreen/Friends/SetDisplayName';
import TitleBar from './TitleBar';

function InitFriendsScreen(props: Props) {
  const {displayName, notifications_allowed, setState, user} = props;

  if (notifications_allowed) {
    setState({screen: 'MainScreen'});
  }

  const [confirmation, setConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult>();
  const [unverifiedPhone, setUnverifiedPhone] = useState<string>();

  const scrollView = useRef<ScrollView>(null);
  const scrollToEnd = () =>
    setTimeout(() => scrollView.current!.scrollToEnd(), 250);

  return (
    <>
      <TitleBar name="ADDING FRIENDS" style={{marginBottom: 1}} />

      <ScrollView
        indicatorStyle="white"
        ref={scrollView}
        style={{paddingHorizontal: 25, paddingTop: 27}}>
        <Text style={{color: '#fffc', fontSize: 18}}>
          Sometimes meditation can feel a bit isolating, so GoenkaTimer lets you{' '}
          <Text style={{color: '#fff', fontWeight: '600'}}>add friends</Text> to
          automatically share when you complete sits:
        </Text>
        <Image
          source={require('./friend_notif_example.png')}
          style={{
            height: 120,
            marginVertical: 5,
            resizeMode: 'contain',
            width: '100%',
          }}
        />
        <Text style={{color: '#fffc', fontSize: 17}}>
          To become Friendable, you just need to login with your phone number &
          pick a display name.
          {'\n'}
          <Text style={{fontSize: 14, opacity: 0.5}}>
            It takes less than a minute.
          </Text>
        </Text>

        <Text
          style={{
            color: '#fff6',
            fontSize: 14,
            fontStyle: 'italic',
            fontWeight: '600',
            marginTop: 30,
          }}>
          Step {!user ? 1 : !displayName ? 2 : 3} of 3:
        </Text>

        {!user ? (
          !confirmation ? (
            <EnterPhone
              onFocus={scrollToEnd}
              setConfirmation={setConfirmation}
              setUnverifiedPhone={setUnverifiedPhone}
              unverifiedPhone={unverifiedPhone}
            />
          ) : (
            <EnterVerificationCode
              {...props}
              confirmation={confirmation}
              onFocus={scrollToEnd}
              setConfirmation={setConfirmation}
              unverifiedPhone={unverifiedPhone!}
            />
          )
        ) : !displayName ? (
          <SetDisplayName {...props} noBorder />
        ) : (
          <EnableNotificationPermissions {...props} style={{marginTop: 30}} />
        )}

        <View style={{height: 210}} />
      </ScrollView>

      <BackButton saveSpace text="Skip" />
    </>
  );
}

InitFriendsScreen.paddingHorizontal = 2;

export default InitFriendsScreen;
