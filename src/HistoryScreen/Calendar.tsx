import dayjs, {Dayjs} from 'dayjs';
import _ from 'lodash';
import React, {useState} from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {Props} from '../reducer';

const cachedGroupBy = _.memoize(_.groupBy);

type State = {month: Dayjs; selected: Dayjs | null};

function Calendar(props: Props) {
  const [{month, selected}, setThisState] = useState<State>({
    month: dayjs(),
    selected: dayjs(),
  });

  let counter = 1;
  const now = dayjs();

  const firstDayOfMonth = month.startOf('month');
  const daysInMonth = month.daysInMonth();
  const weeksInMonth = Math.ceil(daysInMonth / 7);
  const inCurrMonth = month.isSame(now, 'month');
  const YYYYdashMM = month.format('YYYY-MM');

  const sitsByDate = cachedGroupBy(props.history, sit =>
    dayjs(sit.date).format('YYYY-MM-DD'),
  );

  const selectedSits =
    selected && sitsByDate[selected.format('YYYY-MM-DD')]?.slice();
  const selectedIsFuture = selected?.isAfter(now, 'day');
  const selectedIsToday = selected?.isSame(now, 'day');

  // Calc height for Details ScrollView
  const detailsYPos = 472;
  const backButtonHeight = 83;
  const safeHeight =
    Dimensions.get('window').height -
    props.safeAreaInsetTop -
    props.safeAreaInsetBottom;
  const detailsHeight = safeHeight - detailsYPos - backButtonHeight;

  return (
    <View style={{marginHorizontal: 25}}>
      {/* Month selector */}
      <View
        style={{
          alignItems: 'center',
          borderBottomColor: '#fff2',
          borderBottomWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 3,
        }}>
        <TouchableOpacity
          onPress={() =>
            setThisState({month: month.subtract(1, 'month'), selected: null})
          }
          style={{
            borderColor: 'red',
            borderWidth: 0,
            paddingRight: 15,
            paddingVertical: 5,
          }}>
          <EvilIcons color="#fff6" name="chevron-left" size={29} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setThisState({month: now, selected: now})}
          style={{
            borderColor: 'red',
            borderWidth: 0,
            paddingHorizontal: 20,
            paddingVertical: 5,
          }}>
          <Text style={{color: '#fffb', fontSize: 16, textAlign: 'center'}}>
            {month.format('MMMM YYYY')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={inCurrMonth}
          onPress={() =>
            setThisState({month: month.add(1, 'month'), selected: null})
          }
          style={{
            borderColor: 'red',
            borderWidth: 0,
            opacity: inCurrMonth ? 0 : 1,
            paddingLeft: 15,
            paddingVertical: 5,
          }}>
          <EvilIcons color="#fff6" name="chevron-right" size={29} />
        </TouchableOpacity>
      </View>

      {/* Header Row: days of week */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: 10,
        }}>
        {'SMTWTFS'.split('').map((letter, index) => (
          <Text
            key={index}
            style={{color: '#fff6', textAlign: 'center', width: cellWidth}}>
            {letter}
          </Text>
        ))}
      </View>

      {/* Days grid */}
      {_.range(0, weeksInMonth).map(wk => (
        <View
          key={wk}
          style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          {/* For each week: */}
          {_.range(0, 7).map(position => {
            const key = `${wk}${position}`;
            if (
              counter === 1 &&
              position < Number(firstDayOfMonth.format('d'))
            ) {
              return <EmptyCell key={key} />; // Before the 1st of the month
            } else if (counter <= daysInMonth) {
              /* One day cell */
              const date = `${YYYYdashMM}-${
                (counter < 10 ? '0' : '') + counter
              }`;
              const sits = sitsByDate[date];
              const satAtLeastOnce = sits?.length >= 1;
              const satAtLeastTwice = sits?.length >= 2;
              const day = dayjs(date);
              const isToday = day.isSame(now, 'day');
              const isFuture = day.isAfter(now, 'day');
              const isSelected = selected && day.isSame(selected, 'day');
              return (
                <TouchableOpacity
                  activeOpacity={0.5}
                  key={key}
                  onPress={() =>
                    setThisState({month, selected: !isSelected ? day : null})
                  }
                  style={{
                    backgroundColor: isSelected ? '#aaa1' : undefined,
                    padding: cellPadding,
                  }}>
                  <View
                    style={{
                      backgroundColor: satAtLeastTwice
                        ? isSelected
                          ? '#fff5'
                          : '#fff3'
                        : undefined,
                      borderColor: '#fff6',
                      borderRadius: cellWidth,
                      borderWidth: satAtLeastOnce ? 1 : 0,
                      height: cellWidth,
                      justifyContent: 'center',
                      width: cellWidth,
                    }}>
                    <Text
                      style={{
                        color: satAtLeastOnce ? '#fffb' : '#fff9',
                        fontWeight: isToday ? '800' : '400',
                        opacity: isFuture ? 0.5 : 1,
                        textAlign: 'center',
                      }}>
                      {counter++}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            } else {
              return <EmptyCell key={key} />; // After the last day of the month
            }
          })}
        </View>
      ))}

      {/* Selected date details */}
      {selected && (
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Text
            style={{
              color: '#fff6',
              paddingLeft: 10,
              paddingTop: 2,
              width: 100,
            }}>
            {selected?.format('ddd MMM D')}
          </Text>
          <View>
            {!selectedSits ? (
              <Text
                style={{
                  color: '#fff5',
                  fontStyle: 'italic',
                  paddingLeft: 10,
                  paddingTop: 2,
                }}>
                {selectedIsFuture
                  ? 'The future is unwritten.'
                  : `No sits recorded ${
                      selectedIsToday ? 'today, yet' : 'this day'
                    }.`}
              </Text>
            ) : (
              <ScrollView
                indicatorStyle="white"
                style={{height: detailsHeight, width: 215}}>
                {selectedSits.reverse().map((i, index) => (
                  <View
                    key={index}
                    style={{flexDirection: 'row', paddingBottom: 7}}>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        marginRight: 5,
                        width: 70,
                      }}>
                      <Text
                        style={{
                          color: '#fffb',
                          fontSize: 16,
                          fontWeight: '600',
                        }}>
                        {dayjs(i.date).format('h[:]mma')}
                      </Text>
                    </View>
                    <Faded style={{alignSelf: 'flex-end'}}> for &nbsp;</Faded>
                    <Text
                      style={{
                        color: '#fffb',
                        fontSize: 16,
                        fontWeight: '600',
                      }}>
                      {i.elapsed < i.duration && i.elapsed + ' of '}
                      {i.duration} min
                    </Text>
                  </View>
                ))}

                {/* Only one sit message */}
                {selectedSits.length === 1 && (
                  <Text
                    style={{
                      color: '#fff5',
                      fontStyle: 'italic',
                      marginLeft: 10,
                      marginTop: 10,
                    }}>
                    Try to sit twice per day, even if only for 1 minute.
                    &nbsp;&nbsp;
                    <Text style={{color: '#fff9'}}>ツ</Text>
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const cellWidth = 30;
const cellPadding = 4;

const EmptyCell = () => <View style={{width: cellWidth + 2 * cellPadding}} />;
const Faded = (props: any) => (
  <Text
    {...props}
    style={{color: '#fff8', fontWeight: '400', ...props.style}}
  />
);

export default Calendar;
