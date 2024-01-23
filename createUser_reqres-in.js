import http from 'k6/http';
import { check } from 'k6';


export const options = {
  scenarios: {
    cretae_users: {
      executor: 'constant-arrival-rate',
      duration: '5s', // total duration
      preAllocatedVUs: 2, // to allocate runtime resources     preAll

      rate: 5, // number of constant iterations given `timeUnit`
      timeUnit: '2s',
    },
  },
};

export default function () {
//  const url = 'https://reqres.in/api/users';
  const payload = JSON.stringify({
    name: 'morpheus',
    job: 'leader',
  });

//  const params = {
//    headers: {
//      'Content-Type': 'application/json',
//    },
//  }; 

  const headers = { 'Content-Type': 'application/json' };

  const res = http.post('https://reqres.in/api/users', payload, {headers});

  check(res, {
    'Post status is 201': (r) => res.status === 201,
    'Post Content-Type header': (r) => res.headers['Content-Type'] === 'application/json',
    'Post response name': (r) => res.status === 201 && res.json().json.name === 'morpheus',
  });
}


// k6 run createUser_reqres-in.js