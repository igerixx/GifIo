const { createApp, ref } = Vue

let usernameOrEmail = ref('');
let password = ref('');
let isLogin = ref(false);
let appstatus = ref('');

createApp({
    setup() {
        return {
        usernameOrEmail,
        password,
        isLogin,
        login,
        register
        }
    }
}).mount("#app");

function login() {
    if (
        (!usernameOrEmail.value || !password.value) 
    ||  (usernameOrEmail.value.length < 3 || password.value.length < 8)
    ) {
        document.getElementById("status").style.display = "block";
        document.getElementById("status").style.color = "red";
        document.getElementById("status").textContent = 
        (!usernameOrEmail.value || !password.value) ? "All fields must be filled" : 
        usernameOrEmail.value.length < 3 ? "Username must be longer 3 letters" :
        password.value.length < 8 ? "Password must be longer 8 letters" : "Error";
        return;
    }
    document.getElementById("status").style.display = "none";

    const reqData = new URLSearchParams({
        username: usernameOrEmail.value,
        password: password.value
    });

    fetch("http://localhost:8082/login", {
        method: "POST",
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded'
        },
        body: reqData
    })
    .then((response => response.json()))
    .then((data) => {
        if (data.status === "ok") {
            document.getElementById("status").style.display = "block";
            document.getElementById("status").style.color = "green";
            document.getElementById("status").textContent = "Succesfully loged in";
        } else {
            document.getElementById("status").style.display = "block";
            document.getElementById("status").style.color = "red";
            document.getElementById("status").textContent = "Username/Email or password is wrong";
        }
    })
    .catch((data) => {
        document.getElementById("status").style.display = "block";
        document.getElementById("status").style.color = "red";
        document.getElementById("status").textContent = "Error";
    })
}

function register() {
    if (
        (!usernameOrEmail.value || !password.value) 
    ||  (usernameOrEmail.value.length < 3 || password.value.length < 8)
    ) {
        document.getElementById("status").style.display = "block";
        document.getElementById("status").style.color = "red";
        document.getElementById("status").textContent = 
        (!usernameOrEmail.value || !password.value) ? "All fields must be filled" : 
        usernameOrEmail.value.length < 3 ? "Username must be longer 3 letters" :
        password.value.length < 8 ? "Password must be longer 8 letters" : "Error";
        return;
    }
    document.getElementById("status").style.display = "none";

    const usernameOrEmailValue = usernameOrEmail.value;

    const reqData = {
        username: usernameOrEmailValue.includes("@") ? null : usernameOrEmailValue,
        email: usernameOrEmailValue.includes("@") ? usernameOrEmailValue : null,
        password: password.value
    };

    fetch("http://localhost:8082/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqData)
    })
    .then((response => response.json()))
    .then((data) => { 
        document.getElementById("status").style.display = "block";
        if (data.status === "ok") {
            document.getElementById("status").style.color = "green";
            document.getElementById("status").textContent = "Account created";
        } else {
            document.getElementById("status").style.color = "red";
            document.getElementById("status").textContent = "Error";
        }
    })
    .catch((data) => {
        document.getElementById("status").textContent = "Error";
    }) 
}