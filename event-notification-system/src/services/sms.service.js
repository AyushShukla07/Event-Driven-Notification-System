export const sendSMS = async ({ userId, data }) => {
    console.log(`SMS sent to user ${userId}:${JSON.stringify(data)}`);
    return true;
};