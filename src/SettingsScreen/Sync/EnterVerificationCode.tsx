import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React, { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

const EnterPhone = ({
  confirmation,
  setConfirmation,
  unverifiedPhone,
}: {
  confirmation: FirebaseAuthTypes.ConfirmationResult
  setConfirmation: React.Dispatch<undefined>
  unverifiedPhone: string
}) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState()
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    async function submit() {
      setSubmitting(true)
      try {
        await confirmation.confirm(code)
      } catch (err) {
        setSubmitting(false)
        console.log(err.toString())
        return setError(err.toString())
      }
      setConfirmation(undefined)
    }
    if (code.length === 6) {
      submit()
    }
  }, [confirmation, code, setConfirmation])

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
        onChangeText={val => {
          setError(undefined)
          setCode(val)
        }}
        placeholder="123456"
        placeholderTextColor="#fff5"
        style={{
          backgroundColor: '#353d38',
          borderRadius: 7,
          color: '#fffd',
          fontSize: 18,
          marginTop: 15,
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
            color: '#f00d',
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

export default EnterPhone
