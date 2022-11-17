import * as React from 'react';

function Category(props) {
    const handleClick = (e) => {
        e.preventDefault();
        props.select(props.category._id.valueOf());
    };
    
    const deleteCategory = (e) => {
        e.preventDefault();
        e.stopPropagation();
        props.delete(props.category._id.valueOf());
    };
    
    return (
        <div className={"category" + (props.selected ? " selected" : "")} onClick={handleClick}>
            <p>{props.category.name}</p>
            <button onClick={deleteCategory}>Delete</button>
        </div>
    );
}

export default Category;