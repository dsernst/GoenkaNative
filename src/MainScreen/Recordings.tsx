import {startCase, trimStart} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {SoundPlus, load} from '../clips';
import {Props} from '../reducer';
import pressPlay from './press-play';

type Metadata = {
  data: Recording[];
  for_new_students?: boolean;
  title: string;
}[];

export type Recording = {
  description?: string;
  display_name?: string;
  duration: string;
  filename: string;
  iIndex: number;
  sIndex: number;
  sound?: SoundPlus;
  status?: 'loading' | 'ready';
};

// const domain = 'http://localhost:8000'
const domain = 'http://dsernst.com/goenka_recordings';

const languages = ['English', 'Hindi'];

export default function Recordings(props: Props) {
  const [metadata, setMetadata] = useState<Metadata>();
  const [langIndex, setLangIndex] = useState(0);
  const [loading_error, setLoadingError] = useState<string>();

  useEffect(() => {
    fetch(`${domain}/${languages[langIndex].toLowerCase()}/all.json`, {
      headers: {'Cache-Control': 'no-cache, must-revalidate'},
    })
      .then(resp => resp.json())
      // Add indices so we can modify metadata onPress
      .then((json: Metadata) =>
        json.map((section, sIndex) => ({
          ...section,
          data: section.data.map((item, iIndex) => ({...item, iIndex, sIndex})),
        })),
      )
      // Filter out old student content
      .then(json =>
        json.filter(section => section.for_new_students || props.isOldStudent),
      )
      .then(setMetadata)
      .catch(error => setLoadingError(error.toString()));
  }, [langIndex, props.isOldStudent]);

  return (
    <>
      {!metadata ? (
        loading_error && (
          <View style={{padding: 20}}>
            <Text style={{color: '#fff9', fontWeight: '600'}}>
              Unable to download list of Recordings
            </Text>
            <Text style={{color: '#fff9', top: 15}}>{loading_error}</Text>
          </View>
        )
      ) : (
        <>
          {/* Language picker */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              setLangIndex(langIndex + 1 < languages.length ? langIndex + 1 : 0)
            }
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              borderColor: '#fff1',
              borderRadius: 4,
              borderWidth: 1,
              flexDirection: 'row',
              padding: 10,
              paddingVertical: 5,
              width: 160,
            }}>
            <SimpleLineIcons color="#fff3" name="globe" size={13} />
            <Text style={{color: '#fff7', fontSize: 13, paddingLeft: 8}}>
              <Text style={{opacity: 0.6}}>Language: &nbsp; </Text>
              {languages[langIndex]}
            </Text>
          </TouchableOpacity>

          {/* Recordings list */}
          <SectionList
            indicatorStyle="white"
            keyExtractor={item => item.filename}
            renderItem={({item}) => (
              <TouchableOpacity
                key={item.filename}
                onPress={() => {
                  if (!item.status) {
                    // Begin download
                    const path = `${languages[langIndex].toLowerCase()}/${
                      item.filename
                    }`;
                    console.log('⬇️  Downloading', path);
                    metadata[item.sIndex].data[item.iIndex].status = 'loading';
                    setMetadata([...metadata]);

                    load(`${domain}/${path}`, 0, 1, true, sound => {
                      // Download complete
                      console.log('✅', path, 'downloaded.');
                      metadata[item.sIndex].data[item.iIndex].status = 'ready';
                      metadata[item.sIndex].data[item.iIndex].sound = sound;
                      setMetadata([...metadata]);
                    });
                  }

                  // File ready for playback
                  if (item.sound) {
                    pressPlay(props, item);
                  }
                }}
                style={{
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                  marginVertical: 10,
                }}>
                {/* Icon */}
                <View style={{height: 22, paddingLeft: 4}}>
                  {!item.status && (
                    <SimpleLineIcons
                      color="#fff9"
                      name="cloud-download"
                      size={20}
                    />
                  )}
                  {item.status === 'loading' && (
                    <ActivityIndicator color="#fffe" />
                  )}
                  {item.status === 'ready' && (
                    <AntDesign color="#fff9" name="playcircleo" size={20} />
                  )}
                </View>

                {/* File info */}
                <View style={{left: 10, paddingRight: 40}}>
                  <View style={{alignItems: 'flex-end', flexDirection: 'row'}}>
                    {/* Location */}
                    <Text
                      style={{color: '#fffa', fontSize: 16, fontWeight: '600'}}>
                      {item.display_name ||
                        startCase(
                          item.filename
                            .replace('.mp3', '') // hide .mp3 file extension
                            .replace('.mpeg', '') // hide .mpeg file extension
                            .replace(/v[0-9]+/, '') // hide version number
                            .replace('long_instructions', '') // hide recording type
                            .replace('anapana', ''), // hide recording type
                        )}
                    </Text>

                    {/* Duration */}
                    <Text style={{color: '#fffa', left: 7}}>
                      {formatDuration(item.duration)}
                    </Text>
                  </View>
                  {/* Description */}
                  {item.description && (
                    <Text style={{color: '#fff7'}}>{item.description}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            renderSectionFooter={() => <View style={{height: 25}} />}
            renderSectionHeader={({section: {title}}) => (
              <View
                style={{
                  backgroundColor: props.backgroundColor,
                  paddingBottom: 5,
                  paddingTop: 2,
                }}>
                <Text style={{color: '#fff7', fontSize: 16}}>
                  {startCase(title)}
                </Text>
              </View>
            )}
            sections={metadata}
            style={{paddingHorizontal: 24}}
          />
        </>
      )}
    </>
  );
}

function formatDuration(duration: string) {
  const [hours, minutes] = duration.split(':').map(val => trimStart(val, '0'));
  return `${hours ? `${hours} hr` : ''} ${minutes || '0'} min`;
}
