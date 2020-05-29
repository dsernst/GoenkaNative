import { startCase, trimStart } from 'lodash'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

type Metadata = {
  description?: string
  duration: string
  filename: string
}

const domain = 'http://dsernst.com/goenka_recordings'

export default function Recordings() {
  const [metadata, setMetadata] = useState<Metadata[]>()

  useEffect(() => {
    fetch(`${domain}/english.json`)
      .then(resp => resp.json())
      .then(setMetadata)
  }, [])

  return (
    <ScrollView>
      {!metadata ? (
        <Text style={{ color: '#fffa' }}>Loading...</Text>
      ) : (
        <>
          <Text style={{ color: '#fff7', fontSize: 16 }}>Longer Instructions</Text>

          {metadata.map(entry => (
            <View style={{ flexDirection: 'row', marginVertical: 15 }}>
              {/* Play icon */}
              <AntDesign color="#fff9" name="playcircleo" size={20} style={{ marginRight: 10 }} />

              <View style={{ paddingRight: 40 }}>
                <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
                  {/* Location */}
                  <Text style={{ color: '#fffa', fontSize: 16, fontWeight: '600' }}>
                    {startCase(entry.filename.slice(0, -22))}
                  </Text>

                  {/* duration */}
                  <Text style={{ color: '#fffa', left: 7 }}>{formatDuration(entry.duration)}</Text>
                </View>
                {entry.description && <Text style={{ color: '#fff7' }}>{entry.description}</Text>}
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  )
}

function formatDuration(duration: string) {
  const [hours, minutes] = duration.split(':').map(val => trimStart(val, '0'))
  return `${hours} hr ${minutes} min`
}
