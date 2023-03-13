import React, { useState, useImperativeHandle } from "react";
import { Button, message, Popconfirm } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import AddTodo from "../Todo/AddTodo";
import EditNameTodo from "./EditBoardName";
import { deleteBoard } from "./BoardServices";
import { deleteTodo } from "../Todo/TodoService"
import ListTodos from "../Todo/ListTodos";
import { getAllBoard } from "../Boards/BoardServices";

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
        cursor: "grab",
    }
}

const Boards = (props, ref) => {
    const {
        board, 
        index, 
        handleDragStart, 
        handleDragging,
        handleDragEnter, 
        handleDrop, 
        handleDragItemStart, 
        handleDragItem,
        handleDragItemEnter, 
        handleDragItemEnd ,
        handleDropItem,
        handleDeleteBoard,
    } = props

    const [data, setData] = useState(board)
    const [boardName, setBoardName] = useState(data?.name)
    const [listTodo, setListTodo] = useState(data?.lists)

    const handleDelete = () => {
        // let answer = window.confirm("Are you sure to delete it?");
        // if (answer) {
            deleteBoard(data?.id)
            .then(res => {
                if (res.data.code === 200) {
                    handleDeleteBoard(data?.id)
                }
            })
            .catch(err => console.log(err))
        // }
    }

    const handleSetBoardName = (value) => {
        setBoardName(value)
    }

    const handleAddTodo = (value) => {
        getAllBoard(data.id)
        .then(res => {
            setListTodo(res.data.data.lists)
        })
        .catch(err => console.log(err))
    }

    const handleDeleteTodo = (id) => {
        // let answer = window.confirm("Are you sure to delete it?");
        // if (answer) {
            deleteTodo(id)
            .then(res => {
                if (res.data.code === 200) {
                    setListTodo(listTodo.filter(todo => todo.id !== id))
                }
            })
            .catch(err => console.log(err))
        // }
    }

    useImperativeHandle(ref, () => ({
        handleGetData() {
            console.log(data.name)
            getAllBoard()
            .then(res => {
                if (res.data.code === 200){
                    const selectedBoard = res.data.data.find(b => b.id === data.id)
                    setData(selectedBoard)
                    setListTodo(selectedBoard.lists)
                }
            })
        }
    }))

    return (
        <>

            <div style={boardStyle.container} data-value={data.id} ranking={data.no}>
                <div 
                    className="board-header" 
                    style={boardStyle.header}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrag={e => handleDragging(e)}
                    onDragEnter={e => handleDragEnter(e, index, data?.id, data?.no)}
                    onDragEnd={e => handleDrop(e, index)}
                >
                    <h4 className="board-name" style={{ width: "80%" }}>
                        <EditNameTodo
                        nameTodo={boardName}
                        id={data?.id}
                        setBoardName={handleSetBoardName} />
                    </h4>
                    <Popconfirm
                        placement="topLeft"
                        title={"Are you sure to delete this task?"}
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} size="medium" />
                    </Popconfirm>
                </div>
                <ListTodos
                    listTodo={listTodo}
                    onDragStart={handleDragItemStart}
                    onDragEnter={handleDragItemEnter}
                    onDragEnd={handleDragItemEnd}
                    onDrag={handleDragItem}
                    handleDropItem={handleDropItem}
                    handleDeleteTodo={handleDeleteTodo}
                />
                <AddTodo
                board={data}
                handleAddTodo={handleAddTodo}
                 />
            </div>
        </>
    )
}

export default React.forwardRef(Boards)