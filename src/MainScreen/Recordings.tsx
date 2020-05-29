import { startCase, trimStart } from 'lodash'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

import { SoundPlus, load } from '../clips'
import { Props } from '../reducer'
import pressPlay from './press-play'

export type Recording = {
  description?: string
  duration: string
  filename: string
  sound?: SoundPlus
  status?: 'loading' | 'ready'
}

// const domain = 'http://localhost:8000'
const domain = 'http://dsernst.com/goenka_recordings'

export default function Recordings(props: Props) {
  const [metadata, setMetadata] = useState<Recording[]>()

  useEffect(() => {
    fetch(`${domain}/english.json`, { headers: { 'Cache-Control': 'no-cache, must-revalidate' } })
      .then(resp => resp.json())
      .then(setMetadata)
  }, [])

  return (
    <ScrollView>
      {!metadata ? (
        <Text style={{ color: '#fff0' }}>Loading...</Text>
      ) : (
        <>
          <Text style={{ color: '#fff7', fontSize: 16 }}>Long Instructions</Text>

          {/* List each item */}
          {metadata.map((entry, index) => (
            <TouchableOpacity
              key={entry.filename}
              onPress={() => {
                if (!entry.status) {
                  // Begin download
                  console.log('⬇️  Downloading', entry.filename)
                  metadata[index].status = 'loading'
                  setMetadata([...metadata])

                  load(`${domain}/english/${entry.filename}`, 0, 1, true, sound => {
                    // Download complete
                    console.log('✅', entry.filename, 'downloaded.')
                    metadata[index].status = 'ready'
                    metadata[index].sound = sound
                    setMetadata([...metadata])
                  })
                }

                // File ready for playback
                if (entry.sound) {
                  pressPlay(props, entry)
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
                    {startCase(
                      entry.filename
                        .replace('.mp3', '') // remove .mp3 file extension
                        .replace(/v[0-9]+/, '') // remove version number
                        .replace('long_instructions', ''), // don't show recording type
                    )}
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
