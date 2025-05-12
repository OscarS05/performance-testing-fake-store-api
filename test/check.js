import { check } from 'k6';
import { Rate } from 'k6/metrics';
import http from 'k6/http'

export const options = {
    vus: 20,
    duration: '20s',
    thresholds: {
        http_req_failed: [
            {
                threshold: 'rate<0.35',
                abortonFail: true,
                delayAbortEval: '10s'
            }
        ],
        http_req_duration: [
            {
                threshold: 'p(95)<200',
                abortonFail: true,
                delayAbortEval: '10s'
            },
        ]
    }
};

const myRate = new Rate('failed_rate');

export default function(){
    const response = http.get(`https://api.escuelajs.co/api/v1/products`);
    
    check(response, {
        'statusCode is 200': (r) => r.status === 200 ? myRate.add(true) : myRate.add(false),
        'duration is < 500ms': (r) => r.timings.duration < 500,
    })
};