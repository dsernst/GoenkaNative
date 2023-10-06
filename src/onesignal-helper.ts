import {Platform} from 'react-native';
import OneSignal from 'react-native-onesignal';
import {Props} from './reducer';
import {ONE_SIGNAL_APP_ID} from './constants';

function init(props: Props) {
  const {setState} = props;

  OneSignal.setAppId(ONE_SIGNAL_APP_ID);
  OneSignal.setLogLevel(6, 0);
  OneSignal.promptForPushNotificationsWithUserResponse();
  OneSignal.setNotificationWillShowInForegroundHandler(notification => {
    onOpened(notification);
  });
  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    onOpened(notification);
  });
  OneSignal.addSubscriptionObserver(event => {
    if (event && event.to && event.to.userId) {
      setState({onesignal_id: event.to.userId});
    }
  });
  OneSignal.addPermissionObserver(event => {
    console.log('OneSignal: permission changed:', event);
  });

  if (Platform.OS === 'android') {
    setState({notifications_allowed: true});
  } else {
    // OneSignal.checkPermissions(osLevelPermissions => {
    //   setState({notifications_allowed: !!osLevelPermissions.alert});
    // });
  }

  return () => {
    OneSignal.clearHandlers();
  };
}

export default {init};

function onOpened(props: any) {
  const {setState} = props;
  return (openResult: any) => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);

    const body = openResult.notification.payload.body;
    if (
      body.includes('New friend request') ||
      body.includes('Go send them a friend request')
    ) {
      setState({expandFriendsSection: true, screen: 'SettingsScreen'});
    }
    if (body.includes(' just finished a ')) {
      setState({
        friendsSit:
          openResult.notification.payload.additionalData.p2p_notification,
        screen: 'FriendsSitScreen',
      });
    }
  };
}
