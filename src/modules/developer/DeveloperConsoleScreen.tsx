import React, { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';

import { useAuth } from '../auth/AuthContext';
import { useFcm } from '../notifications/useFcm';
import { triggerTestPush } from './developer.service';
import { colors as COLORS } from '../../theme/colors';

export const DeveloperConsoleScreen = () => {
    const { user, signOut } = useAuth();
    const {
        token,
        loading: fcmLoading,
        error: fcmError,
    } = useFcm();

    const [isTriggering, setIsTriggering] = useState(false);
    const [tokenCopied, setTokenCopied] = useState(false);
    const [triggerResult, setTriggerResult] = useState<{
        type: 'sending' | 'success' | 'error';
        message: string;
    } | null>(null);

    const handleTriggerTestPush = async () => {
        if (isTriggering) {
            return;
        }

        if (!token) {
            setTriggerResult({
                type: 'error',
                message: 'FCM registration token is not available.',
            });
            return;
        }

        setIsTriggering(true);
        setTriggerResult({
            type: 'sending',
            message: 'Preparing the secure request and sending your push…',
        });

        try {
            // Let React render the pending state before signing the request.
            await new Promise<void>(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => resolve());
                });
            });

            const messageId = await triggerTestPush({
                token,
                title: 'FCM Test Notification',
                body: 'This notification was triggered from Developer Console.',
                deeplink: 'fcmtest://notification/details?id=123',
                id: '123',
            });

            setTriggerResult({
                type: 'success',
                message: `Push sent successfully. Message ID: ${messageId}`,
            });
        } catch (error) {
            setTriggerResult({
                type: 'error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Failed to trigger test notification.',
            });
        } finally {
            setIsTriggering(false);
        }
    };

    const handleCopyToken = () => {
        if (!token) {
            return;
        }

        Clipboard.setString(token);
        setTokenCopied(true);
        setTimeout(() => setTokenCopied(false), 1800);
    };

    const formattedToken = token
        ? token.match(/.{1,32}/g)?.join('\u200b') ?? token
        : null;

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.intro}>
                    <View style={styles.eyebrow}>
                        <View style={styles.eyebrowDot} />
                        <Text style={styles.eyebrowText}>DEVELOPER TOOLS</Text>
                    </View>
                    <Text style={styles.title}>Push console</Text>
                    <Text style={styles.subtitle}>
                        Send and inspect a test notification on this device.
                    </Text>
                </View>

                <View style={styles.accountCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {(user?.email?.[0] ?? 'D').toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.accountDetails}>
                        <Text style={styles.caption}>SIGNED IN AS</Text>
                        <Text style={styles.accountEmail} numberOfLines={1}>
                            {user?.email ?? 'Unknown account'}
                        </Text>
                    </View>
                    <View style={styles.accountBadge}>
                        <Text style={styles.accountBadgeText}>ADMIN</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.sectionHeading}>
                        <View style={styles.sectionIcon}>
                            <Text style={styles.sectionIconText}>01</Text>
                        </View>
                        <View style={styles.sectionHeadingText}>
                            <Text style={styles.cardTitle}>Device token</Text>
                            <Text style={styles.cardSubtitle}>
                                This device’s FCM registration token
                            </Text>
                        </View>
                    </View>

                    <View style={styles.tokenBox}>
                        {fcmLoading ? (
                            <View style={styles.tokenLoading}>
                                <ActivityIndicator color={COLORS.accent} />
                                <Text style={styles.tokenPlaceholder}>
                                    Getting your device token…
                                </Text>
                            </View>
                        ) : (
                            <Text selectable style={styles.tokenText}>
                                {formattedToken ?? 'Token unavailable'}
                            </Text>
                        )}
                    </View>

                    {!!fcmError && (
                        <Text style={styles.inlineError}>{fcmError}</Text>
                    )}

                    <Pressable
                        accessibilityRole="button"
                        onPress={handleCopyToken}
                        disabled={!token || fcmLoading}
                        style={({ pressed }) => [
                            styles.secondaryButton,
                            (!token || fcmLoading) && styles.disabledButton,
                            pressed && token && styles.pressedButton,
                        ]}
                    >
                        <Text style={styles.secondaryButtonText}>
                            {tokenCopied ? 'Copied to clipboard' : 'Copy token'}
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.card}>
                    <View style={styles.sectionHeading}>
                        <View style={styles.sectionIcon}>
                            <Text style={styles.sectionIconText}>02</Text>
                        </View>
                        <View style={styles.sectionHeadingText}>
                            <Text style={styles.cardTitle}>Test delivery</Text>
                            <Text style={styles.cardSubtitle}>
                                Send a push to this device
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityState={{
                            busy: isTriggering,
                            disabled: isTriggering || !token || fcmLoading,
                        }}
                        onPress={handleTriggerTestPush}
                        disabled={isTriggering || !token || fcmLoading}
                        style={({ pressed }) => [
                            styles.primaryButton,
                            (isTriggering || !token || fcmLoading) &&
                                styles.disabledPrimaryButton,
                            pressed &&
                                !isTriggering &&
                                token &&
                                styles.pressedPrimaryButton,
                        ]}
                    >
                        {isTriggering ? (
                            <View style={styles.sendingButtonContent}>
                                <ActivityIndicator color={COLORS.surface} />
                                <Text style={styles.primaryButtonText}>
                                    Sending notification…
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.primaryButtonText}>
                                Send test notification
                            </Text>
                        )}
                    </Pressable>

                    {triggerResult && (
                        <View
                            style={[
                                styles.resultCard,
                                triggerResult.type === 'sending'
                                    ? styles.sendingCard
                                    : triggerResult.type === 'success'
                                      ? styles.successCard
                                      : styles.errorCard,
                            ]}
                        >
                            <View style={styles.resultHeading}>
                                {triggerResult.type === 'sending' && (
                                    <ActivityIndicator
                                        size="small"
                                        color={COLORS.accent}
                                    />
                                )}
                                <Text
                                    style={[
                                        styles.resultTitle,
                                        triggerResult.type === 'sending'
                                            ? styles.sendingText
                                            : triggerResult.type === 'success'
                                              ? styles.successText
                                              : styles.errorText,
                                    ]}
                                >
                                    {triggerResult.type === 'sending'
                                        ? 'Sending notification'
                                        : triggerResult.type === 'success'
                                          ? 'Notification sent'
                                          : 'Could not send notification'}
                                </Text>
                            </View>
                            <Text style={styles.resultMessage}>
                                {triggerResult.message}
                            </Text>
                        </View>
                    )}
                </View>

                <Pressable
                    accessibilityRole="button"
                    onPress={signOut}
                    style={({ pressed }) => [
                        styles.signOutButton,
                        pressed && styles.signOutPressed,
                    ]}
                >
                    <Text style={styles.signOutText}>Sign out</Text>
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
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 36,
        gap: 16,
    },
    intro: {
        marginBottom: 4,
    },
    eyebrow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    eyebrowDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.accent,
    },
    eyebrowText: {
        color: COLORS.accent,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.4,
    },
    title: {
        color: COLORS.text,
        fontSize: 30,
        fontWeight: '800',
        letterSpacing: -0.7,
    },
    subtitle: {
        color: COLORS.muted,
        fontSize: 15,
        lineHeight: 22,
        marginTop: 6,
    },
    accountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,
        gap: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: COLORS.accentSoft,
    },
    avatarText: {
        color: COLORS.accent,
        fontSize: 18,
        fontWeight: '800',
    },
    accountDetails: {
        flex: 1,
        minWidth: 0,
        gap: 4,
    },
    caption: {
        color: COLORS.muted,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    accountEmail: {
        color: COLORS.text,
        fontSize: 15,
        fontWeight: '600',
    },
    accountBadge: {
        backgroundColor: COLORS.accentSoft,
        borderRadius: 8,
        paddingHorizontal: 9,
        paddingVertical: 6,
    },
    accountBadgeText: {
        color: COLORS.accentDark,
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.6,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
        borderRadius: 18,
        borderWidth: 1,
        padding: 18,
        gap: 16,
    },
    sectionHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sectionIcon: {
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: COLORS.accentSoft,
    },
    sectionIconText: {
        color: COLORS.accent,
        fontSize: 12,
        fontWeight: '800',
    },
    sectionHeadingText: {
        flex: 1,
        gap: 3,
    },
    cardTitle: {
        color: COLORS.text,
        fontSize: 17,
        fontWeight: '700',
    },
    cardSubtitle: {
        color: COLORS.muted,
        fontSize: 13,
        lineHeight: 18,
    },
    tokenBox: {
        minHeight: 82,
        maxHeight: 140,
        justifyContent: 'center',
        backgroundColor: COLORS.surfaceMuted,
        borderColor: COLORS.border,
        borderRadius: 12,
        borderWidth: 1,
        padding: 13,
    },
    tokenText: {
        color: COLORS.tokenText,
        fontFamily: 'monospace',
        fontSize: 11,
        lineHeight: 18,
    },
    tokenLoading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    tokenPlaceholder: {
        color: COLORS.muted,
        fontSize: 13,
    },
    inlineError: {
        color: COLORS.error,
        fontSize: 13,
        lineHeight: 19,
    },
    secondaryButton: {
        minHeight: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.accent,
        borderRadius: 12,
        borderWidth: 1,
    },
    secondaryButtonText: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: '700',
    },
    disabledButton: {
        borderColor: COLORS.border,
    },
    pressedButton: {
        backgroundColor: COLORS.accentSoft,
    },
    primaryButton: {
        minHeight: 52,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.accent,
        borderRadius: 14,
        paddingHorizontal: 16,
    },
    primaryButtonText: {
        color: COLORS.surface,
        fontSize: 15,
        fontWeight: '700',
    },
    disabledPrimaryButton: {
        backgroundColor: COLORS.accentDisabled,
    },
    pressedPrimaryButton: {
        backgroundColor: COLORS.accentDark,
    },
    resultCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 13,
        gap: 4,
    },
    sendingCard: {
        backgroundColor: COLORS.accentSoft,
        borderColor: COLORS.pendingBorder,
    },
    resultHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    successCard: {
        backgroundColor: COLORS.successSoft,
        borderColor: COLORS.successBorder,
    },
    errorCard: {
        backgroundColor: COLORS.errorSoft,
        borderColor: COLORS.errorBorder,
    },
    resultTitle: {
        fontSize: 14,
        fontWeight: '700',
    },
    successText: {
        color: COLORS.success,
    },
    sendingText: {
        color: COLORS.accentDark,
    },
    errorText: {
        color: COLORS.error,
    },
    resultMessage: {
        color: COLORS.text,
        fontSize: 12,
        lineHeight: 18,
    },
    signOutButton: {
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    signOutPressed: {
        backgroundColor: COLORS.surfacePressed,
    },
    signOutText: {
        color: COLORS.muted,
        fontSize: 14,
        fontWeight: '700',
    },
    sendingButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
});
