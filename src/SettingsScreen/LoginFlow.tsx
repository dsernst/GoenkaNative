import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

import { Props } from '../reducer'
import EnterPhone from './EnterPhone'
import EnterVerificationCode from './EnterVerificationCode'

const LoginFlow = (props: Props) => {
  const { backgroundColor } = props
  const [confirmation, setConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult>()
  const [unverifiedPhone, setUnverifiedPhone] = useState<string>()

  return (
    <View style={{ borderColor: '#5594fa33', borderRadius: 8, borderWidth: 1, padding: 10 }}>
      <Text
        style={{
          alignSelf: 'center',
          backgroundColor,
          color: '#fff7',
          fontSize: 16,
          paddingHorizontal: 10,
          position: 'absolute',
          top: -9,
        }}
      >
        <Feather color="#5594faaa" name="alert-circle" size={18} />
        &nbsp; Requires Login
      </Text>
      {!confirmation ? (
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
          unverifiedPhone={unverifiedPhone!}
        />
      )}
    </View>
  )
}

export default LoginFlow
