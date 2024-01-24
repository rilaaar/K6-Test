import http from 'k6/http';
import { check } from 'k6';


export const options = {
  scenarios: {
    cretae_users: {
      executor: 'constant-arrival-rate',
      duration: '10s', // total duration
      preAllocatedVUs: 1000, // to allocate runtime resources     preAll

      rate: 7000, // number of constant iterations given `timeUnit`
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
//    'Verify Post response name': (r) => res.status === 201 && res.json().json && payload.json().json.name === 'morpheus',
    'Verify Post response name': (r) => res.json().json.name === 'morpheus',
  });
}


// k6 run createUser_reqres-in.js