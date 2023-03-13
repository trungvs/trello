import React, { useEffect, useState } from "react";

import EditTodo from "./EditTodo";
import { deleteTodo, editTodo } from "../Todo/TodoService"


const boardStyle = {
    container: {
        width: "300px",
        backgroundColor: "#ebecf0",
        // marginTop: "30px",
        borderRadius: "10px",
        padding: "10px",
        transition: "transform 0.3s",
        position: "relative",
        zIndex: 1
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "40px",
        cursor: "grab",
        transition: "transform 0.3s"
    },
    list: {
        listStyle: "none",
        marginTop: "10px"
    },
    item: {
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        margin: "10px 0",
        padding: "10px",
        borderRadius: "10px",
        transition: "transform 0.3s",
        cursor: "move",
    }
}

function ListTodos(props) {

    const { 
        listTodo, 
        // boardStyle,
        onDragStart,
        onDragEnter,
        onDragEnd,
        onDrag,
        handleDeleteTodo,
        handleDropItem
    } = props

    const [data, setData] = useState(listTodo)

    useEffect(() => {
        setData(listTodo)
    }, [listTodo])

    return (
        <ul className="board-content" style={boardStyle.list}>
            {
                data && data.sort((a,b) => a.no - b.no).map(todo => (
                    <EditTodo
                    key={todo.id}
                    todo={todo}
                    boardStyle={boardStyle}
                    onDragStart={onDragStart}
                    onDragEnter={onDragEnter}
                    onDragEnd={onDragEnd}
                    onDrag={onDrag}
                    handleDropItem={handleDropItem}
                    handleDeleteTodo={handleDeleteTodo}
                     />
                ))
            }
        </ul>
    )
}

export default React.memo(ListTodos)