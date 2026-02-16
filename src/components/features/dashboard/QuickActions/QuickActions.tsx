import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../../../../utils/theme';
import { QuickActionsProps } from '../../../../utils/types/dashboard.types';
import SendIcon from '../../../../assets/dashboard/send.svg';
import ReceiveIcon from '../../../../assets/dashboard/receive.svg';

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionPress,
}) => {
  const colors = useColors();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {actions.map(action => {
        const IconComponent =
          action.id === 'send'
            ? SendIcon
            : action.id === 'receive'
            ? ReceiveIcon
            : null;
        return (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionButton,
              {
                backgroundColor: 'rgba(255, 255, 255, 0.0335)',
                borderColor: 'rgba(255,255,255,0.05)',
              },
            ]}
            onPress={() => onActionPress(action.action)}
            disabled={!action.enabled}
            activeOpacity={0.6}
          >
            {IconComponent ? (
              <IconComponent
                width={22}
                height={22}
                fill={'none'}
                stroke={colors.interactive.accent}
              />
            ) : (
              <Text
                style={[styles.fallbackIcon, { color: colors.text.primary }]}
              >
                {action.icon}
              </Text>
            )}
            <Text
              style={[
                styles.actionTitle,
                {
                  color: colors.text.primary,
                },
              ]}
            >
              {action.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    // subtle depth
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fallbackIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 8,
  },
});
