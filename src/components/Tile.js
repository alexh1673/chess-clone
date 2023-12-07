import React, {useEffect,useState} from 'react';
import { addCoord, movePiece } from './boardReducer';
import { useDispatch ,useSelector} from 'react-redux';

export default function Tile(props){

    const dispatch = useDispatch()
    let x = props.x;
    let y = props.y;
    const pieces = useSelector((state) => state.piece_board);
    const moves = useSelector((state) => state.move_board);
    let coords = useSelector((state) => state.coords);
    let t = (pieces[x][y].toUpperCase() === pieces[x][y]) ? '_'  : "";
    let path = pieces[x][y] != ' ' ? './pieces\/' + pieces[x][y].toUpperCase() + t + '.png' : "";

    const sqstyle = {
        width: '100px', // You can change this value to set the size of the square
        height: '100px', // Should be the same as the width to make it a square
        backgroundColor: (x%2 + y)%2 ? 'white' : '#0a571f', // You can change the background color
    };

    const handleClick = (event) => {
        dispatch(addCoord({x,y}));
    };

    return(<div style = {sqstyle} onClick = {handleClick}>
        {path ? <img src={require(`${path}`)}/> : null}
    </div>)
}