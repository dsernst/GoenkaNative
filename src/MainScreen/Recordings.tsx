import { startCase, trimStart } from 'lodash'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, SectionList, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

import { SoundPlus, load } from '../clips'
import { Props } from '../reducer'
import pressPlay from './press-play'

type Metadata = { data: Recording[]; title: string }[]

export type Recording = {
  description?: string
  display_name?: string
  duration: string
  filename: string
  iIndex: number
  sIndex: number
  sound?: SoundPlus
  status?: 'loading' | 'ready'
}

// const domain = 'http://localhost:8000'
const domain = 'http://dsernst.com/goenka_recordings'

export default function Recordings(props: Props) {
  const [metadata, setMetadata] = useState<Metadata>()

  useEffect(() => {
    fetch(`${domain}/english.json`, { headers: { 'Cache-Control': 'no-cache, must-revalidate' } })
      .then(resp => resp.json())
      // Add indices so we can modify metadata onPress
      .then((json: Metadata) =>
        json.map((section, sIndex) => ({
          ...section,
          data: section.data.map((item, iIndex) => ({ ...item, iIndex, sIndex })),
        })),
      )
      .then(setMetadata)
  }, [])

  return (
    <>
      {!metadata ? (
        <Text style={{ color: '#fff0' }}>Loading...</Text>
      ) : (
        <SectionList
          indicatorStyle="white"
          keyExtractor={item => item.filename}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.filename}
              onPress={() => {
                if (!item.status) {
                  // Begin download
                  console.log('⬇️  Downloading', item.filename)
                  metadata[item.sIndex].data[item.iIndex].status = 'loading'
                  setMetadata([...metadata])

                  load(`${domain}/english/${item.filename}`, 0, 1, true, sound => {
                    // Download complete
                    console.log('✅', item.filename, 'downloaded.')
                    metadata[item.sIndex].data[item.iIndex].status = 'ready'
                    metadata[item.sIndex].data[item.iIndex].sound = sound
                    setMetadata([...metadata])
                  })
                }

                // File ready for playback
                if (item.sound) {
                  pressPlay(props, item)
                }
              }}
              style={{ alignItems: 'flex-start', flexDirection: 'row', marginVertical: 10 }}
            >
              {/* Icon */}
              {!item.status && <SimpleLineIcons color="#fff9" name="cloud-download" size={20} />}
              {item.status === 'loading' && <ActivityIndicator color="#fffe" />}
              {item.status === 'ready' && <AntDesign color="#fff9" name="playcircleo" size={20} />}

              {/* File info */}
              <View style={{ left: 10, paddingRight: 40 }}>
                <View style={{ alignItems: 'flex-end', flexDirection: 'row' }}>
                  {/* Location */}
                  <Text style={{ color: '#fffa', fontSize: 16, fontWeight: '600' }}>
                    {item.display_name ||
                      startCase(
                        item.filename
                          .replace('.mp3', '') // hide .mp3 file extension
                          .replace(/v[0-9]+/, '') // hide version number
                          .replace('long_instructions', '') // hide recording type
                          .replace('anapana', ''), // hide recording type
                      )}
                  </Text>

                  {/* Duration */}
                  <Text style={{ color: '#fffa', left: 7 }}>{formatDuration(item.duration)}</Text>
                </View>
                {/* Description */}
                {item.description && <Text style={{ color: '#fff7' }}>{item.description}</Text>}
              </View>
            </TouchableOpacity>
          )}
          renderSectionFooter={() => <View style={{ height: 25 }} />}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ backgroundColor: props.backgroundColor, paddingBottom: 5, paddingTop: 2 }}>
              <Text style={{ color: '#fff7', fontSize: 16 }}>{startCase(title)}</Text>
            </View>
          )}
          sections={metadata}
          style={{ paddingHorizontal: 24 }}
        />
      )}
    </>
  )
}

function formatDuration(duration: string) {
  const [hours, minutes] = duration.split(':').map(val => trimStart(val, '0'))
  return `${hours ? `${hours} hr` : ''} ${minutes} min`
}
