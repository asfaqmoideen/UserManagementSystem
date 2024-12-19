export class UsersController{
    constructor() {
        this.userApi = new UserAPIService();
        this.usersUI = new UsersUIController();
    }
    async tryDisplayingAllUsers(){
        const userPerPage = 8;
        const allUsers = await this.userApi.getAllUsers(userPerPage,0);
        const numberOfpages = allUsers.total/userPerPage;

        console.log(allUsers);
        this.usersUI.displayAllUsers(allUsers);
    }
}


class UserAPIService{
    constructor() {}
    
    async getAllUsers(limit, skip){
        const reponse = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
        return reponse.json();
    }

}
class UsersUIController{
    constructor(){
        this.currentPage = 1;
    }

    displayAllUsers(users){
        console.log(users.users);
        const usersTable = document.querySelector("#users-table tbody");

        usersTable.textContent = " "; 

        users.users.forEach(user => {
            const row = document.createElement('tr');
                for(let key in user){
                    var cell;
                    if(key == "id" || key == "firstName" || key == "lastName" ||
                        key == "email" || key == "phone" || key == "role" ){
                        cell = document.createElement('td');
                        cell.textContent = user[key];
                        }
                        row.appendChild(cell);
                }
                usersTable.appendChild(row); 
        });

    }

    setPaginationControls(){
        const paginateDiv = document.getElementById('paginate-div');
        const line = paginateDiv.createElement('p');

        const nextBtn = document.createElement("button");
        nextBtn.addEventListener('click',()=>{
            this.currentPage++;
        })
        line.appendChild(nextBtn);

        if(this.currentPage > 0){
            const prevBtn = document.createElement("button");
            prevBtn.addEventListener('click', ()=>{
                this.currentPage--;
            })
            line.appendChild(prevBtn);
        }
    }
}

class PaginateController{
    constructor() {
        this.currentPage = 1;
    }
    
}