export class UsersController{
    constructor() {
        this.usersUI = new UsersUIController();
    }

    async tryDisplayingUserProfile(user){
        await this.usersUI.displayUserProfile(user);
    }
    
    async tryDisplayingUsers(){
        await this.usersUI.displayUsers();
    }

    async tryDisplayingTodos(){
        await this.usersUI.displayTodos()
    }

    async tryDisplayingPosts(){
        await this.usersUI.displayPosts();
    }

    async tryDisplayingCarts(){
        await this.usersUI.displayCarts();
    }
}


class UserAPIService{
    constructor() {
        this.userId = JSON.parse(sessionStorage.getItem("user")).id;
    }
    
    async getAllUsers(){
        const reponse = await fetch(`https://dummyjson.com/users`);
        return reponse.json();
    }

    async getUsers(limit, skip){
        const reponse = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
        return reponse.json();
    }

    async getAllTodos(){
        const response = await fetch(`https://dummyjson.com/users/${this.userId}/todos`);
        return response.json();
    }

    async getAllPosts(){
        const response = await fetch(`https://dummyjson.com/users/${this.userId}/posts`);
        return response.json();
    }

    async getAllCarts(){
        const response = await fetch(`https://dummyjson.com/users/${this.userId}/carts`);
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
        document.getElementById('profilePic').src = user.image;

        const personalProfileDiv = document.getElementById("personalprofile-div");
        document.getElementById("viewPersonalBtn").addEventListener('click', ()=>{
            personalProfileDiv.classList.toggle("hidden");
        });

        const personalDiv = document.getElementById("personal-div");
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

        for(let key in user){
            if(key == "id" || key == "firstName" || key == "lastName" ||
                key == "birthDate" || key == "age" ||
                key == "email" || key == "phone" || key == "role" ||
                key == "university" || key =="company"){
                    if(typeof(user[key]) == "object"){
                        for(let skey in user[key]){
                            if(typeof(user[key][skey]) == "object"){
                                return;
                            }
                            const profileGrp = document.createElement("div");
                            const pdTitle = document.createElement("h3");
                            pdTitle.textContent = `${key} ${skey}`;
                            const pdText = document.createElement("p");
                            pdText.textContent = user[key][skey];
                            profileGrp.appendChild(pdTitle);
                            profileGrp.appendChild(pdText);
                            profileDiv.appendChild(profileGrp);
                        }
                        return;
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
    }

    async displayTodos(){
        const grid = document.getElementById("todos-grid");
        grid.textContent = "";
        const todosFromAPI =  await this.userApi.getAllTodos();
        console.log(todosFromAPI);
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

    async displayPosts(){
        const div = document.getElementById("posts-div");
        div.textContent = "";
        const postsFromAPI =  await this.userApi.getAllPosts();
        console.log(postsFromAPI);
        postsFromAPI.posts.forEach((post) => {
            
            const tile = document.createElement("div");
            tile.className = "tile";
            const title = document.createElement('h3');
            title.textContent = post.title;
            tile.appendChild(title);
            const body = document.createElement('p');
            body.textContent = post.body;
            tile.appendChild(body);

            const postTags = document.createElement("p");
            postTags.textContent = "Tags : "
            post.tags.forEach((tag) => {
                const atag = document.createElement("span");
                atag.textContent = `${tag}, `;
                postTags.appendChild(atag);
            });
            tile.appendChild(postTags);

            const postReactions = document.createElement("p");
            postReactions.textContent = "Reactions : "
            for(let key in post.reactions){
                const postreaction = document.createElement("span");
                postreaction.textContent = `${key} : ${post.reactions[key]} `;
                postReactions.appendChild(postreaction);
            }
            tile.appendChild(postReactions);
            div.appendChild(tile);
        });
    }
    async displayCarts(){
        const div = document.getElementById("carts-div");
        div.textContent = "";
        const cartsFromAPI =  await this.userApi.getAllCarts();
        console.log(cartsFromAPI);
        cartsFromAPI.carts.forEach((cart) => {
            console.log(cart);
            const tile = document.createElement("div");
            tile.className = "tile";

            const total = document.createElement('p');
            total.textContent = cart.total;
            tile.appendChild(total);

            const disTotal = document.createElement('p');
            disTotal.textContent = cart.dicountedTotal;
            tile.appendChild(disTotal);

            const productsTile = document.createElement("div");
            productsTile.className = "tile";
            productsTile.textContent = "Products : "
            cart.products.forEach((product) => {
                const ptitle = document.createElement("p");
                ptitle.textContent = ` ${product.title}, `;
                productsTile.appendChild(ptitle);
            });
            tile.appendChild(productsTile);

            div.appendChild(tile);
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
        const firstBtn = document.getElementById("first-btn");
        const lastBtn = document.getElementById("last-btn");
        document.getElementById('pagenumber').textContent = this.currentPage;
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        firstBtn.disabled = false;
        lastBtn.disabled = false;

        if (this.currentPage === 1) {
            prevBtn.disabled = true;
            firstBtn.disabled = true;
        }
        if (this.currentPage === this.maxPage) {
            nextBtn.disabled = true;
            lastBtn.disabled = true;
        }
    

        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
        const newFirstBtn = firstBtn.cloneNode(true);
        const newLastBtn = lastBtn.cloneNode(true)
    
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        firstBtn.parentNode.replaceChild(newFirstBtn, firstBtn);
        lastBtn.parentNode.replaceChild(newLastBtn, lastBtn);
    

        if (this.currentPage > 1) {
            newPrevBtn.addEventListener('click',async () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                }
                this.setPaginationControls();
                await this.displayUsers();
            });
            newFirstBtn.addEventListener("click",async () => {
                this.currentPage = 1;
                this.setPaginationControls();
                await this.displayUsers();
            })
        }
    
        if (this.currentPage < this.maxPage) {
            newNextBtn.addEventListener('click', async() => {
                this.currentPage++;
                this.setPaginationControls();
                await this.displayUsers();
            });
            newLastBtn.addEventListener("click", async () => {
                this.currentPage=this.maxPage;
                this.setPaginationControls();
                await this.displayUsers();
            });
        }
    }
    
}
