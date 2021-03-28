const d = document;
const queryButton = d.querySelector('.main__button');
const fullForm = d.getElementById('formAllPage');
const formToChange = d.getElementById('formToChange');

const todoItemList = d.querySelector('.main__list');
const createForm = d.getElementById('create');

const itemDelete = d.querySelector('.item--delete');
const searchForm = d.querySelector('.header__form-input');
const fullFormClose = d.querySelectorAll('.full__form-close');
 
const todoItemLists = d.querySelectorAll('.main__list');

const titleForm = d.getElementById('title');
const descriptionForm = d.getElementById('description');
const searchBtn = d.getElementById('searchButton');

const titleChange = d.getElementById('titleChange');
const descriptionChange = d.getElementById('descriptionChange');
const change = d.getElementById('change');

queryButton.onclick = function(){
    fullForm.classList.toggle('visible');
}

fullFormClose.forEach(t => {
    t.addEventListener('click', () => {
        if(fullForm.click)
            fullForm.classList.remove('visible');

        if(formToChange.click)
            formToChange.classList.remove('visible');
    })
})

function isEmpty(message){
    return message.trim() === '';
}

function _borderTopBottom(form, value){
    form.style.borderTop = value;
    form.style.borderBottom = value;
}

let todos = [];

(function(){
    function Todo(
        title,
        description
    ){
        this.id = Math.floor(Math.random() % 24 * 10000);
        this.title = title;
        this.description = description;
    }

    Todo.prototype = {
        addTodo: function(title, description){
            todos.push(new Todo(title, description));

            this.setLocaleStorage(todos);
        },

        renderTodo: function(todo){
            todoItemList.innerHTML = '';
            todo.forEach((t, i) => {
                if(t){
                    const li = d.createElement('li');
                    t.id = t.id + 1;
                    li.setAttribute('key', t.id);
                    li.className = 'main__list-item';
                    li.innerHTML = `
                        <span class="item--title">${t.title}</span>
                        <span class="item--description">${t.description}</span>
                        <span class="item--delete"></span>
                    `;
                    todoItemList.insertAdjacentElement('beforeend', li);
                }
            })
        },

        setLocaleStorage: function(todo){
            window.localStorage.setItem('todo', JSON.stringify(todos));

            this.renderTodo(todo);
        },

        getFromLocaleStorage: function(){
            let item = window.localStorage.getItem('todo');
                if(item){
                    todos = JSON.parse(item);

                    this.setLocaleStorage(todos);
                }
        },

        deleteTodo: function(id){
            if(confirm('Вы уверены?')){
                todos = todos.filter(t => {
                    return t.id != id;
                })

                this.setLocaleStorage(todos);
            }
        },

        filterTodo: function(){
            let array = [...todos];
            const text = searchForm.value.toLowerCase();

            if(!isEmpty(text)){
                array = array.filter((t, i) => 
                    t.title.toLowerCase() === text || 
                    t.description.toLowerCase() === text);
            }

            this.renderTodo(array);
        },

        
        changeTodo: function(event){
            const query = d.querySelectorAll('.' + event.className);

            let target = event.closest('li').querySelectorAll('span');
            
            let title = titleChange;
            let description = descriptionChange;

            title.value = target[0].innerText;
            description.value = target[1].innerText;
                    
            change.addEventListener('click', () => {
                if(isEmpty(title.value) && isEmpty(description.value)){
                    formToChange.classList.remove('visible');

                    return;
                }

                target[0].innerText = title.value;
                target[1].innerText = description.value;

                for(let i = 0; i < query.length; i++){
                    target = event.closest('li').querySelectorAll('span');
                    if(todos[i].id == event.closest('li').getAttribute('key')){
                        todos[i].title = target[0].innerText;
                        todos[i].description = target[1].innerText;
                        
                        this.setLocaleStorage(todos);
                        break;
                    }
                }

                formToChange.classList.remove('visible');
            })
        },
    }

        let todo = new Todo();
        todo.getFromLocaleStorage();


        createForm.onclick = function(){
            _borderTopBottom(titleForm, '1px solid #000');
            _borderTopBottom(descriptionForm, '1px solid #000');

            if(isEmpty(descriptionForm.value) && isEmpty(titleForm.value)){
                _borderTopBottom(titleForm, '1px solid rgb(255, 80, 80)');
                _borderTopBottom(descriptionForm, '1px solid rgb(255, 80, 80)');

                return;
            }

            todo.addTodo(titleForm.value, descriptionForm.value);

            todo.setLocaleStorage(todos);
        }

        todoItemList.onclick = function(event){
            if(event.target.classList.contains('item--delete')){
                todo.deleteTodo(event.target.parentNode.getAttribute('key'));
            } 
            
            if(event.target.classList.contains('main__list-item')){
                formToChange.classList.toggle('visible');

                todo.changeTodo(event.target);
            }
        }

        searchBtn.onclick = function(){
            todo.filterTodo();
        }
}());

