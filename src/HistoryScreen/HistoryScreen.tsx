import React from 'react';

import BackButton from '../BackButton';
import {Props} from '../reducer';
import TitleBar from '../TitleBar';
import BarView from './BarView';
import Calendar from './Calendar';
import CurrentStreaks from './CurrentStreaks';
import ListView from './ListView';
import ViewControl from './ViewControl';

const HistoryScreen = (props: Props) => (
  <>
    <TitleBar name="HISTORY" />

    <CurrentStreaks {...props} />

    <ViewControl
      toggleView={index => props.setState({historyViewIndex: index})}
      viewIndex={props.historyViewIndex}
    />

    {props.historyViewIndex === 0 && <BarView {...props} />}
    {props.historyViewIndex === 1 && <Calendar {...props} />}
    {props.historyViewIndex === 2 && <ListView {...props} />}

    <BackButton saveSpace />
  </>
);
HistoryScreen.paddingHorizontal = 2;

export default HistoryScreen;
