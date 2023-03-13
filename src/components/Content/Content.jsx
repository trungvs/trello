import React, { useState, useEffect, useRef, useCallback } from "react";
import { Space } from 'antd';
import Boards from "../Boards/Boards";
import AddBoard from "../Boards/AddBoard";

import { getAllBoard, rankBoard } from "../Boards/BoardServices";
import { rankTodo } from "../Todo/TodoService";

function Content() {
    const [listBoard, setListBoard] = useState([])
    const dragItem = useRef(null)
    const dragOverItem = useRef(null)
    const [reload, setReload] = useState(false)

    const currentRanking = useRef(null)
    const newRanking = useRef(null)
    const itemSelected = useRef(null)
    const newBoard = useRef(null)
    const currentBoard = useRef(null)
    const boardRef= useRef([])

    let draggedItem = undefined
    let itemEnter = undefined

    let leftBounding = null
    let rightBounding = null
    let topBounding = null
    let bottomBounding = null
    let centerBounding = null

    const handleDragStart = (e, position) => {
        e.stopPropagation()
        dragItem.current = position;

        // set data to transfer
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("text/html", e.target.parentNode.parentNode);
        e.dataTransfer.setDragImage(new Image(), 20, 20);

        // clone moved element and append it to DOM
        draggedItem = document.createElement("div")
        draggedItem.classList.add("boardmoved")
        draggedItem.style.position = "absolute"
        draggedItem.append(e.target.parentNode.parentNode.cloneNode(true))
        document.body.append(draggedItem)

        // get curent ranking and its value 
        // setCurrentRanking(e.target.parentNode.getAttribute("ranking"))
        // setItemSelected(e.target.parentNode.getAttribute("data-value"))
        currentRanking.current  = e.target.parentNode.getAttribute("ranking")
        itemSelected.current = e.target.parentNode.getAttribute("data-value")

        // set style for clone and real element
        setTimeout(() => {
            handleMoveAt(e)
            e.target.parentNode.parentNode.style = "background-color: #ccc; width: 300px; border-radius: 10px; padding: 10px";
            e.target.parentNode.style = "visibility: hidden; padding: 10px"
        }, 0)
    }

    const handleOnDrag = (e) => {
        handleMoveAt(e)
    }

    const handleDragEnter = (e, position, board_id, ranking) => {
        e.stopPropagation()
        dragOverItem.current = position;
        // setNewRanking(ranking)
        // setNewBoard(board_id)
        newRanking.current = ranking
        newBoard.current = board_id
    }

    const handleDrop = (e) => {
        e.stopPropagation()
        document.body.querySelector(".boardmoved").remove()
        draggedItem = undefined
        e.target.parentNode.parentNode.style = "background-color: rgb(235, 236, 240); width: 300px; border-radius: 10px; padding: 10px";
        e.target.parentNode.style = "visibility: none"

        if (newRanking !== null && dragOverItem.current !== null) {
            // update list board
            const copyListItems = [...listBoard];
            const dragItemContent = copyListItems[dragItem.current];
            copyListItems.splice(dragItem.current, 1);
            copyListItems.splice(dragOverItem.current, 0, dragItemContent); 
            

            dragItem.current = null;
            dragOverItem.current = null;

            setListBoard(copyListItems);
            rankBoard(itemSelected.current, {currentRanking: currentRanking.current, newRanking: newRanking.current})
            .then(res => {
                if (res.data.code === 200) {
                    console.log("thanh cong")
                }
            })
            .catch(err => console.log(err))
        } else {
            dragItem.current = null;
            dragOverItem.current = null;
            handleReload()
        }
    }

    const handleMoveAt = (e) => {
        document.querySelector(".boardmoved").style.left = (e.pageX - document.querySelector(".boardmoved").offsetWidth / 4) + "px" 
        document.querySelector(".boardmoved").style.top = e.pageY + "px"
    }

    const handleReload = () => {
        setReload(!reload)
    }

    const handleSetBounding = e => {
        const bounding = e.target.getBoundingClientRect()
        leftBounding = bounding.left
        rightBounding = bounding.right
        topBounding = bounding.top
        bottomBounding = bounding.bottom
        centerBounding = topBounding + (bottomBounding - topBounding) / 2
    }

    const handleDragItemStart = (e, id, ranking, board_id) => {
        e.stopPropagation()
        e.dataTransfer.setData("text/html", e.target)
        e.dataTransfer.setDragImage(e.target, 20, 20)

        setTimeout(() => {
            e.target.classList.add("hidden-todo")
            for (let i = 0; i < e.target.childNodes.length; i ++) {
                e.target.childNodes[i].style = "visibility: hidden"
            }
        }, 0)
        // setItemSelected(id)
        // setCurrentRanking(ranking)
        // setCurrentBoard(board_id)
        itemSelected.current = id
        currentRanking.current = ranking
        currentBoard.current = board_id
        handleSetBounding(e)
    }

    const handleDragItemEnter = (e, ranking, board_id) => {
        console.log("enter")
        e.stopPropagation()
        itemEnter = e.target.getAttribute("data-value") ? e.target : e.target.parentNode
        
        // setNewRanking(ranking)
        // setNewBoard(board_id)
        newRanking.current = ranking
        newBoard.current = board_id
        handleSetBounding(e)
        let mouseX = e.clientX
        let mouseY = e.clientY
        if (
            centerBounding >= mouseY 
            && mouseY >= topBounding 
            && leftBounding <= mouseX 
            && mouseX <= rightBounding
        ) {
            if (newBoard.current === currentBoard.current) {
                // setNewRanking(newRanking - 1)
                newRanking.current = newRanking.current - 1
            }
            if (document.querySelector(".border-bottom")) {
                itemEnter.classList.remove("border-bottom")
            }
            if (!document.querySelector(".border-top")) {
                itemEnter.classList.add("border-top")
            }

        } else if (
            centerBounding < mouseY
            && mouseY < bottomBounding
            && leftBounding <= mouseX
            && mouseX <= rightBounding
        ) {
            if (newBoard.current !== currentBoard.current) {
                // setNewRanking(newRanking + 1)
                newRanking.current = newRanking.current + 1
            }
            if (document.querySelector(".border-top")) {
                itemEnter.classList.remove("border-top")
            }
            if (!document.querySelector(".border-bottom")) {
                itemEnter.classList.add("border-bottom")
            }
        } 
    }
    
    const handleDragItem = (e) => {
        e.stopPropagation()
        handleRemoveBorder()
        let mouseX = e.clientX
        let mouseY = e.clientY
        if (
            centerBounding >= mouseY 
            && mouseY >= topBounding 
            && leftBounding <= mouseX 
            && mouseX <= rightBounding
        ) {
            if (newBoard.current === currentBoard.current) {
                // setNewRanking(newRanking - 1)
                newRanking.current = newRanking.current - 1
            }
            if (document.querySelector(".border-bottom")) {
                itemEnter.classList.remove("border-bottom")
            }
            if (!document.querySelector(".border-top")) {
                itemEnter.classList.add("border-top")
            }

        } else if (
            centerBounding < mouseY
            && mouseY < bottomBounding
            && leftBounding <= mouseX
            && mouseX <= rightBounding
        ) {
            if (newBoard.current !== currentBoard.current) {
                // setNewRanking(newRanking + 1)
                newRanking.current = newRanking.current + 1
            }
            if (document.querySelector(".border-top")) {
                itemEnter.classList.remove("border-top")
            }
            if (!document.querySelector(".border-bottom")) {
                itemEnter.classList.add("border-bottom")
            }
        } 
    }

    const handleDragItemEnd = (e, ranking, board_id) => {
        e.stopPropagation()
        e.preventDefault()
        document.style = "border-top: none"
        e.target.classList.remove("hidden-todo")

        for (let i = 0; i < e.target.childNodes.length; i ++) {
            e.target.childNodes[i].style = "visibility: none"
        }

        rankTodo(itemSelected.current, {
            currentRanking: currentRanking.current,
            newRanking: newRanking.current,
            board_id: newBoard.current
        })  
            .then(res => {
                if (res.data.code === 200) {
                    const currentBoardIndex = listBoard.findIndex(b => b.id === currentBoard.current)
                    const newBoardIndex = listBoard.findIndex(b => b.id === newBoard.current)
                    boardRef.current[currentBoardIndex].handleGetData()
                    boardRef.current[newBoardIndex].handleGetData()
                }
            })
            .catch(err => console.log(err))

        handleRemoveBorder()
    }

    const handleDropItem = (e, ranking, board_id) => {
        console.log(e, ranking, board_id)
        itemEnter = e.target.getAttribute("data-value") ? e.target : e.target.parentNode
        handleRemoveBorder()
        
        // setNewRanking(ranking)
        // setNewBoard(board_id)
        newRanking.current = ranking
        newBoard.current = board_id
        handleSetBounding(e)
    }

    const handleRemoveBorder = () => {
        let borderTop = document.querySelectorAll(".border-top")

        if (borderTop.length !== 0) {
            for (let i = 0; i < borderTop.length; i++) {
                borderTop[i].classList.remove("border-top")
            }
        }

        let borderBottom = document.querySelectorAll(".border-bottom")

        if (borderBottom.length !== 0) {
            for (let i = 0; i < borderBottom.length; i++) {
                borderBottom[i].classList.remove("border-bottom")
            }
        }
    }

    const handleAddBoard  = (value) => {
        setListBoard(prev => [...prev, value])
    }

    const handleDeleteBoard = (id) => {
        console.log(id)
        setListBoard(listBoard.filter(board => board.id !== id))
    }

    useEffect(() => {
        getAllBoard()
        .then(res => {
            setListBoard(res.data.data)
        })
        .catch(err => console.log(err))
    }, [reload])  

    return (
        <>
        <Space
            direction="horizontal"
            size={16}
            style={{display: "flex", alignItems: "flex-start", marginTop: "30px", position: "relative"}}
        >
            {
                listBoard && listBoard.map((board, index) => {
                    return (
                        <Boards
                            key={board.id}
                            board={board}
                            index={index}
                            handleDragStart={handleDragStart}
                            handleDragging={handleOnDrag}
                            handleDragEnter={handleDragEnter}
                            handleDrop={handleDrop} 
                            reload={handleReload}
                            handleDragItemStart={handleDragItemStart}
                            handleDragItem={handleDragItem}
                            handleDragItemEnter={handleDragItemEnter}
                            handleDragItemEnd={handleDragItemEnd}
                            handleDropItem={handleDropItem}
                            handleDeleteBoard={handleDeleteBoard}
                            ref={board => boardRef.current[index] = board}
                        />
                    )
                })
            }
            <AddBoard reload={handleReload} handleAddBoard={handleAddBoard} />
        </Space>
        </>
    )
}

export default React.memo(Content)