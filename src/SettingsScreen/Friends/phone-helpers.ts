export function prettyFormat(newPhoneString: string, oldPhoneString: string) {
  const sanitized = newPhoneString
    .split('')
    .filter(char => /[0-9|+| ]/.test(char)) // Only allow numbers, +, and spaces
    .join('')

  // Don't format if they included a '+' (custom country code)
  if (sanitized.includes('+')) {
    return sanitized
  }

  // If they pressed backspace, auto subtract the spaces we added
  // or let them edit normally
  if (newPhoneString.length < oldPhoneString.length) {
    if (oldPhoneString.length === 8 || oldPhoneString.length === 4) {
      if (oldPhoneString[oldPhoneString.length - 1] === ' ') {
        return newPhoneString.slice(0, -1)
      }
    }
    return sanitized
  }

  // Add a space after their 3rd and 6th number
  if (sanitized.length === 3 || sanitized.length === 7) {
    return sanitized + ' '
  }

  // Don't let them add more than 12 characters
  if (sanitized.length > 12) {
    return oldPhoneString
  }

  return sanitized
}

export function formatPhoneNumber(phoneString: string) {
  const numbersOnly = phoneString
    .split('')
    .filter(char => /[0-9]/.test(char)) // Drop non number characters
    .join('')

  if (numbersOnly.length === 10) {
    return '+1' + numbersOnly
  }
  return '+' + numbersOnly
}

export function prettyDisplayPhone(phone: string) {
  return phone.length !== 12
    ? phone
    : `${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8, 12)}`
}
