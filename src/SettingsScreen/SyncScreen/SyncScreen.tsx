import React, { useState } from 'react'
import { Text } from 'react-native'

import BackButton from '../../BackButton'
import { Props } from '../../reducer'
import TitleBar from '../../TitleBar'
import EnterPhone from './EnterPhone'
import EnterVerificationCode from './EnterVerificationCode'
import LoggedIn from './LoggedIn'

const SyncScreen = (props: Props) => {
  const [confirmation, setConfirmation] = useState()
  const [unverifiedPhone, setUnverifiedPhone] = useState()

  return (
    <>
      <TitleBar name="SYNC" />

      <Text
        style={{
          color: '#fff9',
          fontSize: 18,
          fontWeight: '600',
          marginTop: 14,
        }}
      >
        Backup your sit history
      </Text>

      {props.user ? (
        <LoggedIn {...props} user={props.user} />
      ) : !confirmation ? (
        <EnterPhone
          setConfirmation={setConfirmation}
          setUnverifiedPhone={setUnverifiedPhone}
          unverifiedPhone={unverifiedPhone}
        />
      ) : (
        <EnterVerificationCode
          {...props}
          confirmation={confirmation}
          setConfirmation={setConfirmation}
          unverifiedPhone={unverifiedPhone}
        />
      )}

      <BackButton to="SettingsScreen" />
    </>
  )
}

export default SyncScreen
