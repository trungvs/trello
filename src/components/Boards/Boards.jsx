import React, { useRef } from "react";
import { Card } from 'antd';
import { Button } from 'antd';
import { EditOutlined } from "@ant-design/icons";

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
        marginTop: "30px",
        borderRadius: "10px",
        padding: "10px",
        transition: "transform 0.3s"
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
        listStyle: "none"
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
        transition: "transform 0.3s"
    }
}

export default function Boards(props) {
    const {board, index, dragStart, dragEnter, drop} = props

    return (
        <>
            {/* <Card
            title={board.name}
            extra={<Button icon={<EditOutlined />} size="large" />}
            style={{
                width: 300,
                cursor: "move",
                backgroundColor: "#ebecf0"
            }}
            draggable
            onDragStart={(e) => dragStart(e, index)}
            onDragEnter={e => dragEnter(e, index)}
            onDragEnd={e => drop(e, index)}
            >
                <div style={{ cursor: "default"}}>
                    <div style={itemStyle}>{board.name}</div>
                    <div style={itemStyle}>Card content</div>
                    <div style={itemStyle}>Card content</div>
                </div>
            </Card> */}

            <div className="board-container" style={boardStyle.container}>
                <div 
                    className="board-header" 
                    style={boardStyle.header}
                    draggable
                    onDragStart={(e) => dragStart(e, index)}
                    onDragEnter={e => dragEnter(e, index)}
                    onDragEnd={e => drop(e, index)}
                >
                    <h4 className="board-name">
                        {board.name}
                    </h4>
                    <Button icon={<EditOutlined />} size="large" />
                </div>
                <ul className="board-content" style={boardStyle.list}>
                    <li className="board-item" style={boardStyle.item}>
                        <p className="board-item-name">
                            Mua bán {board.name}
                        </p>
                        <Button type="dashed" icon={<EditOutlined />} size="small" />
                    </li>
                    <li className="board-item" style={boardStyle.item}>
                        <p className="board-item-name">
                            Mua bán sách, truyện
                        </p>
                        <Button type="dashed" icon={<EditOutlined />} size="small" />
                    </li>
                </ul>
            </div>
        </>
    )
}