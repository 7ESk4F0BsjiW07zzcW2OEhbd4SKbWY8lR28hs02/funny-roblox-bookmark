var elements = document.getElementsByName("csrf-token")[0];
var token = elements.getAttribute('data-token');
var code = 913283;
fetch("https://trades.roblox.com/v1/trades/send", {
    "credentials": "include",
    "headers": {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-GB,en;q=0.5",
        "Content-Type": "application/json;charset=utf-8",
        "X-CSRF-TOKEN": token,
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "referrer": "https://www.roblox.com/",
    "body": {},
    "method": "POST",
    "mode": "cors"
}).then(response => {
    if (!response.headers.get('rblx-challenge-id')) {
        alert("already trade verified")
    }
    let challengeid = response.headers.get('rblx-challenge-id')
    let challengedata = response.headers.get('rblx-challenge-metadata')
    challengedata = JSON.parse(atob(challengedata));
    console.log(challengeid)
    console.log(challengedata)
    fetch(`https://twostepverification.roblox.com/v1/users/${challengedata.userId}/challenges/authenticator/verify`, {
            "credentials": "include",
            "headers": {
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-GB,en;q=0.5",
                "Content-Type": "application/json;charset=utf-8",
                "x-csrf-token": token,
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            "referrer": "https://www.roblox.com/",
            "body": `{"challengeId":"${challengedata.challengeId}","actionType":"Generic","code":"${code}"}`,
            "method": "POST",
            "mode": "cors"
        })
        .then(response => {
            return response.json()
        }).then(data => {
            console.log(data)
            if (data.verificationToken != undefined) {
                var veriftoken = data.verificationToken
                let continuedata1 = {
                    "verificationToken": veriftoken,
                    "rememberDevice": false,
                    "challengeId": challengedata["challengeId"],
                    "actionType": "Generic"
                }
                let continuedata = {
                    "challengeId": challengeid,
                    "challengeType": "twostepverification",
                    "challengeMetadata": JSON.stringify(continuedata1)
                }
                fetch("https://apis.roblox.com/challenge/v1/continue", {
                        "credentials": "include",
                        "headers": {
                            "Accept": "application/json, text/plain, */*",
                            "Accept-Language": "en-GB,en;q=0.5",
                            "Content-Type": "application/json;charset=utf-8",
                            "x-csrf-token": token,
                            "Sec-Fetch-Dest": "empty",
                            "Sec-Fetch-Mode": "cors",
                            "Sec-Fetch-Site": "same-site",
                            "Pragma": "no-cache",
                            "Cache-Control": "no-cache"
                        },
                        "referrer": "https://www.roblox.com/",
                        "body": JSON.stringify(continuedata),
                        "method": "POST",
                        "mode": "cors"
                    })
                    .then(data => {
                        alert("worked")
                        fetch("https://trades.roblox.com/v1/trades/send", {
                            "credentials": "include",
                            "headers": {
                                "Accept": "application/json, text/plain, */*",
                                "Accept-Language": "en-GB,en;q=0.5",
                                "Content-Type": "application/json;charset=utf-8",
                                "X-CSRF-TOKEN": token,
                                "Sec-Fetch-Dest": "empty",
                                "Sec-Fetch-Mode": "cors",
                                "Sec-Fetch-Site": "same-site",
                                "Pragma": "no-cache",
                                "Cache-Control": "no-cache"
                            },
                            "referrer": "https://www.roblox.com/",
                            "body": {},
                            "method": "POST",
                            "mode": "cors"
                        })
                    })
            } else {
                alert("failed")
            }
        })
        .catch(error => {
            console.log(error)
        })
}).catch(error => {});
