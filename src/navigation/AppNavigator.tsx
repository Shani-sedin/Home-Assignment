import React, { useCallback, useEffect } from 'react';
import {
    type LinkingOptions,
    NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator, } from '@react-navigation/native-stack';
import { useAuth } from '../modules/auth/AuthContext';
import { LoginScreen } from '../modules/auth/LoginScreen';
import { ActivityIndicator, AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotSupportedScreen } from '../modules/developer/NotSupportedScreen';
import { DeveloperConsoleScreen } from '../modules/developer/DeveloperConsoleScreen';
import {
    navigationRef,
    type RootStackParamList,
} from './navigationRef';
import { NotificationDetailsScreen } from '../modules/notifications/NotificationDetailsScreen';
import { flushPendingNotification } from '../modules/notifications/notificationNavigation';
import { subscribeToPendingNotification } from '../modules/notifications/pendingNotification';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['fcmtest://'],
    config: {
        screens: {
            NotificationDetails: 'notification/details',
        },
    },
};

export const AppNavigator = () => {

    const {
        user,
        loading,
        roleLoading,
        isDeveloper,
    } = useAuth();

    const canNavigateToPendingNotification =
        !!user && !loading && !roleLoading && isDeveloper;

    const renderHomeButton = useCallback(
        () => (
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go to home"
                onPress={() => {
                    if (isDeveloper) {
                        navigationRef.navigate('DeveloperConsole');
                    } else {
                        navigationRef.navigate('NotSupported');
                    }
                }}
                style={styles.homeButton}
            >
                <Text style={styles.homeButtonText}>Home</Text>
            </Pressable>
        ),
        [isDeveloper],
    );

    useEffect(() => {
        flushPendingNotification(canNavigateToPendingNotification);
    }, [canNavigateToPendingNotification]);

    useEffect(
        () =>
            subscribeToPendingNotification(() =>
                flushPendingNotification(
                    canNavigateToPendingNotification,
                ),
            ),
        [canNavigateToPendingNotification],
    );

    useEffect(() => {
        const subscription = AppState.addEventListener('change', state => {
            if (state === 'active') {
                flushPendingNotification(
                    canNavigateToPendingNotification,
                );
            }
        });

        return () => subscription.remove();
    }, [canNavigateToPendingNotification]);

    return (
        <View style={styles.container}>
            <NavigationContainer
                ref={navigationRef}
                linking={linking}
                onStateChange={() =>
                    flushPendingNotification(canNavigateToPendingNotification)
                }
                onReady={() =>
                    flushPendingNotification(canNavigateToPendingNotification)
                }
            >
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: { backgroundColor: colors.surface },
                        headerTintColor: colors.accent,
                        headerTitleStyle: {
                            color: colors.text,
                            fontSize: 17,
                            fontWeight: '700',
                        },
                        contentStyle: { backgroundColor: colors.background },
                    }}
                >
                    {!user ? (
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                    ) : isDeveloper ? (
                        <Stack.Screen
                            name="DeveloperConsole"
                            component={DeveloperConsoleScreen}
                            options={{
                                title: 'Developer Console',
                                headerBackVisible: false,
                            }}
                        />
                    ) : (
                        <Stack.Screen
                            name="NotSupported"
                            component={NotSupportedScreen}
                            options={{
                                title: 'Not Supported',
                            }}
                        />
                    )}
                    {isDeveloper && <Stack.Screen
                        name="NotificationDetails"
                        component={NotificationDetailsScreen}
                        options={{
                            title: 'Notification Details',
                            headerLeft: renderHomeButton,
                        }}
                    />}
                </Stack.Navigator>
            </NavigationContainer>
            {(loading || (user && roleLoading)) && (
                <SafeAreaView style={styles.loadingOverlay}>
                    <ActivityIndicator />
                    <Text>Loading...</Text>
                </SafeAreaView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingOverlay: {
        bottom: 0,
        alignItems: 'center',
        backgroundColor: colors.surface,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    homeButton: {
        paddingVertical: 8,
        paddingRight: 12,
    },
    homeButtonText: {
        color: colors.accent,
        fontSize: 16,
    },
});
