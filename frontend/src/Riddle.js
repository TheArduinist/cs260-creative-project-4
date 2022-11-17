import * as React from 'react';

function Riddle(props) {
    let [showAnswer, setShowAnswer] = React.useState(false);
    
    const toggleShowAnswer = (e) => {
        e.preventDefault();
        setShowAnswer(!showAnswer);
    };
    
    const handleDelete = (e) => {
        e.preventDefault();
        props.delete(props.riddle._id.valueOf());
    }
    
    React.useEffect(() => {
        setShowAnswer(false);
    }, [props]);
    
    return (
        <div className="riddle">
            <p className="question">{props.riddle.riddle}</p>
            {showAnswer ? <p className="answer">{props.riddle.answer}</p> : null}
            <div>
                <button onClick={toggleShowAnswer}>{showAnswer ? "Hide Answer" : "Show Answer"}</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
}

export default Riddle;