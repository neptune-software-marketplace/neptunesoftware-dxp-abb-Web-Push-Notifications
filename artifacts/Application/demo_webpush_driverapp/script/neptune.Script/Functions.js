function askNotificationPermission() {
    // function to actually ask the permissions
    console.log("notification clicked");
    console.log(Notification);
    try {
        Notification.requestPermission().then(() => {
            getSubscription();
            notificationBtn.setVisible(false);
        });
        console.log("I got here");
    } catch (error) {
        // Safari doesn't return a promise for requestPermissions and it
        // throws a TypeError. It takes a callback as the first argument
        // instead.
        if (error instanceof TypeError) {
            Notification.requestPermission(() => {
                getSubscription();
                notificationBtn.setVisible(false);
            });
        } else {
            console.log("Notifification permission not granted");
        }
    }
}

// Let's check if the browser supports notifications

// function createNotification() {

// const notification = new Notification("It is your turn!", {
//     body: text,
//     icon: oImage.getSrc(),
//     vibrate: [200, 100, 200],
//     icon: oImage.getSrc(),
//     image: oImage.getSrc(),
// });

// notification.onclick = (event) => {
//     event.preventDefault(); // prevent the browser from focusing the Notification's tab
// window.open(
//     "https://gtmdemosystem.neptune-software.cloud/launchpad/demo_push_notification_v2#",
//     "_blank"
// );
// };
// navigator.serviceWorker.register(
//     "https://gtmdemosystem.neptune-software.cloud/media/root/Emmanuella/sw.js"
// );
// Notification.requestPermission(function (result) {
//     if (result === "granted") {
//         navigator.serviceWorker.ready.then(function (registration) {
//             registration.showNotification("Its' your turn!", {
//                 body: text,
//                 icon: oImage.getSrc(),
//                 vibrate: [200, 100, 200],

//             });
//         });
//     }
// });
// }

// keep screen awake- wake lock.
//https://developer.chrome.com/articles/wake-lock/