import { startCase, trimStart } from 'lodash'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Sound from 'react-native-sound'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

type Metadata = {
  description?: string
  duration: string
  filename: string
  sound?: Sound
  status?: 'loading' | 'ready'
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

          {/* List each item */}
          {metadata.map((entry, index) => (
            <TouchableOpacity
              key={entry.filename}
              onPress={() => {
                if (!entry.status) {
                  // Begin download
                  console.log('Downloading', entry.filename)
                  metadata[index].status = 'loading'
                  setMetadata([...metadata])

                  const sound = new Sound(`${domain}/english/${entry.filename}`, undefined, (error: any) => {
                    if (error) {
                      console.log('failed to load the sound', entry.filename, error)
                    } else {
                      // Download complete
                      console.log(entry.filename, 'downloaded.')
                      metadata[index].status = 'ready'
                      metadata[index].sound = sound
                      setMetadata([...metadata])
                    }
                  })
                }

                // File ready for playback
                if (entry.sound) {
                  entry.sound.play()
                }
              }}
              style={{ alignItems: 'flex-start', flexDirection: 'row', marginVertical: 15 }}
            >
              {/* Icon */}
              {!entry.status && <SimpleLineIcons color="#fff9" name="cloud-download" size={20} />}
              {entry.status === 'loading' && <ActivityIndicator color="#fffe" />}
              {entry.status === 'ready' && <AntDesign color="#fff9" name="playcircleo" size={20} />}

              {/* File info */}
              <View style={{ left: 10, paddingRight: 40 }}>
                <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
                  {/* Location */}
                  <Text style={{ color: '#fffa', fontSize: 16, fontWeight: '600' }}>
                    {startCase(entry.filename.slice(0, -22))}
                  </Text>

                  {/* Duration */}
                  <Text style={{ color: '#fffa', left: 7 }}>{formatDuration(entry.duration)}</Text>
                </View>
                {/* Description */}
                {entry.description && <Text style={{ color: '#fff7' }}>{entry.description}</Text>}
              </View>
            </TouchableOpacity>
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
