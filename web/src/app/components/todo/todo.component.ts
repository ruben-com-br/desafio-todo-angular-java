import { Component, computed, effect, inject, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';
import { FormGroup, FormsModule , FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  private baseUrl:string = '' 

  fg = inject(FormBuilder)
  fg2 = inject(FormBuilder)
  
  private colorPre:String = "block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-[###] peer-checked:font-bold peer-checked:text-white";
  private colorLow:String = this.colorPre.replace("###","#f0ad4e");
  private colorMedium:String = this.colorPre.replace("###","#5cb85c");
  private colorHight:String = this.colorPre.replace("###","#00FFFF");
  options = [
    {id: 'Baixa', label: 'Baixa', value:'Baixa', color: this.colorLow },
    {id: 'Media', label: 'Media', value:'Media', color: this.colorMedium },
    {id: 'Alta', label: 'Alta', value:'Alta', color: this.colorHight }
  ]

  getClassPriority(priority:String) {

    const stylePriority = "flex ### px-4 py-2 rounded-lg items-center gap-2";
    switch (priority) {
      case 'BAIXA':
        //return 'bg-[#f0ad4e]';
        return stylePriority.replace('###','bg-[#f0ad4e]');
      case 'MEDIA':
        //return 'bg-[#5cb85c]';
        return stylePriority.replace('###','bg-[#5cb85c]');
      case 'ALTA':
        //return 'bg-[#00FFFF]';
        return stylePriority.replace('###','bg-[#0000FF]');
      default:
        //return 'bg-background-300';
        return stylePriority.replace('###','bg-background-300');
    }
  }
  form: FormGroup = this.fg.group({
    selectedOption: ['', Validators.required]
  });
  newTodo = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });
  newTodoDescription = new FormControl('', {nonNullable: true,});

  form2: FormGroup = this.fg2.group({
    selectedOption2: ['', Validators.required]
  });
  newTodoEdit = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });
  newTodoDescriptionEdit = new FormControl('', {nonNullable: true,});
  todolist = signal<TodoModel[]>([]);
  
  filter = signal<FilterType>('none');

  private filterSelect = 'all';

  todoListFiltered = computed(() => {
    const filter= this.filter(); 
    const todos=  this.todolist();
    switch (filter) {
      case 'active':
        this.filterSelect = 'active';
        break;
      case 'completed':
        this.filterSelect = 'completed';
        break;
      default:
        this.filterSelect = 'all';
        break;
    }
    this.refresh()
    return todos;
  });
  
  clearTasks(){
    while(this.todolist().length > 0){
      this.todolist().pop()
    }
  }
  refresh(){
    this.clearTasks();
    switch(this.filterSelect){
      case 'all':
        this.getAll();
        break;
      case 'active':
        this.getALLToDo();
        break;
        case 'none':
          this.clearTasks();
          break;  
      default:
        this.getAll();
        break;
    }
  }  
  
  


  

  constructor(private http:HttpClient, private formBuilder: FormBuilder) { 
    this.form = this.formBuilder.group({
      selectedOption: ['Baixa'] // Inicialmente nenhum selecionado
    });
    this.form2 = this.formBuilder.group({
      selectedOption: ['Baixa-Edit'] // Inicialmente nenhum selecionado
    });
    effect(() => {
      this.baseUrl = environment.todoApi     
      localStorage.setItem('todos', JSON.stringify(this.todolist()));
    });
  }
  
  private getALLToDo(): void {
    let myArray: any[] = []

    this.clearTasks();
    this.http.get<TodoModel[]>(`${this.baseUrl}/getAllToDo`)
      .subscribe((res) =>{
        myArray = res;
        myArray.forEach((elem) => {          
          this.todolist().push({
            id: elem.id,
            title: elem.title,
            description: elem.description,
            priority: elem.priority,
            completed: elem.status === 'CONCLUIDA' ? true : false,
            editing: false,
          });
        })
      })       
  }
  
  private getAll(): void{
    let myArray: any[] = []

    this.clearTasks();
    this.http.get<TodoModel[]>(`${this.baseUrl}/getAll`)
      .subscribe((res) =>{
        myArray = res;
        myArray.forEach((elem) => {          
          this.todolist().push({
            id: elem.id,
            title: elem.title,
            description: elem.description,
            priority: elem.priority,
            completed: elem.status === 'CONCLUIDA' ? true : false,
            editing: false,
          });
        })
      })       
  }

  ngOnInit(): void{
    this.getAll();
    
    const storage = localStorage.getItem('todos');
    if (storage) {
      this.todolist.set(JSON.parse(storage));
    }
  }

  changeFilter(filterString: FilterType){
    this.filter.set(filterString);
  }

  addTodo(){
    const newTodoTitle = this.newTodo.value.trim();
    const newTodoDescription = this.newTodoDescription.value.trim();
    const selectedValue = this.form.get('selectedOption')?.value;
    if (this.newTodo.valid && newTodoTitle !== '' && selectedValue !== ''){
      this.clientApiSave({
        title: newTodoTitle,
        description: newTodoDescription,
        priority: selectedValue,
        id: 0,
        completed: false
      })
      this.todolist.update((prev_todos) => {
        return [
          ...prev_todos,
          { id: Date.now(), title: newTodoTitle, description: newTodoDescription, completed: false, priority: selectedValue}
        ];
      });
    } 
      this.newTodo.reset();
      this.newTodoDescription.reset();
      this.refreshPage();
  }

  toggleTodo(todoId: number) {
      
    let result:any  = this.todolist.update((prev_todos) => 
      prev_todos.map((todo) => {  
        if (todo.id === todoId) {
          this.updateStatus(todo.id, todo.completed);
          
        }
        return todo; 
      })
    );
    this.refreshPage()
    
    return result;
    
  }
  
  removeTodo(todoId: number){
    this.http.delete(`${this.baseUrl}/${todoId}`).subscribe()
    this.clearTasks();
  }

  updateTodoEditingMode(todoId: number){
    this.editingId = todoId;
    return this.todolist.update((prev_todos) =>
      prev_todos.map((todo) => {
        return todo.id === todoId
        ? {...todo, editing: true } 
        : {...todo, editing: false };
      })
    );
  }

  updateTodoSave(todoId:number){
    this.editingId = -1;
    const titleEdit = this.newTodoEdit.value.trim();
    const descriptionEdit = this.newTodoDescription.value.trim();
    const selectedValue = this.form.get('selectedOption2')?.value;

    if (this.newTodoEdit.valid && titleEdit !== '' && selectedValue !== ''){
      this.clientApiUpdate({
        title: titleEdit,
        description: descriptionEdit,
        priority: selectedValue,
        id: todoId,
        completed: false
      })
    } 
    this.refreshPage
  }
  
  saveTitleTodo(todoId: number, event: Event){
    this.editingId = -1;
    const title = (event.target as HTMLInputElement).value;
    let todoUpdate: any;
    let result = this.todolist.update((prev_todos) => 
      prev_todos.map((todo) => {
        if (todo.id === todoId){
          todoUpdate = {...todo, title, editing: false }
          return todoUpdate;
        } else {
          return todo;
        }
        })
      );
      this.clientApiUpdate(todoUpdate);
      return result;
  }

  private editingId : number = -1; 

  getEditingId(){
    return this.editingId
  }

  clearEditingId(){
    this.editingId = -1;
  }

  refreshPage() {
    window.location.reload();
  }

  cancelEdit(todoId: number){
    this.clearEditingId;
    let todoUpdate: any;
    let result = this.todolist.update((prev_todos) => 
      prev_todos.map((todo) => {
        if (todo.editing){
          todoUpdate = {...todo, editing: false }
          return todoUpdate;
        } else {
          return todo;
        }
        })
      );
    this.refreshPage()
  }

  // client api

  updateStatus(todoId: number, completed: boolean){
    const status = completed ? 'PENDENTE': 'CONCLUIDA' ;
    this.http.patch<any>(`${this.baseUrl}/${todoId}/${status}`,null).subscribe()
  }

  clientApiUpdate(todo: TodoModel) {
    let bodyUpdate: Object = {
      "title": todo.title,
      "description": todo.description,
      "priority": todo.priority
    } 
    this.http.put<any>(`${this.baseUrl}/${todo.id}`, bodyUpdate).subscribe()
    this.clearTasks();
  }

  clientApiSave(todo:TodoModel) {
    console.log('todo.description');
    console.log(todo.description);
    let bodyPost: Object = {
      "title": todo.title,
      "description": todo.description,
      "priority": todo.priority
    } 
    this.http.post<any>(`${this.baseUrl}`, bodyPost).subscribe()
    this.clearTasks();
  }
}

/*
  ok Task saveTask(TaskDTO task);
  
  ok void deleteTaskById(Long id);

  ok updateTask(TaskDTO task, Long id);

  ok Task updateStatus(String status, Long id);

  ok List<Task> getAllTasks();

  nao Task getTaskById(Long id);

  ok List<Task> getAllTodo();
}
*/