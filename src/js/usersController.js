export class UsersController{
    constructor() {
        this.usersUI = new UsersUIController();
    }

    async tryDisplayingUserProfile(user){
        this.usersUI.displayUserProfile(user);
    }
    
    async tryDisplayingUsers(){
        this.usersUI.displayUsers();
    }

    async tryDisplayingTodos(){
        this.usersUI.displayTodos()
    }


}


class UserAPIService{
    constructor() {}
    
    async getAllUsers(){
        const reponse = await fetch(`https://dummyjson.com/users`);
        return reponse.json();
    }

    async getUsers(limit, skip){
        console.log(limit, skip);
        const reponse = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
        return reponse.json();
    }

    async getAllTodos(){
        const currentUserId = JSON.parse(sessionStorage.getItem("user")).id;
        const response = await fetch(`https://dummyjson.com/users/${currentUserId}/todos`);
        return response.json();
    }

}


class UsersUIController{
    constructor(){
        this.userApi = new UserAPIService();
        this.currentPage = 1;
        this.usersPerPage = 8;
        this.maxPage = 1;
    }

    async displayUserProfile(user){
        const profileDiv = document.getElementById('profile-div');

        for(let key in user){
            if(key == "id" || key == "firstName" || key == "lastName" ||
                key == "birthDate" || key == "age" ||
                key == "email" || key == "phone" || key == "role" ||
                key == "university" || key =="company"){
                    if(typeof(user[key]) == "object"){
                        for(let skey in user[key]){
                            console.log(skey);
                        }
                    }
                    const profileGrp = document.createElement("div");
                    const pdTitle = document.createElement("h3");
                    pdTitle.textContent = key;
                    const pdText = document.createElement("p");
                    pdText.textContent = user[key];
                    profileGrp.appendChild(pdTitle);
                    profileGrp.appendChild(pdText);
                    profileDiv.appendChild(profileGrp);
                }
        }
        const personalDiv = document.getElementById("personal-div");
        const personalProfileDiv = document.getElementById("personalprofile-div");

        for (let key in user){
            if(key == "bloodGroup" || key=="height" || key == "weight" || key =="eyeColor"){
                const profileGrp = document.createElement("div");
                    const pdTitle = document.createElement("h3");
                    pdTitle.textContent = key;
                    const pdText = document.createElement("p");
                    pdText.textContent = user[key];
                    profileGrp.appendChild (pdTitle);
                    profileGrp.appendChild( pdText);
                    personalDiv.appendChild(profileGrp);
            }
        }
        document.getElementById("viewPersonalBtn").addEventListener('click', ()=>{
            personalProfileDiv.classList.toggle("hidden");
        });
    }

    async displayTodos(){
        const grid = document.getElementById("todos-grid");
        grid.textContent = "";
        const todosFromAPI =  await this.userApi.getAllTodos();
        todosFromAPI.todos.forEach((todo) => {
            
            const tile = document.createElement("div");
            tile.className = "tile";
            const title = document.createElement('h3');
            title.textContent = todo.todo;
            tile.appendChild(title);

            const completedBtn = document.createElement("input");
            completedBtn.type = "checkbox"
            completedBtn.checked = todo.completed;
            tile.appendChild(completedBtn);

            if(todo.completed){
                tile.classList.add("completed");
            }

            completedBtn.addEventListener('change', ()=>{
                if(completedBtn.checked){
                tile.classList.add("completed");
                }
                if(!completedBtn.checked){
                    tile.classList.remove("completed");
                }
            })


            grid.appendChild(tile);
        });
    }
      

    async displayUsers(){
        const usersTable = document.querySelector("#users-table tbody");
        usersTable.textContent = " "; 
        let skip;

        if(this.currentPage==1){
            skip = 0;
        }
        if(this.currentPage > 1){
            skip = (this.currentPage-1)*8;
        }

        this.maxPage = Math.ceil(208 / this.usersPerPage);
        this.setPaginationControls();
        const paginatedUsers = await this.userApi.getUsers(this.usersPerPage,skip);

        paginatedUsers.users.forEach(user => {
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

    setPaginationControls() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        document.getElementById('pagenumber').textContent = this.currentPage;
        prevBtn.disabled = false;
        nextBtn.disabled = false;

        if (this.currentPage === 1) {
            prevBtn.disabled = true;
        }
        if (this.currentPage === this.maxPage) {
            nextBtn.disabled = true;
        }
    

        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
    
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    

        if (this.currentPage > 1) {
            newPrevBtn.addEventListener('click',async () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                }
                this.setPaginationControls();
                await this.displayUsers();
            });
        }
    
        if (this.currentPage < this.maxPage) {
            newNextBtn.addEventListener('click', async() => {
                this.currentPage++;
                this.setPaginationControls();
                await this.displayUsers();
            });
        }
    }
    
}
