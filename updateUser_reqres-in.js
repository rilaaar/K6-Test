import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  scenarios: {
    cretae_users: {
      executor: 'constant-arrival-rate',
      duration: '30s', // total duration
      preAllocatedVUs: 1000, // to allocate runtime resources     preAll

      rate: 7000, // number of constant iterations given `timeUnit`
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
      "summary.html": htmlReport(data),
    };
  }

// k6 run updateUser_reqres-in.js