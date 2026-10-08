import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../navigation/navigationRef';
import { colors } from '../../theme/colors';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NotificationDetails'
>;

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <View style={styles.detailCard}>
    <Text style={styles.label}>{label}</Text>
    <Text selectable style={styles.value}>
      {value || 'Not provided'}
    </Text>
  </View>
);

export const NotificationDetailsScreen = ({
  route,
}: Props) => {
  const notification = route.params?.notification;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>N</Text>
          </View>
          <Text style={styles.eyebrow}>PUSH NOTIFICATION</Text>
          <Text style={styles.title}>Message details</Text>
          <Text style={styles.subtitle}>
            Review the content and data sent with this notification.
          </Text>
        </View>

        <DetailRow label="Title" value={notification?.title} />
        <DetailRow label="Message" value={notification?.body} />
        <DetailRow label="Deep link" value={notification?.deeplink} />
        <DetailRow label="Notification ID" value={notification?.id} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    padding: 20,
    paddingTop: 28,
    paddingBottom: 36,
    gap: 12,
  },
  hero: {
    marginBottom: 8,
  },
  icon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 16,
    marginBottom: 20,
  },
  iconText: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: '800',
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginBottom: 7,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
});
