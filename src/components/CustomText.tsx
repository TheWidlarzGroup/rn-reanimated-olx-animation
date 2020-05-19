import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {theme} from '../Theme';

interface IProps {
  children: string;
}

const CustomText = ({children}: IProps) => {
  return <Text style={styles.customText}>{children ?? ''}</Text>;
};

const styles = StyleSheet.create({
  customText: {
    color: theme.colors.grey,
    fontWeight: '400',
    fontSize: theme.sizes.medium,
    textAlign: 'center',
    marginBottom: theme.spacing.unit * 2,
    paddingHorizontal: theme.spacing.unit,
    fontFamily: theme.fonts.primary,
  },
});

export default CustomText;
