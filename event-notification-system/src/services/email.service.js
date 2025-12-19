export const sendEmail = async ({ userId, data }) => {
    console.log(`Email sent to user ${userId}:${JSON.stringify(data)}`);
    return true;
};