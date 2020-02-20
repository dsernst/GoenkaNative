import React, { useState } from 'react'

import { Props } from '../reducer'
import EnterPhone from './EnterPhone'
import EnterVerificationCode from './EnterVerificationCode'

const LoginFlow = (props: Props) => {
  const [confirmation, setConfirmation] = useState()
  const [unverifiedPhone, setUnverifiedPhone] = useState()

  return (
    <>
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
          unverifiedPhone={unverifiedPhone}
        />
      )}
    </>
  )
}

export default LoginFlow
