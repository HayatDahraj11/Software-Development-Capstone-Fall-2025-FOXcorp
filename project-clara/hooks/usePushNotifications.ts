// registers and handles push notifications
// made with help from the expo documentation and @nnaemekaonyeji27 on medium

import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Href, useRouter } from 'expo-router';

// typescript readable notification state interface
interface PushNotificationState {
    expoPushToken?: string;
    notification?: Notifications.Notification;
}

// takes a string, logs it as an error in console then throws it as an error in code
function ErrorHandler(error: string) {
    console.error(error);
    throw new Error(error);
}

// ------ local notification sender ------
// function for local notifications, or, sending a push notification to yourself
// can be built upon later for full customizability
export async function sendPushNotification(expoPushToken: string) {
    // the notification data
    const message = {
        to: expoPushToken,
        sound: "default",
        title: "Your Student has an update!",
        body: "Tap here to see!",
        data: {route: '/(parent)/(tabs)/live-updates'},
    };

    // the notification packet
    await fetch('https://exp.host/--/api/v2/push/send', {
        method: "POST",
        headers: {
            Accept: "application/json",
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message),
    });
}

export const usePushNotifications = (): PushNotificationState => {
    
    // notification handler and params
    Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
    });

    // device's expo push token
    const [expoPushToken, setExpoPushToken] = useState('');
    // latest received notification
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    // helps manage which notifications we care about
    //const notificationListener = useRef<Notifications.EventSubscription>(undefined);
    //const responseListener = useRef<Notifications.EventSubscription>(undefined);
    
    const router = useRouter();
    

    // ------ registering for device notifications ------

    // setting up notification perms and params with device
    // returns the pushNotificationToken, or nothing.
    async function registerForPushNotificationsAsync() {
        if(Platform.OS === 'android') {
            // setting up parameters for android notifications
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        // push notifications only work on physical devices
        // Device.isDevice returns if this is one or nah
        if(Device.isDevice) {
            // checking what our perms are
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            // if we don't have perms, ask for them
            if(existingStatus !== "granted") {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            // if we still don't have perms, we can't send notifications
            if (finalStatus !== "granted") {
                ErrorHandler("Push notification permissions not granted! See: registerForPushNotificationsAsync()");
                return;
            }

            // unique id for this project in eas's system
            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if(!projectId) {
                ErrorHandler("No ProjectId. See: registerForPushNotificationsAsync()");
            }

            try {
                // Looks for notifications from expo's push notification service
                const pushTokenString = (
                    await Notifications.getExpoPushTokenAsync({
                        projectId,
                    })
                ).data;
                console.log(pushTokenString);
                return pushTokenString;
            } catch(e: unknown) {
                ErrorHandler(`${e}`);
            }
        } else {
            ErrorHandler("Push Notifications require physical devices. Emulators do not work.")
        }
    }

    // ------ notification handling ------

    // handles notification actions
    const handleNotificationResponse = useCallback(
        async (response: Notifications.NotificationResponse) => {
            // the tapped notification's data
            const data = response.notification.request.content.data;

            // assuming the notification's data has a route: string.
            // if not, ignore it!
            if(!data?.route) return;

            try {
                router.push( (data.route) as Href );
            } catch(error) {
                console.error("Notification tap error: ",error);
            } 
        }, [router]
    );

    useEffect(() => {
        // gets expo push token or dies trying
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`));

        // updates current notification we care about
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });
        
        // runs handleNotificationResponse with this notification
        const responseListener = Notifications.addNotificationResponseReceivedListener(
            handleNotificationResponse
        );

        // cleanup
        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, [handleNotificationResponse]);

    return {
        expoPushToken,
        notification,
    };
}