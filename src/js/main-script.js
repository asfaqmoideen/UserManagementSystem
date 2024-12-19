document.addEventListener('DOMContentLoaded',()=>{
    const uiCon = new UIController();
    document.getElementById('login-redirect-btn').addEventListener('click', ()=>{
        uiCon.showLoginDiv();
    })

    const logCon = new LoginController();
    const loginform = document.getElementById("login-form");
    loginform.addEventListener('submit', (event)=>{
        event.preventDefault();
        logCon.tryLogin(loginform);
        if(true){
            uiCon.hideLoginDiv();
        };
    })

}
)

class UIController{
    constructor(){}

    showLoginDiv(){
        document.getElementById('login-container').classList.remove("hidden");
        document.getElementById("overlay").classList.remove('hidden');
    }

    hideLoginDiv(){
        document.getElementById('login-container').classList.add("hidden");
        document.getElementById("overlay").classList.add('hidden');
    }
}

class LoginController{
    constructor(){}

    tryLogin(loginform){
        fetch('https://dummyjson.com/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              
              username: `${loginform.username.value}`,
              password: `${loginform.password.value}`,
              expiresInMins: 30,
            }),
          })
          .then(res => {
            if(!res.ok){
                throw new Error("Invalid");
            }
            return res.json();
            })
            .then(data => {
                sessionStorage.setItem("token", data.accessToken);
                console.log(data.accessToken);
                sessionStorage.setItem("user", data);

               window.location = '/src/pages/dashboard.html';
            })
            .catch(error=>{
                console.log(error);
            }
            )
    }

}