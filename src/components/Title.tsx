import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {theme} from '../Theme';

interface IProps {
  children: string;
}

const Title = ({children}: IProps) => {
  return <Text style={styles.title}>{children ?? ''}</Text>;
};

const styles = StyleSheet.create({
  title: {
    color: theme.colors.dark,
    fontWeight: 'bold',
    fontSize: theme.sizes.big,
    textAlign: 'center',
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit,
    fontFamily: theme.fonts.bold,
  },
});

export default Title;
