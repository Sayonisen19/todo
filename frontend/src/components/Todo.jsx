import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Form, Button, Container, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/todos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTodos(response.data);
      } catch (err) {
        toast.error('Failed to load todos');
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/todos', { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos([...todos, response.data]);
      setText('');
      toast.success('Todo added');
    } catch (err) {
      toast.error('Failed to add todo');
    }
  };


  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.filter(todo => todo._id !== id));
      toast.success('Todo deleted');
    } catch (err) {
      toast.error('Failed to delete todo');
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setText(todo.text);
    setShowModal(true);
  };

  const handleUpdateTodo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/todos/${editingTodo._id}`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.map(todo => todo._id === editingTodo._id ? response.data : todo));
      setText('');
      setEditingTodo(null);
      setShowModal(false);
      toast.success('Todo updated');
    } catch (err) {
      toast.error('Failed to update todo');
    }
  };

  return (
    <Container>
      <h2>Todo List</h2>
      <Form onSubmit={handleAddTodo}>
        <Form.Group>
          <Form.Control 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            required 
            placeholder="Enter todo" 
          />
        </Form.Group>
        <Button variant="primary" type="submit">Add Todo</Button>
      </Form>
      <ListGroup className="mt-3">
        {todos.map(todo => (
          <ListGroup.Item key={todo._id} className="d-flex justify-content-between align-items-center">
            <div>
              <span 
                className={todo.completed ? 'completed' : ''} 
                style={{ marginLeft: '10px' }}
              >
                {todo.text}
              </span>
            </div>
            <div>
              <Button 
                variant="secondary" 
                onClick={() => handleEditTodo(todo)}
              >
                Update
              </Button>{' '}
              <Button 
                variant="danger" 
                onClick={() => handleDeleteTodo(todo._id)}
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Edit Todo Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              required 
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateTodo}>Update Todo</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Todo;
