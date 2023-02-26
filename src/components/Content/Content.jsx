import React, { useState, useEffect, useRef } from "react";
import { Card, Space } from 'antd';
import Boards from "../Boards/Boards";
import AddBoard from "../Boards/AddBoard";

import { getAllBoard, rankBoard } from "../Boards/BoardServices";
import { rankTodo } from "../Todo/TodoService";

export default function Content() {
    const [listBoard, setListBoard] = useState([])
    const dragItem = useRef(null)
    const dragOverItem = useRef(null)
    const [reload, setReload] = useState(false)

    const [currentRanking, setCurrentRanking] = useState(null)
    const [newRanking, setNewRanking] = useState(null)
    const [itemSelected, setItemSelected] = useState(null)
    const [newBoard, setNewBoard] = useState(null)


    const handleDragStart = (e, position) => {
        dragItem.current = position;
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("text/html", e.target.parentNode.parentNode);
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
        setTimeout(() => {
            e.target.parentNode.parentNode.style = "background-color: #ccc; width: 300px; border-radius: 10px; padding: 10px";
            e.target.parentNode.style = "visibility: hidden; padding: 10px"
        }, 0)
        setCurrentRanking(e.target.parentNode.getAttribute("ranking"))
        setItemSelected(e.target.parentNode.getAttribute("data-value"))
    }

    const handleDragEnter = (e, position, board_id) => {
        dragOverItem.current = position;
        setNewRanking(e.target.parentNode.getAttribute("ranking") || e.target.parentNode.parentNode.parentNode.getAttribute("ranking"))
        setNewBoard(board_id)
        console.log(e.target.parentNode.getAttribute("ranking"), newRanking)
    }

    const handleDrop = (e) => {
        e.target.parentNode.parentNode.style = "background-color: rgb(235, 236, 240); width: 300px; border-radius: 10px; padding: 10px";
        e.target.parentNode.style = "visibility: none"

        if (newRanking !== null && dragOverItem.current !== null) {
            const copyListItems = [...listBoard];
            const dragItemContent = copyListItems[dragItem.current];
            copyListItems.splice(dragItem.current, 1);
            copyListItems.splice(dragOverItem.current, 0, dragItemContent); 
            dragItem.current = null;
            dragOverItem.current = null;
            setListBoard(copyListItems);
            rankBoard(itemSelected, {currentRanking, newRanking})
            .then(res => {
                if (res.data.code === 200) {
                    handleReload()
                }
            })
            .catch(err => console.log(err))
        } else {
            dragItem.current = null;
            dragOverItem.current = null;
            handleReload()
        }
    };

    const handleReload = () => {
        setReload(!reload)
    }

    const handleDragItemStart = (e, id, ranking) => {
        e.dataTransfer.setData("text/html", e.target)
        e.dataTransfer.setDragImage(e.target, 20, 20)
        setTimeout(() => {
            e.target.classList.add("hidden-todo")

            for (let i = 0; i < e.target.childNodes.length; i ++) {
                e.target.childNodes[i].style = "visibility: hidden"
            }
        }, 0)
        setItemSelected(id)
        setCurrentRanking(ranking)
        console.log(e.target.childNodes)
    }

    const handleDragItemEnter = (e, ranking, board_id) => {
        setNewRanking(ranking)
        setNewBoard(board_id)
        console.log("enter", ranking, board_id)
    }

    const handleDragItemEnd = (e, ranking, board_id) => {
        e.target.classList.remove("hidden-todo")
        for (let i = 0; i < e.target.childNodes.length; i ++) {
            e.target.childNodes[i].style = "visibility: none"
        }
        console.log(ranking, board_id)
        console.log({
            id: itemSelected,
            currentRanking: currentRanking,
            newRanking: newRanking,
            newBoard: newBoard
        })
        rankTodo(itemSelected, {
        currentRanking,
        newRanking,
        board_id: newBoard
        })  
        .then(res => {
            if (res.data.code === 200) {
                handleReload()
            }
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        getAllBoard()
        .then(res => {
            setListBoard(res.data.data)
        })
        .catch(err => console.log(err))
    }, [reload])

    const handleSetNew = (itemSelected, currentRanking, newRanking, newBoard) => {
        console.log(itemSelected)
        if (itemSelected?.board_id === newBoard) {
            if (currentRanking > newRanking) {
                let listSelected = listBoard.filter(list => list.id === newBoard)
                let listTodos = listSelected.lists[0]
                listTodos = listTodos.map(todo => todo.no >= newRanking ? {...todo, no: todo.no +1} : todo)
                listTodos = listTodos.map(todo => todo.id === itemSelected.id ? {...todo, no: newRanking} : todo)
                listSelected = {
                    ...listSelected,
                    lists: listTodos
                }
                setListBoard(listBoard.map(board => board.id === listSelected.id ? listSelected : board))
            }
        }
    }   

    return (
        <>
        <Space direction="horizontal" size={16} style={{display: "flex", alignItems: "flex-start", marginTop: "30px", position: "relative"}}>
            {
                listBoard && listBoard.map((board, index) => {

                    return (
                        <Boards
                        key={board.id}
                        board={board}
                        index={index}
                        dragStart={handleDragStart}
                        dragEnter={handleDragEnter}
                        drop={handleDrop} 
                        reload={handleReload}
                        handleDragItemStart={handleDragItemStart}
                        handleDragItemEnter={handleDragItemEnter}
                        handleDragItemEnd={handleDragItemEnd}
                        />
                    )
                })
            }
            <AddBoard reload={handleReload} />
        </Space>
        </>
    )
}