import React from 'react'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import TitleBar from '../TitleBar'
import CurrentStreaks from './CurrentStreaks'
import ListView from './ListView'
import ViewControl from './ViewControl'

export default (props: Props) => (
  <>
    <TitleBar name="HISTORY" style={{ marginHorizontal: 17 }} />

    <CurrentStreaks {...props} />

    <ViewControl
      toggleView={() => props.setState({ historyViewIndex: Number(!props.historyViewIndex) })}
      viewIndex={props.historyViewIndex}
    />

    {props.historyViewIndex === 0 && <ListView {...props} />}

    <BackButton />
  </>
)
