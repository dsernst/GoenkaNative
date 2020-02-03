import React, { memo } from 'react'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import TitleBar from '../TitleBar'
import Calendar from './Calendar'
import CurrentStreaks from './CurrentStreaks'
import ListView from './ListView'
import ViewControl from './ViewControl'

const HistoryScreen = (props: Props) => (
  <>
    <TitleBar name="HISTORY" style={{ marginHorizontal: 17 }} />

    <CurrentStreaks {...props} />

    <ViewControl
      toggleView={() => props.setState({ historyViewIndex: Number(!props.historyViewIndex) })}
      viewIndex={props.historyViewIndex}
    />

    {props.historyViewIndex === 0 ? <Calendar {...props} /> : <ListView {...props} />}

    <BackButton saveSpace />
  </>
)

export default memo(HistoryScreen)
