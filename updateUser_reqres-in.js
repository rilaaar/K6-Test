import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  scenarios: {
    update_users: {
      executor: 'constant-arrival-rate',
      duration: '10s', // total duration
      preAllocatedVUs: 1000, // to allocate runtime resources     preAll 
      maxVUs: 1000,
      rate: 3500, // number of constant iterations given `timeUnit`
      timeUnit: '1s',
    },
  },

    thresholds: {
      http_req_duration: ['p(90)<1000', 'p(95)<1500', 'p(99)<2000'], // 95% of requests must complete below 1500ms, and 99% must complete below 2s.
    },
};

export default function () {
  const url = 'https://reqres.in/api/users/2';
  const payload = JSON.stringify({
    name: 'morpheus',
    job: 'zion resident',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  }; 


  const res = http.put(url, payload, params);

  check(res, {
    'Verify Post status is 200 OK': (r) => res.status === 200,
    'Verify Post Content-Type header': (r) => params.headers['Content-Type'] === 'application/json',
  });
}

export function handleSummary(data) {
  return {
    "update_user.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

// k6 run updateUser_reqres-in.js