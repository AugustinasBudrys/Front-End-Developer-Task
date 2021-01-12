function addTask(event){
	event.preventDefault();
	var description = document.getElementById("description").value;
	var deadline = document.getElementById("deadline").value;
	
	if(typeof(Storage) !== "undefined") {
		if (sessionStorage.lastId) {
			sessionStorage.lastId = Number(sessionStorage.lastId)+1;
		} else {
			sessionStorage.lastId = 1;
	}}
	
	var obj = { 
		id: sessionStorage.lastId,
		description: description, 
		deadline: deadline, 
		completed: false
	}
	
	sessionStorage.setItem(sessionStorage.lastId, JSON.stringify(obj));

	refreshTaskList();

	document.getElementById("description").value = "";
    document.getElementById("deadline").value = "";
}

function compareTimeTillDeadLine(task1, task2){
	return (new Date(task1.deadline) - new Date(task2.deadline));
}

function compareLatestCompleted(task1, task2){
	return (new Date(task1.deadline) - new Date(task2.deadline));
}

function refreshTaskList() {

	var completedArray = [];
	var notCompletedArray = [];

	for (let i = 1; i <= Number(sessionStorage.lastId); i++) {
		var taskData = JSON.parse(sessionStorage.getItem(i.toString()));
		if (taskData === undefined || taskData === null) {
			continue;
		}
		if (taskData.completed) {
			completedArray.push(taskData);
		} else {
			notCompletedArray.push(taskData);
		}
	}

	completedArray.sort(compareLatestCompleted);
	notCompletedArray.sort(compareTimeTillDeadLine);

	var table = document.getElementById("taskList");
	table.innerHTML = "";
	notCompletedArray.forEach((taskData) => {
		createTask(table, taskData);
	});
	completedArray.forEach((taskData) => {
		createTask(table, taskData);
	});
}

function createTask(table, taskData){
	var row = table.insertRow(-1);

	var descriptionCell = row.insertCell(0);
	var deadlineCell = row.insertCell(1);
	var completedCell = row.insertCell(2);
	var actionsCell = row.insertCell(3);
	var deadline = new Date(new Date(taskData.deadline) - Date.now());

	var btn = document.createElement('input');
	btn.type = "button";
	btn.className = "btn";
	btn.value = "Delete";
	btn.id = taskData.id;
	btn.addEventListener("click", deleteTask);

	var completed = document.createElement('input');

    completed.setAttribute('type', 'checkbox');
 	completed.setAttribute(':checked', taskData.completed);
	completed.setAttribute('id', taskData.id);
	completed.addEventListener("change", changeStatus);

	descriptionCell.innerHTML = taskData.description;
	if(isNaN(deadline)){
		deadlineCell.innerHTML = "-";
	}else{
		deadlineCell.innerHTML = deadline.getDate() + " days " + deadline.getHours() + " hours " + deadline.getMinutes() + " minutes";
	}
	completedCell.appendChild(completed);
	actionsCell.appendChild(btn);
	
}

function deleteTask(event){
	sessionStorage.removeItem(this.id);
	refreshTaskList();
}

function changeStatus(event){
	var task = JSON.parse(sessionStorage.getItem(event.target.id));
	task.completed = event.target.checked;
	console.log(task.completed == "true");
	sessionStorage.setItem(event.target.id, JSON.stringify(task));
	refreshTaskList();
}