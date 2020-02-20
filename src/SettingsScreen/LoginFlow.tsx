import React, { useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'

import { Props } from '../reducer'
import EnterPhone from './EnterPhone'
import EnterVerificationCode from './EnterVerificationCode'

const LoginFlow = (props: Props) => {
  const [confirmation, setConfirmation] = useState()
  const [unverifiedPhone, setUnverifiedPhone] = useState()
  const [beganFlow, setBeganFlow] = useState()

  return (
    <>
      {!beganFlow ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setBeganFlow(true)}
          style={{
            alignItems: 'center',
            borderColor: '#5594fa',
            borderRadius: 5,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: 15,
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}
        >
          <Entypo color="#fffa" name="login" size={16} style={{ paddingRight: 10, top: 1 }} />
          <Text style={{ color: '#fff9', fontSize: 16 }}>Requires Login</Text>
        </TouchableOpacity>
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
    </>
  )
}

export default LoginFlow
