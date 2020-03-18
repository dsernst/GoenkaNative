import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

const EnterVerificationCode = ({
  confirmation,
  onFocus,
  setConfirmation,
  unverifiedPhone,
}: {
  confirmation: FirebaseAuthTypes.ConfirmationResult
  onFocus?: () => void
  setConfirmation: React.Dispatch<undefined>
  unverifiedPhone: string
}) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  return (
    <>
      <Text style={{ color: '#fff9', marginTop: 15 }}>✓ Sent 6-digit verification code to:</Text>

      <View style={{ alignSelf: 'center' }}>
        <Text style={{ alignSelf: 'center', color: '#fff9', fontStyle: 'italic', marginTop: 15 }}>
          {prettyPhoneNumber(unverifiedPhone)}
        </Text>
        <TouchableOpacity onPress={() => setConfirmation(undefined)}>
          <Text style={{ color: '#c7dcff99', textAlign: 'right' }}>edit</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ color: '#fffc', marginTop: 30 }}>Please enter code:</Text>

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus
        keyboardType="number-pad"
        onChangeText={async newVal => {
          setError(undefined)
          setCode(newVal)

          if (newVal.length === 6) {
            setSubmitting(true)
            try {
              await confirmation.confirm(newVal)
            } catch (err) {
              setSubmitting(false)
              const errMsg: string = err.toString()
              console.log(errMsg)
              return setError(errMsg.includes('invalid-verification-code') ? 'Invalid verification code' : errMsg)
            }
          }
        }}
        onFocus={() => onFocus && onFocus()}
        placeholder="123456"
        placeholderTextColor="#fff5"
        style={{
          backgroundColor: '#353d38',
          borderRadius: 7,
          color: '#fffd',
          fontSize: 18,
          marginTop: 10,
          paddingVertical: 10,
          textAlign: 'center',
        }}
        value={code}
      />

      {submitting && (
        <Text
          style={{
            color: '#fff9',
            marginTop: 14,
          }}
        >
          Submitting...
        </Text>
      )}

      {error && (
        <Text
          style={{
            color: '#ff5e5e',
            marginTop: 14,
          }}
        >
          {error}
        </Text>
      )}
    </>
  )
}

function prettyPhoneNumber(phoneNumber: string) {
  return `${phoneNumber.slice(0, -10)} ${phoneNumber.slice(-10, -7)}-${phoneNumber.slice(-7, -4)}-${phoneNumber.slice(
    -4,
  )}`
}

export default EnterVerificationCode
