import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../../../../utils/theme';
import PlusIcon from '../../../../assets/dashboard/plus.svg';

interface AddTokensButtonProps {
  onPress: () => void;
}

export const AddTokensButton: React.FC<AddTokensButtonProps> = ({
  onPress,
}) => {
  const colors = useColors();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            // backgroundColor: 'rgba(255, 255, 255, 0.0335)',
            // borderColor: 'hsla(0, 0.00%, 100.00%, 0.05)',
            backgroundColor: colors.surface.primary,
            borderColor:colors.border.primary
          },
        ]}
        onPress={onPress}
        activeOpacity={0.6}
      >
        <PlusIcon
          width={18}
          height={18}
          fill={''}
          stroke={colors.interactive.primary}
        />
        <Text
          style={[
            styles.buttonText,
            { color: colors.text.primary, marginLeft: 10 },
          ]}
        >
          Add Tokens
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  buttonIcon: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
