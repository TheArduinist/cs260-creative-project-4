import logo from './logo.svg';
import './App.css';
import * as React from 'react';
import Riddle from './Riddle.js';
import Category from './Category.js';
import axios, * as others from 'axios';

const baseURL = "/api";

function App() {
  let [riddles, setRiddles] = React.useState([]);
  let [categories, setCategories] = React.useState([]);
  let [curCategory, setCurCategory] = React.useState("");
  
  const getRiddles = async () => {
    if (curCategory != "") {
      return (await axios.get(`${baseURL}/riddles/${curCategory}`)).data;
    }
    else {
      return [];
    }
  };
  
  const getCategories = async () => {
    return (await axios.get(`${baseURL}/categories`)).data;
  };
  
  const handleNewRiddle = async (e) => {
    e.preventDefault();
    
    if (document.getElementById("newRiddle").value == "" || document.getElementById("newRiddleAnswer").value == "") {
      return;
    }
    
    await axios.post(`${baseURL}/riddles`, { riddle: document.getElementById("newRiddle").value, category: curCategory, answer: document.getElementById("newRiddleAnswer").value });
    document.getElementById("newRiddle").value = "";
    document.getElementById("newRiddleAnswer").value = "";
    setRiddles(await getRiddles());
  };
  
  const deleteRiddle = async (riddleId) => {
    await axios.delete(`${baseURL}/riddles/${riddleId}`);
    setRiddles(await getRiddles());
  };
  
  const handleNewCategory = async (e) => {
    e.preventDefault();
    
    if (document.getElementById("newCategory").value == "") {
      return;
    }
    
    await axios.post(`${baseURL}/categories`, { name: document.getElementById("newCategory").value });
    document.getElementById("newCategory").value = "";
    setCategories(await getCategories());
  };
  
  const selectCategory = (categoryId) => {
    setCurCategory(categoryId);
  };
  
  const deleteCategory = async (categoryId) => {
    await axios.delete(`${baseURL}/categories/${categoryId}`);
    
    setCategories(await getCategories());
    setRiddles(await getRiddles());
    
    if (categoryId == curCategory) {
      setCurCategory("");
    }
  };
  
  const editCategory = async (e) => {
    e.preventDefault();
    
    if (curCategory == "" || document.getElementById("newCategory").value == "") {
      return;
    }
    
    await axios.post(`${baseURL}/categories/${curCategory}`, { name: document.getElementById("newCategory").value });
    document.getElementById("newCategory").value = "";
    setCategories(await getCategories());
  };
  
  React.useEffect(() => {
    (async () => setCategories(await getCategories()))();
    (async () => setRiddles(await getRiddles()))();
  }, []);
  
  React.useEffect(() => {
    (async () => setRiddles(await getRiddles()))();
  }, [curCategory]);
  
  let riddleForm = null;
  
  if (curCategory != "") {
    riddleForm = (
        <form className="form">
          <label>Enter Riddle:</label>
          <textarea name="riddle" id="newRiddle" />
          <label>Enter Answer:</label>
          <input type="text" id="newRiddleAnswer" />
          <button onClick={handleNewRiddle}>Add Riddle</button>
        </form>
    );
  }
  
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
    <div className="App">
      <div className="section">
        {categories.length === 0 ? <p>Create a riddle category below!</p> : null}
        {curCategory == "" && categories.length > 0 ? <p>Click on a category in the list below:</p> : null}
        <div className="category-list">
          {categories.map(x => <Category category={x} selected={x._id == curCategory} select={selectCategory} delete={deleteCategory} />)}
        </div>
        <form className="form">
          <label>Enter Category Name:</label>
          <input type="text" id="newCategory" />
          <button onClick={handleNewCategory}>Add Category</button>
          {curCategory != "" ? <button onClick={editCategory}>Update Selected Category</button> : null}
        </form>
      </div>
      <div className="section">
        <div>
          {riddles.length === 0 && curCategory != "" ? <p>Add a riddle below!</p> : null}
          {riddles.map(x => <Riddle riddle={x} delete={deleteRiddle} />)}
        </div>
        {riddleForm}
      </div>
    </div>
      <div className="footer">
        <a href="https://github.com/TheArduinist/cs260-creative-project-4" target="_blank">GitHub Repo</a>
      </div>
    </div>
  );
}

export default App;
