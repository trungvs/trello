import React, { useState, useEffect, useRef } from "react";
import { Card, Space } from 'antd';
import Boards from "../Boards/Boards";
import AddBoard from "../Boards/AddBoard";

import { getAllBoard, rankBoard } from "../Boards/BoardServices";

export default function Content() {
    const [listBoard, setListBoard] = useState([])
    const dragItem = useRef()
    const dragOverItem = useRef()
    const [reload, setReload] = useState(false)

    const [currentRanking, setCurrentRanking] = useState(null)
    const [newRanking, setNewRanking] = useState(null)
    const [itemSelected, setItemSelected] = useState(null)

    const mockdata = [
        {
            id: 1,
            name: "Máy tính",
            order: 1,
            lists: [
                {
                    id: 900,
                    name: "Máy tính laptop",
                    order: 1,
                    board_id: 1
                },
                {
                    id: 901,
                    name: "Máy tính bàn",
                    order: 2,
                    board_id: 1
                }
            ]
        },
        {
            id: 2,
            name: "Điện thoại",
            order: 2,
            lists: [
                {
                    id: 1001,
                    name: "Điện thoại cá nhân",
                    order: 1,
                    board_id: 2
                },
                {
                    id: 1002,
                    name: "Điện thoại bàn",
                    order: 2,
                    board_id: 2
                },
                {
                    id: 1003,
                    name: "Điện thoại di động",
                    order: 3,
                    board_id: 2
                }
            ]
        },
        {
            id: 3,
            name: "Tivi",
            order: 3,
            lists: [
                {
                    id: 501,
                    name: "tivi samsung",
                    order: 1,
                    board_id: 3
                },
                {
                    id: 502,
                    name: "tivi xiaomi",
                    order: 2,
                    board_id: 3
                }
            ]
        },
        {
            id: 4,
            name: "Tủ lạnh",
            order: 4
        },
        {
            id: 5,
            name: "Điều hoà",
            order: 5
        },
        {
            id: 6,
            name: "Điều hoà mới",
            order: 6
        }
    ]

    const handleDragStart = (e, position) => {
        dragItem.current = position;
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.setData("text/html", e.target.parentElement);
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
        setCurrentRanking(e.target.parentNode.getAttribute("ranking"))
        setItemSelected(e.target.parentNode.getAttribute("data-value"))
    }

    const handleDragEnter = (e, position) => {
        dragOverItem.current = position;
        setNewRanking(e.target.parentNode.getAttribute("ranking") || e.target.parentNode.parentNode.parentNode.getAttribute("ranking"))
    }

    const handleDrop = (e) => {
        if (newRanking !== null) {
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
        }
    };

    const handleDragItemStart = (e, position) => {

    }

    const handleDragItemEnter = (e, position) => {

    }

    const handleDropItem = () => {

    }

    const handleReload = () => {
        setReload(!reload)
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
        <Space direction="horizontal" size={16} style={{display: "flex", alignItems: "flex-start", marginTop: "30px"}}>
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
                        dragItemStart={handleDragItemStart}
                        dragItemEnter={handleDragItemEnter}
                        dropItem={handleDropItem}
                        reload={handleReload}
                        />
                    )
                })
            }
            <AddBoard reload={handleReload} />
        </Space>
        </>
    )
}