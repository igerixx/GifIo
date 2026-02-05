const { createApp, ref } = Vue

text = ref("")
value = ref("")

isSearch = false;
isScroll = false;
reqData = "";
i = 1;
userId = 0;
lastRequest = null;
limit = 16;
responseLength = 0;
lastURL = "";

document.getElementById("title").addEventListener("click", () => {
    location.reload();
});

document.getElementById("back-btn").addEventListener("click", () => {
    location.reload();
});

function enter() {
    document.title = this.text.value;

    isSearch = true;
    isScroll = false;

    reqData = {
        "request": this.text.value
    }

    fetchByData("http://localhost:8082/search", reqData);
}

function favourites() {
    document.title = "Favourites";

    fetchAuth();

    if (userId == 0) {
        let alertEl = document.getElementById("alertEl");
        alertEl.style.display = "block"
        setTimeout(() => {
            alertEl.style.display = "none";
        }, 1000);
        return;
    }

    fetchRequest = {
        "userId": userId
    }

    fetchByData("http://localhost:8082/allFavourites", fetchRequest, true)
}

document.addEventListener('DOMContentLoaded', () => {
    isSearch = false;
    isScroll = false;

    fetchAuth();

    fetchByData("http://localhost:8082/trending", {isReloadedPage: true});
});

window.addEventListener('scroll', async () => {
    if (lastURL === "http://localhost:8082/allFavourites") return;

    scrollTop = window.scrollY || document.documentElement.scrollTop;
    docHeight = document.documentElement.scrollHeight;
    windowHeight = window.innerHeight;

    if (scrollTop + windowHeight >= docHeight - 1 && responseLength >= limit) {
        isScroll = true;
        await fetchByData(lastURL, isSearch ? reqData : {isReloadedPage: false})
    }
});

async function fetchByData(url, bodyData, isDataDB = false) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
    })
    .then((response => response.json()))
    .then(async (data) => {
        lastURL = url;
        const gifConrainer = document.getElementsByClassName("gif-container")[0];
        const fColumn = document.getElementsByClassName("gif-1column")[0];
        const sColumn = document.getElementsByClassName("gif-2column")[0];
        const tColumn = document.getElementsByClassName("gif-3column")[0];
        const FColumn = document.getElementsByClassName("gif-4column")[0];

        if (!isScroll && JSON.stringify(lastRequest) !== JSON.stringify(bodyData) || url === "http://localhost:8082/allFavourites") {
            fColumn.replaceChildren();
            sColumn.replaceChildren();
            tColumn.replaceChildren();
            FColumn.replaceChildren();
        }
        lastRequest = bodyData;

        try {
            if (data.data === "empty") return;
        } catch {}

        let iterable;
        if (isDataDB) {
            iterable = data;
        } else {
            iterable = data.data.data;
        }
        responseLength = iterable.length;

        i = 1;
        for (let obj of iterable) {
            let downsampled;
            let original;
            let gifId;
            if (isDataDB) {
                downsampled = obj.fullData.downsampled;
                original = obj.fullData.original;
                gifId = obj.id;
            } else {
                downsampled = obj.file.sm.gif.url;
                original = obj.file.hd.gif.url;
                gifId = obj.id;
            }

            const gif = document.createElement("img");
            gif.src = downsampled;

            const gifWraper = document.createElement("div");
            gifWraper.className = "gif-wraper";
            gifWraper.addEventListener("mouseenter", () => {
                gif.src = original;
            });
            gifWraper.addEventListener("mouseleave", () => {
                gif.src = downsampled;
            });

            const copy = document.createElement("div");
            copy.textContent = "Copy";
            copy.className = "gif-wraper-copy";
            copy.onclick = function() {
                navigator.clipboard.writeText(original)
                .then(() => {
                    copy.textContent = "Copied to clipboard";
                    setTimeout(() => {
                        copy.textContent = "Copy";
                    }, 1000);
                })
                .catch(err => {
                    console.error('Error', err)
                })
            };

            const star = document.createElement("svg");

            fetchRequest = JSON.stringify({
                "userId": userId,
                "gifId": gifId
            })

            let boolean;

            await fetch("http://localhost:8082/checkGif", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: fetchRequest
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                boolean = data.data;
            })  
            .catch((data) => {
                console.log(data);
            });

            if (boolean || isDataDB) {
                star.innerHTML = `
                    <svg id="star" class="star-active" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 600 450" style="enable-background:new 0 0 600 450;" xml:space="preserve">
                    <g>
                        <path class="st0" d="M331.9,56.7l32.6,79.8c2.5,6.2,8,10.1,14.6,10.6l86,6.4c14.2,1,25.7,10.1,30.1,23.6
                            c4.4,13.5,0.4,27.6-10.5,36.8l-65.9,55.7c-5.1,4.3-7.2,10.7-5.6,17.2l20.5,83.8c3.4,13.8-1.6,27.6-13.2,35.9
                            c-11.5,8.4-26.1,8.9-38.2,1.4l-82.4-51l-82.4,51c-12.1,7.5-26.7,7-38.2-1.4c-11.5-8.4-16.5-22.1-13.2-35.9l20.5-83.8
                            c1.6-6.5-0.5-12.9-5.6-17.2l-65.9-55.7c-10.9-9.2-14.9-23.3-10.5-36.8c4.4-13.5,15.9-22.6,30.1-23.6l86-6.4
                            c6.7-0.5,12.1-4.4,14.6-10.6l32.6-79.8c5.4-13.2,17.5-21.3,31.8-21.3C314.4,35.3,326.5,43.5,331.9,56.7L331.9,56.7z"/>
                    </g>
                    </svg>
                `;
            } else {
                star.innerHTML = `
                    <svg id="star" class="star-deactive" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 600 450" style="enable-background:new 0 0 600 450;" xml:space="preserve">
                    <g>
                        <path class="st0" d="M331.9,56.7l32.6,79.8c2.5,6.2,8,10.1,14.6,10.6l86,6.4c14.2,1,25.7,10.1,30.1,23.6
                            c4.4,13.5,0.4,27.6-10.5,36.8l-65.9,55.7c-5.1,4.3-7.2,10.7-5.6,17.2l20.5,83.8c3.4,13.8-1.6,27.6-13.2,35.9
                            c-11.5,8.4-26.1,8.9-38.2,1.4l-82.4-51l-82.4,51c-12.1,7.5-26.7,7-38.2-1.4c-11.5-8.4-16.5-22.1-13.2-35.9l20.5-83.8
                            c1.6-6.5-0.5-12.9-5.6-17.2l-65.9-55.7c-10.9-9.2-14.9-23.3-10.5-36.8c4.4-13.5,15.9-22.6,30.1-23.6l86-6.4
                            c6.7-0.5,12.1-4.4,14.6-10.6l32.6-79.8c5.4-13.2,17.5-21.3,31.8-21.3C314.4,35.3,326.5,43.5,331.9,56.7L331.9,56.7z"/>
                    </g>
                    </svg>
                `;
            }

            star.onclick = function() {
                fetchAuth();

                if (userId == 0) {
                    let alertEl = document.getElementById("alertEl");
                    alertEl.style.display = "block"
                    setTimeout(() => {
                        alertEl.style.display = "none";
                    }, 1000);
                    return;
                }

                fetchRequest = JSON.stringify({
                    "userId": userId,
                    "fullData": {
                        "original": original,
                        "downsampled": downsampled
                    },
                    "gifId": gifId
                })

                if (star.innerHTML.includes('class="star-deactive"')) {
                    star.innerHTML = `
                    <svg id="star" class="star-active" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 600 450" style="enable-background:new 0 0 600 450;" xml:space="preserve">
                    <g>
                        <path class="st0" d="M331.9,56.7l32.6,79.8c2.5,6.2,8,10.1,14.6,10.6l86,6.4c14.2,1,25.7,10.1,30.1,23.6
                            c4.4,13.5,0.4,27.6-10.5,36.8l-65.9,55.7c-5.1,4.3-7.2,10.7-5.6,17.2l20.5,83.8c3.4,13.8-1.6,27.6-13.2,35.9
                            c-11.5,8.4-26.1,8.9-38.2,1.4l-82.4-51l-82.4,51c-12.1,7.5-26.7,7-38.2-1.4c-11.5-8.4-16.5-22.1-13.2-35.9l20.5-83.8
                            c1.6-6.5-0.5-12.9-5.6-17.2l-65.9-55.7c-10.9-9.2-14.9-23.3-10.5-36.8c4.4-13.5,15.9-22.6,30.1-23.6l86-6.4
                            c6.7-0.5,12.1-4.4,14.6-10.6l32.6-79.8c5.4-13.2,17.5-21.3,31.8-21.3C314.4,35.3,326.5,43.5,331.9,56.7L331.9,56.7z"/>
                    </g>
                    </svg>
                    `
                } else {
                    star.innerHTML = `
                    <svg id="star" class="star-deactive" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 600 450" style="enable-background:new 0 0 600 450;" xml:space="preserve">
                    <g>
                        <path class="st0" d="M331.9,56.7l32.6,79.8c2.5,6.2,8,10.1,14.6,10.6l86,6.4c14.2,1,25.7,10.1,30.1,23.6
                            c4.4,13.5,0.4,27.6-10.5,36.8l-65.9,55.7c-5.1,4.3-7.2,10.7-5.6,17.2l20.5,83.8c3.4,13.8-1.6,27.6-13.2,35.9
                            c-11.5,8.4-26.1,8.9-38.2,1.4l-82.4-51l-82.4,51c-12.1,7.5-26.7,7-38.2-1.4c-11.5-8.4-16.5-22.1-13.2-35.9l20.5-83.8
                            c1.6-6.5-0.5-12.9-5.6-17.2l-65.9-55.7c-10.9-9.2-14.9-23.3-10.5-36.8c4.4-13.5,15.9-22.6,30.1-23.6l86-6.4
                            c6.7-0.5,12.1-4.4,14.6-10.6l32.6-79.8c5.4-13.2,17.5-21.3,31.8-21.3C314.4,35.3,326.5,43.5,331.9,56.7L331.9,56.7z"/>
                    </g>
                    </svg>
                    `
                }
       
                fetch("http://localhost:8082/favourite", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: fetchRequest
                })
                .then((response) => {
                    return response.json();
                })
                .catch((data) => {
                    console.log(data);
                });
            };

            gifWraper.appendChild(gif);
            gifWraper.appendChild(copy);
            gifWraper.appendChild(star);

            if (i % 4 === 3) {
                FColumn.appendChild(gifWraper)
            } else if (i % 4 === 2) {
                fColumn.appendChild(gifWraper)
            } else if (i % 4 === 1) {
                sColumn.appendChild(gifWraper)
            } else {
                tColumn.appendChild(gifWraper)
            }

            i++;
        }
        gifConrainer.appendChild(fColumn, sColumn, tColumn, FColumn);
    })
    .catch((data) => {
        console.log(data)
    })
}

function fetchAuth() {
    fetch("http://localhost:8082/authentication", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response => response.json()))
    .then((data) => {
        document.getElementById("account").textContent = data.info;
        userId = data.userId;
    })
    .catch((data) => {
        console.log(data)
    })
}

function goToSign() {
    window.location.href = "/signinWindow.html";
}

createApp({
    setup() {
        return {
            text,
            value,
            enter,
            favourites
        }
    }
}).mount('#app')