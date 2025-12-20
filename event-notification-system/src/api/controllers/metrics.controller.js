import { getMetric } from '../../utils/metrics.js';

export const getMetrics = async (_, res) => {
    const metrics = {
        email: {
            success: await getMetric('metrics:email:success'),
            failure: await getMetric('metrics:email:failure')
        },
        sms: {
            success: await getMetric('metrics:sms:success'),
            failure: await getMetric('metrics:sms:failure')
        },
        push: {
            success: await getMetric('metrics:push:success'),
            failure: await getMetric('metrics:push:failure')
        }
    };
    res.json(metrics);
}