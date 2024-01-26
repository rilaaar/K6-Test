import { check, group } from "k6";
import http from "k6/http";

// This will export to HTML as filename "result.html" AND also stdout using the text summary
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options ={
    iterations : 20,
    stages : [
        // Load Test 
        {durations : '5s', target : 5},
        {durations : '3s', target : 25},
        {durations : '2s', target : 3},
    ]
}

export default function(){
    group('K6 Get Test', ()=> {
        let response1 = http.get('https://test.k6.io');
        check(response1,{
            'is status 200': (r) => r.status == 200
        })
    })

    group('Reqres Create User', ()=> {
        let url = "https://reqres.in/api/users"
        let body = JSON.stringify({
            "name": "morpheus",
            "job": "leader"
         })
         let response2 = http.post(url,body);
        console.log(JSON.stringify(response2.body))
        check(response2,{
        'is status 201': (r) => r.status == 201
        })

        group('Update User reqres', ()=> {
            let url = "https://reqres.in/api/users/2"
            let body = JSON.stringify({
                "name": "morpheus",
                "job": "zion resident"
            })
            let response3 = http.put(url,body);
            console.log(JSON.stringify(response3.body))
            check(response3,{
                'is status 200': (r) => r.status == 200
                })
        })
    })
    
}

export function handleSummary(data) {
    return {
      "k6-myskill.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }


// k6 run  k6-myskill.js 
// k6 run --vus 10 --duration 5s k6-myskill.js