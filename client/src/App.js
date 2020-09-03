import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  };

  componentDidMount() {
    this.socket = io('http://localhost:8000');
    this.socket.on('addTask', ({id, taskName}) => this.addTask(taskName, id));
    this.socket.on('removeTask', (taskToRemove, {serverRun}) => this.removeTask(taskToRemove, serverRun));
    this.socket.on('updateData', (tasks) => this.updateData(tasks));
  }

  removeTask(taskToRemove, serverRun = false) {
    const { tasks } = this.state;

    const updatedTaskList = tasks.filter(task => task.id !== taskToRemove.id);

    this.setState({
      tasks: updatedTaskList,
    });

    if(serverRun === false) {
      this.socket.emit('removeTask', (taskToRemove));
    }
  }

  handleChange = (event) => {
    this.setState({
      taskName: event.target.value
    });
  }

  submitForm = (event) => {
    const { taskName } = this.state;
    event.preventDefault();

    const taskId = uuidv4();
    this.addTask(taskName, taskId);

    this.socket.emit('addTask', ({id: taskId, taskName: taskName}));
  }

  addTask(task, taskId) {
    const { tasks } = this.state;

    this.setState({
      tasks: [
        ...tasks, 
        {
          id: taskId,
          taskName: task,
        },
      ],
      taskName: '',
    });
  }

  updateData(tasks) {
    this.setState({
      tasks: [...tasks],
    });
  }

  render() {
    const {tasks, taskName} = this.state;

    return (
      <div className="App">
        <header>
          <h1>To-Do-List</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li 
                key={task.id} 
                className="task"
              >
                {task.taskName} 
                <button 
                  className="btn btn--red" 
                  onClick={() => this.removeTask(task)}>
                    Remove
                </button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={this.submitForm}>
            <input 
              className="text-input" 
              autoComplete="off" 
              type="text" 
              placeholder="Type your description"   
              id="task-name" 
              value={taskName}
              onChange={this.handleChange}
            />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  }
} 

export default App;
