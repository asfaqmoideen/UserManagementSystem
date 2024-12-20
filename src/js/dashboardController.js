import { UsersController } from "./usersController";

document.addEventListener('DOMContentLoaded', async() => {
    const token = sessionStorage.getItem('token');
    const logCon = new loginController();
    logCon.validateUserWithToken(token);
    
    const userCont = new UsersController();
    userCont.tryDisplayingUserProfile(JSON.parse(sessionStorage.getItem("user")));

    document.getElementById('users').addEventListener("click", async() => {
        await userCont.tryDisplayingUsers();
    })
    document.getElementById('dp').addEventListener("click", () => {
        document.getElementById("dpcard").classList.toggle("hidden");

    })
    document.getElementById('logout-btn').addEventListener('click', () => {
        logCon.tryLogout();
    });

    document.getElementById("todos").addEventListener("click",async ()=>{
        await userCont.tryDisplayingTodos();
    });


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
            sessionStorage.setItem("user", JSON.stringify(user));
            if(user.role == "admin"){
                document.getElementById("usermgmt").classList.remove('hidden');
            }
            this.uicon.setProfileDetails(user)
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
                    sessionStorage.removeItem('user');
                    document.location = "/index.html";
                }
        }))
    }
}

class UIController{
    constructor(){}

    setProfileDetails(user){
        document.getElementById("dp").src = user.image;
        document.getElementById('name').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('role').textContent = user.role;
        document.getElementById('company').textContent = user.company.name;
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

