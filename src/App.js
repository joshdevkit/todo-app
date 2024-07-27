import React, { useState, useEffect } from 'react';
import { supabase } from './util/supabase';

function App() {
  const [tasks, setTasks] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const { data, error } = await supabase
        .from('todo')
        .select('*');
      if (error) console.error('Error fetching todos:', error);
      else setTodos(data || []); 
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  const handleAddTodo = async () => {
    if (tasks.trim()) {
      const { data, error } = await supabase
        .from('todo')
        .insert([{ tasks: tasks.trim() }])
        .single();
      if (error) console.error('Error adding tasks:', error);
      else {
        setTasks('');
        fetchTodos(); 
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    const { error } = await supabase
      .from('todo')
      .delete()
      .eq('id', id);
    if (error) console.error('Error deleting task:', error);
    else fetchTodos(); 
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Todo List</h1>
        <div className="flex mb-6">
          <input
            type="text"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
            placeholder="What's on your mind?"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none"
          >
            Add
          </button>
        </div>
        <ul className="list-disc pl-5 space-y-4">
          {todos.map((item) => (
            item && item.tasks ? (
              <li key={item.id} className="flex items-center justify-between text-lg">
                <span>{item.tasks}</span>
                <button
                  onClick={() => handleDeleteTodo(item.id)}
                  className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                >
                  Delete
                </button>
              </li>
            ) : null
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
