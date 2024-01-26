import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";


export const options = {
/*  max_vus: 2,
  vus: 5,
  iterations : 8,
    stages : [
        // Load Test 
    {durations : '2s', target : 10},
    ] 
  */ 
  scenarios: {
    create_users: {
      executor: 'constant-arrival-rate',
      duration: '3s', // total duration
      preAllocatedVUs: 10, // to allocate runtime resources     preAll

      rate: 35, // number of constant iterations given `timeUnit`
      timeUnit: '2s',
    }, 
  },
};

export default function () {
  const url = 'https://reqres.in/api/users';
  const payload = JSON.stringify({
    name: 'morpheus',
    job: 'leader',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  }; 


  const res = http.post(url, payload, params);

  check(res, {
    'Verify Post status is 201': (r) => res.status === 201,
    'Verify Post Content-Type header': (r) => params.headers['Content-Type'] === 'application/json',
  });
}

export function handleSummary(data) {
  return {
    "create_users.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

// k6 run createUser_reqres-in.js