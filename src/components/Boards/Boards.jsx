import React, { useRef, useEffect, useState } from "react";
import { Card } from 'antd';
import { Button } from 'antd';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Menu } from 'antd';

import AddTodo from "../Todo/AddTodo";
import EditNameTodo from "../HelperComponents/EditNameTodo";
import EditTodo from "../Todo/EditTodo";

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

export default function Boards(props) {
    const {
        board, 
        index, 
        dragStart, 
        dragEnter, 
        drop, 
        reload, 
        handleDragItemStart, 
        handleDragItemEnter, 
        handleDragItemEnd 
    } = props

    const handleDeleteBoard = () => {
        deleteBoard(board.id)
        .then(res => {
            if (res.data.code === 200) {
                reload()
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <>
            <div style={boardStyle.container} data-value={board.id} ranking={board.no}>
                <div 
                    className="board-header" 
                    style={boardStyle.header}
                    draggable
                    onDragStart={(e) => dragStart(e, index)}
                    onDragEnter={e => dragEnter(e, index, board.id)}
                    onDragEnd={e => drop(e, index)}
                >
                    <h4 className="board-name" style={{ width: "80%" }}>
                        <EditNameTodo
                        nameTodo={board?.name}
                        id={board?.id}
                        reload={() => reload()} />
                    </h4>
                    <Button icon={<DeleteOutlined />} size="medium" onClick={handleDeleteBoard} />
                </div>
                <ul className="board-content" style={boardStyle.list}>
                    {
                        board?.lists && board.lists.sort((a,b) => a.no - b.no).map(todo => (
                            <EditTodo
                            key={todo.id}
                            todo={todo}
                            boardStyle={boardStyle}
                            reload={reload}
                            onDragStart={handleDragItemStart}
                            onDragEnter={handleDragItemEnter}
                            onDragEnd={handleDragItemEnd}
                             />
                        ))
                    }
                </ul>
                <AddTodo
                board={board}
                reload={reload} />
            </div>
        </>
    )
}