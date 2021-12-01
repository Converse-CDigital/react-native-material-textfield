import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Animated, Tex, Platformt } from 'react-native';

import styles from './styles';

export default class Helper extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    error: PropTypes.string,

    disabled: PropTypes.bool,

    style: PropTypes.object,
    helperStyle: PropTypes.object,

    baseColor: PropTypes.string,
    errorColor: PropTypes.string,

    focusAnimation: PropTypes.instanceOf(Animated.Value),
  };

  constructor(props) {
    super(props);

    let { error, focusAnimation } = this.props;

    let opacity = focusAnimation.interpolate({
      inputRange: [-1, -0.5, 0],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp',
    });

    this.state = {
      errored: !!error,
      opacity,
    };
  }

  componentDidMount() {
    let { focusAnimation } = this.props;

    this.listener = focusAnimation
      .addListener(this.onAnimation.bind(this));
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (Platform.OS === 'android') {
      if (nextProps.error && nextProps.error !== this.props.error) {
        this.onAnimation({value: 0})
      } else if(!nextProps.error) {
        this.onAnimation({value: 1})

      }
    }
  }

  componentWillUnmount() {
    let { focusAnimation } = this.props;

    focusAnimation.removeListener(this.listener);
  }

  onAnimation({ value }) {
    if (this.animationValue > -0.5 && value <= -0.5) {
      this.setState({ errored: true });
    }

    if (this.animationValue < -0.5 && value >= -0.5) {
      this.setState({ errored: false });
    }

    this.animationValue = value;
  }

  render() {
    let { errored, opacity } = this.state;
    let {
      style,
      title,
      error,
      disabled,
      baseColor,
      errorColor,
      helperStyle
    } = this.props;

    let text = errored?
      error:
      title;

    if (null == text) {
      return null;
    }

    let textStyle = {
      opacity,

      color: !disabled && errored?
        errorColor:
        baseColor,
    };

    return (
      <Animated.Text style={[styles.text, style, textStyle, helperStyle]}>
        {text}
      </Animated.Text>
    );
  }
}
