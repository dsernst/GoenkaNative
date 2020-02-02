import React, { Component } from 'react'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import TitleBar from '../TitleBar'
import DailyNotificationSettings from './DailyNotifications'
import MoreInfoSection from './MoreInfo'

class SettingsScreen extends Component<Props> {
  render() {
    return (
      <>
        <TitleBar name="SETTINGS" showVersion />

        <DailyNotificationSettings {...this.props} />

        <MoreInfoSection />

        <BackButton />
      </>
    )
  }
}

export default SettingsScreen
