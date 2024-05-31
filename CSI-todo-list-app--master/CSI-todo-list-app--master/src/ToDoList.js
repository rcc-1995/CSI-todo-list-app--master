import React, { useState, useEffect } from 'react';
import './ToDoList.css';

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editInput, setEditInput] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim()) {
      const newTask = {
        id: Date.now(),
        text: input,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setInput('');
    } else {
      alert('Task cannot be empty');
    }
  };

  const removeTask = (id) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  };

  const toggleTaskCompletion = (id) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const startEditingTask = (id, text) => {
    setEditTaskId(id);
    setEditInput(text);
  };

  const saveEditedTask = (id) => {
    const newTasks = tasks.map(task =>
      task.id === id ? { ...task, text: editInput } : task
    );
    setTasks(newTasks);
    setEditTaskId(null);
    setEditInput('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sort === 'alphabetical') return a.text.localeCompare(b.text);
    if (sort === 'completion') return a.completed - b.completed;
    return 0;
  });

  return (
    <div className="todo-container">
      <h1 className="todo-header">To-Do List</h1>
      <div className="todo-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="todo-filters">
        <label>
          Filter:
          <select onChange={(e) => setFilter(e.target.value)} value={filter}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </label>
        <label>
          Sort:
          <select onChange={(e) => setSort(e.target.value)} value={sort}>
            <option value="default">Default</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="completion">Completion</option>
          </select>
        </label>
      </div>

      <ul className="todo-list">
        {sortedTasks.map(task => (
          <li key={task.id} className={`todo-item ${task.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            {editTaskId === task.id ? (
              <input
                type="text"
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
              />
            ) : (
              <span>{task.text}</span>
            )}
            {editTaskId === task.id ? (
              <button onClick={() => saveEditedTask(task.id)}>Save</button>
            ) : (
              <button onClick={() => startEditingTask(task.id, task.text)}>Edit</button>
            )}
            <button onClick={() => removeTask(task.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
