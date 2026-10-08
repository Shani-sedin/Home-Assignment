import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../auth/AuthContext';
import { colors as COLORS } from '../../theme/colors';

export const NotSupportedScreen = () => {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.icon}>
            <Text style={styles.iconText}>!</Text>
          </View>
          <Text style={styles.eyebrow}>ACCOUNT ACCESS</Text>
          <Text style={styles.title}>Not enrolled yet</Text>
          <Text style={styles.subtitle}>
            This account doesn’t currently have access to the developer
            console.
          </Text>
        </View>

        <View style={styles.accountCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.email?.[0] ?? '?').toUpperCase()}
            </Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.caption}>SIGNED IN AS</Text>
            <Text style={styles.email} numberOfLines={2}>
              {user?.email ?? 'Unknown account'}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Need access?</Text>
          <Text style={styles.infoText}>
            Sign out and switch to an account that is enrolled as a developer.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={signOut}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 32,
    paddingBottom: 36,
    gap: 16,
  },
  hero: {
    marginBottom: 8,
  },
  icon: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accentSoft,
    borderRadius: 18,
    marginBottom: 22,
  },
  iconText: {
    color: COLORS.accent,
    fontSize: 27,
    fontWeight: '800',
  },
  eyebrow: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginBottom: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 17,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accentSoft,
    borderRadius: 15,
  },
  avatarText: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  accountInfo: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  caption: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  email: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderRadius: 17,
    borderWidth: 1,
    padding: 18,
    gap: 7,
  },
  infoTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  infoText: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    borderRadius: 13,
    marginTop: 4,
  },
  buttonPressed: {
    backgroundColor: COLORS.accentDark,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: '700',
  },
});
