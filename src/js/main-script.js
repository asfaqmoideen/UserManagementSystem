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
    })

}
)

class UIController{
    constructor(){}

    showLoginDiv(){
        document.getElementById('login-container').classList.remove("hidden");
        document.getElementById("overlay").classList.remove('hidden');
    }

    displayErrorMessage(message)
    {
        document.getElementById('login-error').textContent = message;
    }

}

class LoginController{
    constructor(){
        this.ui = new UIController();
    }

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
                console.log(data);
                sessionStorage.setItem("token", data.accessToken);
                window.location = '/src/pages/dashboard.html';
            })
            .catch(error=>{
                this.ui.displayErrorMessage(`${error.message} Credentials`);
                console.log(error);
            }
            )
    }

}