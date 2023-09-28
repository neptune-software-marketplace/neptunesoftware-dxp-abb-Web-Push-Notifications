// console.log(AppCache.userInfo)"5381816A-4C43-EE11-B8F0-002248A2F7BE"
"use strict";
var currentUserId = AppCache.userInfo.id;
//console.log(AppCache.userInfo);

const urlB64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const getPermission = () => {
    if (!("Notification" in window)) {
        notificationBtn.setVisible(true);
    } else {
       Notification.requestPermission(function (status) {
        if (status === "granted") {
            getSubscription();
        } else {
            notificationBtn.setVisible(true);
        }
    });
    }
    
};

const getSubscription = async () => {
    const pubkeyResult = await apioAPIGetPublicKey();
    //console.log("fetched public key:", pubkeyResult.pub_key);
    const registration = await navigator.serviceWorker.getRegistration();
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(pubkeyResult.pub_key),
        });
    }
    await apioAPISaveSubscription({
        data: { subData: subscription, user_id: currentUserId },
    });
    console.log("created subscription:", subscription);
    // in production we would send it directly to our server and not store it on the window
    window.mySubscription = subscription;
};

const registerWorker = () => {
    navigator.serviceWorker
        .register("/public/serverscript/testpushnotification/get_service_worker", { scope: "/" })
        .then((registration) => {
            //console.log(`ServiceWorker registration successful with scope: ${registration.scope}`);
            return registration.update();
        })
        .then((registration) => {
            //console.log(`ServiceWorker update successful. Scope: ${registration.scope}`);
        })
        .catch((err) => console.log("ServiceWorker registration failed: ", err));
};

if ("serviceWorker" in navigator) {
    if (document.readyState === "complete") {
        registerWorker();
       setTimeout(()=> getPermission(), 1000);
    } else {
        window.addEventListener("load", function () {
            registerWorker();
           setTimeout(()=> getPermission(), 1000);
        });
    }
}

//get user notification permission
//askNotificationPermission();

function handleData(payload) {
    const data = payload.data;
    console.log("Response data from script: ",data)

    //createNotification()
}
