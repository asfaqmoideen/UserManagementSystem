document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    console.log(token);
    const uiCon = new UIController();
    const userCon = new UserController(uiCon);
    
    if(userCon.validateUserWithToken(token));

    document.getElementById('logout-btn').addEventListener('click', () => {
        uiCon.tryLogout();
    })
})


class UserController{
    constructor(uicon){
        this.uicon = uicon;
    }

    validateUserWithToken(token){
        console.log(token);
        fetch('https://dummyjson.com/user/me', {
            method: 'GET',
            headers: {
            'Authorization': `${token}`, // Pass JWT via Authorization header
            }
            })
        .then(res => res.json())
        .then(user =>{
            this.uicon.setWelcomeMessage(user.firstName)
        });
    }

    tryLogout(){

        localStorage.removeItem("token");
    }
}

class UIController{
    constructor(){}

    setWelcomeMessage(user){
        document.getElementById("welcome-span").textContent = user;
    }
}