import React from 'react'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import TitleBar from '../TitleBar'
import CurrentStreaks from './CurrentStreaks'
import ListView from './ListView'

export default (props: Props) => {
  return (
    <>
      <TitleBar name="HISTORY" style={{ marginHorizontal: 17 }} />

      <CurrentStreaks {...props} />

      <ListView {...props} />

      <BackButton />
    </>
  )
}
