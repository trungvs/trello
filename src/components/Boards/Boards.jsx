import React, { useRef, useEffect } from "react";
import { Card } from 'antd';
import { Button } from 'antd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AddTodo from "../HelperComponents/AddTodo";
import EditNameTodo from "../HelperComponents/EditNameTodo";

import { deleteBoard } from "./BoardServices";

const itemStyle = {
    backgroundColor: "#fff",
    marginBottom: "5px",
    padding: "5px",
    borderRadius: "5px"
}

const boardStyle = {
    container: {
        width: "300px",
        backgroundColor: "#ebecf0",
        // marginTop: "30px",
        borderRadius: "10px",
        padding: "10px",
        transition: "transform 0.3s",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "40px",
        cursor: "move",
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

export default function Boards(props) {
    const {board, index, dragStart, dragEnter, drop, dragItemStart, dragItemEnter, dropItem, reload } = props

    const handleDeleteBoard = () => {
        deleteBoard(board.id)
        .then(res => {
            if (res.data.code === 200) {
                console.log("thanh cong")
                reload()
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <>
            <div className="board-container" style={boardStyle.container}>
                <div 
                    className="board-header" 
                    style={boardStyle.header}
                    draggable
                    onDragStart={(e) => dragStart(e, index)}
                    onDragEnter={e => dragEnter(e, index)}
                    onDragEnd={e => drop(e, index)}

                >
                    <h4 className="board-name" style={{ width: "80%" }}>
                        <EditNameTodo
                        nameTodo={board?.name}
                        id={board?.id}
                        reload={reload} />
                    </h4>
                    <Button icon={<DeleteOutlined />} size="large" onClick={handleDeleteBoard} />
                </div>
                <ul className="board-content" style={boardStyle.list}>
                    {
                        board?.lists && board.lists.map(todo => (
                            <li className="board-item" style={boardStyle.item} key={todo.id} draggable onDragStart={(e) => dragItemStart()}>
                            <p className="board-item-name">
                                {todo.name}
                            </p>
                            <Button type="dashed" icon={<EditOutlined />} size="small" />
                            </li>
                        ))
                    }
                </ul>
                <AddTodo
                board={board}
                reload={reload} />
                {/* <Button type="dashed" block size="large">
                    Thêm mới
                </Button> */}
            </div>
        </>
    )
}