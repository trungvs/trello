import React, { useState, useEffect, useRef } from "react";
import { Card, Space } from 'antd';
import Boards from "../Boards/Boards";

export default function Content() {
    const [listBoard, setListBoard] = useState([])
    const dragItem = useRef()
    const dragOverItem = useRef()

    const mockdata = [
        {
            id: 1,
            name: "Máy tính",
            order: 1
        },
        {
            id: 2,
            name: "Điện thoại",
            order: 2
        },
        {
            id: 3,
            name: "Tivi",
            order: 3
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
        console.log(e.target)
    }

    const handleDragEnter = (e, position) => {
        dragOverItem.current = position;
    }

    const handleDrop = (e) => {
        const copyListItems = [...listBoard];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent); 
        dragItem.current = null;
        dragOverItem.current = null;
        setListBoard(copyListItems);
      };

    useEffect(() => {
        setListBoard(mockdata)
    }, [])

    return (
        <>
        <Space direction="horizontal" size={16}>
            {
                listBoard.length === 0 
                ? <b>EMPTY DATA</b>
                : listBoard.map((board, index) => {

                    return (
                        <Boards
                        key={index}
                        board={board}
                        index={index}
                        dragStart={handleDragStart}
                        dragEnter={handleDragEnter}
                        drop={handleDrop} 
                        />
                    )
                })
            }
        </Space>
        </>
    )
}