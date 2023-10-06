import React from 'react';
import {Alert, Text, TouchableOpacity} from 'react-native';

import BackButton from '../BackButton';
import {Props} from '../reducer';
import TitleBar from '../TitleBar';
import ListView from './ListView';

function MultiDeleteHistoryScreen(props: Props) {
  const {history, setState} = props;
  const numSelected = history.reduce(
    (memo, sit) => memo + Number(!!sit.selected),
    0,
  );

  return (
    <>
      <TitleBar name="MULTI DELETE" />

      <Text
        style={{
          color: '#fff9',
          marginTop: 14,
          textAlign: 'center',
        }}>
        Select multiple sits to delete at once.
      </Text>

      <TouchableOpacity
        onPress={() => {
          if (!numSelected) {
            return;
          }
          Alert.alert(
            `Are you sure you want to delete ${
              numSelected === 1 ? 'this' : 'these'
            } ${numSelected} item${numSelected === 1 ? '' : 's'}?`,
            "This can't be undone.",
            [
              {text: 'Cancel'},
              {
                onPress: () => {
                  setState({
                    history: [...history].filter(sit => !sit.selected),
                  });
                },
                style: 'destructive',
                text: 'Delete',
              },
            ],
          );
        }}
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: '#fffa',
          borderRadius: 7,
          height: 29,
          justifyContent: 'center',
          marginBottom: 20,
          marginTop: 36,
          width: 170,
        }}>
        <Text
          style={{
            color: numSelected ? '#730e0e' : '#0007',
            fontSize: 14,
            fontWeight: '600',
          }}>
          Delete {numSelected} item{numSelected === 1 ? '' : 's'}
        </Text>
      </TouchableOpacity>

      <ListView
        {...props}
        onPress={(index: number) => {
          const newHistory = [...history];
          newHistory[index].selected = !newHistory[index].selected;
          setState({history: newHistory});
        }}
      />

      <BackButton
        color="#fffa"
        onPress={() => {
          setState({
            history: [
              ...history.map(sit => {
                const newSit = {...sit};
                delete newSit.selected;
                return newSit;
              }),
            ],
            screen: 'HistoryScreen',
          });
        }}
        saveSpace
        text="Done"
      />
    </>
  );
}
MultiDeleteHistoryScreen.paddingHorizontal = 2;

export default MultiDeleteHistoryScreen;
