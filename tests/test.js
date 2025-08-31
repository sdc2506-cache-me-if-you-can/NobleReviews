import http from 'k6/http';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { sleep, check } from 'k6';

export const options = {
  vus: 50, // Number of virtual users
  duration: '10s', // Duration of the test
  thresholds: {
    http_req_duration: ['p(95)<50'], // 95% of requests must complete under 500ms
    http_req_failed: ['rate<0.01'] // Less than 1% request failure rate
  },
};

export default function () {
  const response = http.get(`http://54.215.104.210:3000/reviews?product_id=${randomIntBetween(1, 10000)}`); // Your API endpoint
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time is acceptable': (r) => r.timings.duration < 500,
  });
}