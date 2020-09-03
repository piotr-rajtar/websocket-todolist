import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  };

  componentDidMount() {
    this.socket = io('http://localhost:8000');
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', ({index, serverRun}) => this.removeTask(index, serverRun));
    this.socket.on('updateData', (tasks) => this.updateData(tasks));
  }

  removeTask(taskIndex, serverRun = false) {
    const { tasks } = this.state;

    const updatedTaskList = tasks.filter(task => tasks.indexOf(task) !== taskIndex);

    this.setState({
      tasks: updatedTaskList,
    });

    if(serverRun === false) {
      this.socket.emit('removeTask', (taskIndex));
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
    this.addTask(taskName);

    this.socket.emit('addTask', (taskName));
  }

  addTask(task) {
    const { tasks } = this.state;

    this.setState({
      tasks: [...tasks, task],
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
                key={tasks.indexOf(task)} 
                className="task"
              >
                {task} 
                <button 
                  className="btn btn--red" 
                  onClick={() => this.removeTask(tasks.indexOf(task))}>
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
