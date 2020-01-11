// Forked from https://github.com/MrToph/react-native-countdown-circle/tree/aaeec3dbcabd865e511bff0ed3eeedc3cb199857

import React from 'react'
import { Animated, Easing, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  halfCircle: {
    backgroundColor: '#f00',
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  innerCircle: {
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  leftWrap: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  outerCircle: {
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    justifyContent: 'center',
    overflow: 'hidden',
  },
})

function calcInterpolationValuesForHalfCircle1(
  animatedValue: any,
  { shadowColor }: { shadowColor: string },
) {
  const rotate = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: ['0deg', '180deg', '180deg', '180deg'],
  })

  const backgroundColor = shadowColor
  return { backgroundColor, rotate }
}

function calcInterpolationValuesForHalfCircle2(
  animatedValue: any,
  { color, shadowColor }: { color: string; shadowColor: string },
) {
  const rotate = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: ['0deg', '0deg', '180deg', '360deg'],
  })

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 50, 50, 100],
    outputRange: [color, color, shadowColor, shadowColor],
  })
  return { backgroundColor, rotate }
}

function getInitialState(props: any) {
  const circleProgress = new Animated.Value(0)
  return {
    circleProgress,
    elapsed: 0,
    interpolationValuesHalfCircle1: calcInterpolationValuesForHalfCircle1(circleProgress, props),
    interpolationValuesHalfCircle2: calcInterpolationValuesForHalfCircle2(circleProgress, props),
    text: props.updateText(0, props.duration),
  }
}

type PropTypes = {
  bgColor: string
  borderWidth: number
  color: string
  containerStyle: ViewStyle
  duration: number
  labelStyle: TextStyle
  minutes: boolean
  onTimeElapsed: () => void
  radius: number
  shadowColor: string
  textStyle: TextStyle
  updateText: (elapsed: number, total: number) => string
}

export default class PercentageCircle extends React.PureComponent<PropTypes, any> {
  static defaultProps = {
    bgColor: '#e9e9ef',
    borderWidth: 2,
    children: null,
    color: '#f00',
    containerStyle: null,
    duration: 10,
    minutes: false,
    onTimeElapsed: () => null,
    shadowColor: '#999',
    textStyle: null,
    updateText: (elapsed: number, total: number) => (total - elapsed).toString(),
  }

  constructor(props: any) {
    super(props)

    this.state = getInitialState(props)
    this.restartAnimation()
  }

  UNNSAFE_componentWillReceiveProps(nextProps: any) {
    if (this.props.duration !== nextProps.duration) {
      this.state.circleProgress.stopAnimation()
      this.setState(getInitialState(nextProps), this.restartAnimation)
    }
  }

  onCircleAnimated = ({ finished }: { finished: boolean }) => {
    // if animation was interrupted by stopAnimation don't restart it.
    if (!finished) {
      return
    }

    const elapsed = this.state.elapsed + 1
    const callback =
      elapsed < this.props.duration ? this.restartAnimation : this.props.onTimeElapsed
    const updatedText = this.props.updateText(elapsed, this.props.duration)
    this.setState(
      {
        ...getInitialState(this.props),
        elapsed,
        text: updatedText,
      },
      callback,
    )
  }

  restartAnimation = () => {
    this.state.circleProgress.stopAnimation()
    Animated.timing(this.state.circleProgress, {
      duration: 1000 * (this.props.minutes ? 60 : 1),
      easing: Easing.linear,
      toValue: 100,
    }).start(this.onCircleAnimated)
  }

  renderHalfCircle({ rotate, backgroundColor }: { backgroundColor: string; rotate: any }) {
    const { radius } = this.props

    return (
      <View
        style={[
          styles.leftWrap,
          {
            height: radius * 2,
            width: radius,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.halfCircle,
            {
              backgroundColor,
              borderRadius: radius,
              height: radius * 2,
              transform: [{ translateX: radius / 2 }, { rotate }, { translateX: -radius / 2 }],
              width: radius,
            },
          ]}
        />
      </View>
    )
  }

  renderInnerCircle() {
    const radiusMinusBorder = this.props.radius - this.props.borderWidth
    return (
      <View
        style={[
          styles.innerCircle,
          {
            backgroundColor: this.props.bgColor,
            borderRadius: radiusMinusBorder,
            height: radiusMinusBorder * 2,
            width: radiusMinusBorder * 2,
            ...this.props.containerStyle,
          },
        ]}
      >
        <Text style={this.props.textStyle}>{this.state.text}</Text>
        <Text style={this.props.labelStyle}>{this.props.minutes ? 'min' : 'sec'}</Text>
      </View>
    )
  }

  render() {
    const { interpolationValuesHalfCircle1, interpolationValuesHalfCircle2 } = this.state
    return (
      <View
        style={[
          styles.outerCircle,
          {
            backgroundColor: this.props.color,
            borderRadius: this.props.radius,
            height: this.props.radius * 2,
            width: this.props.radius * 2,
          },
        ]}
      >
        {this.renderHalfCircle(interpolationValuesHalfCircle1)}
        {this.renderHalfCircle(interpolationValuesHalfCircle2)}
        {this.renderInnerCircle()}
      </View>
    )
  }
}
