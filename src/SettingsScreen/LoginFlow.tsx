import React, { useState } from 'react'
import { Text, View } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

import { Props } from '../reducer'
import EnterPhone from './EnterPhone'
import EnterVerificationCode from './EnterVerificationCode'

const LoginFlow = (props: Props) => {
  const [confirmation, setConfirmation] = useState()
  const [unverifiedPhone, setUnverifiedPhone] = useState()

  return (
    <>
      {!confirmation ? (
        <>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 5,
            }}
          >
            <Feather color="#5594faaa" name="alert-circle" size={18} style={{ paddingRight: 10 }} />
            <Text style={{ color: '#fff7', fontSize: 16 }}>Requires Login</Text>
          </View>
          <EnterPhone
            setConfirmation={setConfirmation}
            setUnverifiedPhone={setUnverifiedPhone}
            unverifiedPhone={unverifiedPhone}
          />
        </>
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
