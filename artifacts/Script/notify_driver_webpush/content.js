const reqData = payload.data;
const webpush = modules.webpush;

const eventResponse = {
    process: payload.process,
    data: null,
};

// DEMO ONLY! keys should be stored in a secure way outside of the code
const vapidKeys = {
    publicKey:
        "BAG7o46AL58K1zBWa1YpoJWSgVhpfLATvkZAISuGFlT-y1Dz_4F1Q88EQ5_-rhXhzvnsj3tEXXtl0mmfD9m3HC0",
    privateKey: "buhss4dXKHKNcUexbwv2YKCWvK1YC8WAjGOSX2oByDg",
};

webpush.setVapidDetails(
    // used in case the push service notice a problem with your feed and need to contact you
    "mailto:emmanuella.ndukwe@neptune-software.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const subscriptionList = await entities.push_subscription_register
    .createQueryBuilder("user_sub")
    .where("user_sub.user_id = :id", { id: reqData.driver_id })
    .getMany();




await Promise.all(subscriptionList.map((sub)=> {
   
    const pushSubscription = {
        endpoint: sub.endpoint,
        expirationTime: sub.expirationTime,
        keys: {
            auth: sub.auth,
            p256dh: sub.p256dh,
        },
    };
    try {
        return webpush.sendNotification(pushSubscription, "It is your turn to use Item")
  
     } catch (e) {
        return entities.push_subscription_register.delete(sub.id);
     }
}));

eventResponse.data = { status: "User status successfully Updated to Finished!" };

await p9.events.publish("DriverAppListener", eventResponse);

complete();
