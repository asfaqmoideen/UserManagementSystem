import { UsersController } from "./usersController";

document.addEventListener('DOMContentLoaded', async() => {
    const token = sessionStorage.getItem('token');
    const logCon = new loginController();
    logCon.validateUserWithToken(token);
    
    const userCont = new UsersController();
    userCont.tryDisplayingAllUsers();

    document.getElementById('logout-btn').addEventListener('click', () => {
        logCon.tryLogout();
    })
})


class loginController{
    constructor(){
        this.uicon = new UIController();
    }

    validateUserWithToken(token){
        fetch('https://dummyjson.com/user/me', {
            method: 'GET',
            headers: {
            'Authorization': `${token}`, 
            }
            })
        .then(res => {
            if(!res.ok){
                document.location = '/index.html';
                throw new Error("User is not Authorised.");
            }
            return res.json();
        }
        )
        .then(user =>{
            this.uicon.setWelcomeMessage(user.firstName)
        })
        .catch((err) => {
            console.log(err);
        });
    }

    tryLogout(){
        this.uicon.getUserConfirmation('to leave this session')
            .then((result=>{
                if(result){
                    sessionStorage.removeItem('token');
                    document.location = "/index.html";
                }
            }))
    }
}

class UIController{
    constructor(){}

    setWelcomeMessage(userName){
        document.getElementById("welcome-span").textContent = userName;
    }

    getUserConfirmation(context) {
        this.showConfirmationBlock(true);
        document.getElementById('confirm-title').textContent = `Are you sure ${context}?`;
    
        return new Promise((resolve) => {
            document.getElementById('yesbtn').onclick = () => {
                this.showConfirmationBlock(false);
                resolve(true);
            };
            document.getElementById('nobtn').onclick = () => {
                this.showConfirmationBlock(false);
                resolve(false);
            };
        });
    }

    showConfirmationBlock(value){
        const confirm = document.getElementById('confirmation');
        if(value){
            confirm.style.display = "block";
            return;
        }
        confirm.style.display = "none";
    }
}

