export const sendPush = async ({ userId, data }) => {
    console.log(`Push notification sent to user ${userId}:${JSON.stringify(data)}`);
    return true;
}