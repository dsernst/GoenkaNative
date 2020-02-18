// React-Native Android doesn't support contentOffset prop
// (see: https://github.com/facebook/react-native/issues/6849)
//
// So this component waits until after render, calls scrollTo(props.contentOffset), then makes itself visible
//
// Also adds a new prop — `startAtEnd (boolean, default: false)` — to set the initial scroll position to the end.
// Note: `startAtEnd` overrides the `contentOffset` prop.
//
// Supports all other props from the default ScrollView.
//
// Use this component in place of ScrollView for cross-compatibility.
//

import React, { MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'
import { InteractionManager, ScrollView, ScrollViewProps, View } from 'react-native'

function ScrollViewOffset(props: ScrollViewProps & { children: ReactNode; startAtEnd: boolean }) {
  const scrollViewRef: MutableRefObject<ScrollView | null> = useRef(null)
  const [opacity, setOpacity] = useState(0)

  // Scroll to end after init render
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (props.startAtEnd) {
        scrollViewRef.current!.scrollToEnd({ animated: false })
      } else if (props.contentOffset) {
        scrollViewRef.current!.scrollTo({ ...props.contentOffset, animated: false })
      }

      // Then make visible, to avoid jumping
      setTimeout(() => {
        setOpacity(1)
      }, 1)
    })
  }, [props.contentOffset, props.startAtEnd])

  return (
    <View style={{ opacity }}>
      <ScrollView {...props} ref={scrollViewRef} />
    </View>
  )
}

export default ScrollViewOffset
