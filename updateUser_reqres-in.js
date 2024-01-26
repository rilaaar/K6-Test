import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  scenarios: {
    update_users: {
      executor: 'constant-arrival-rate',
      duration: '30s', // total duration
      preAllocatedVUs: 1000, // to allocate runtime resources     preAll

      rate: 3500, // number of constant iterations given `timeUnit`
      timeUnit: '2s',
    },
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