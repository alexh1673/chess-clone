import React, {useEffect,useState} from 'react';
import { addCoord, movePiece } from './boardReducer';
import { useDispatch ,useSelector} from 'react-redux';
import { Button } from '@mui/material';

export default function Tile(props){

    const dispatch = useDispatch()
    let x = props.x;
    let y = props.y;
    const pieces = useSelector((state) => state.piece_board);
    const moves = useSelector((state) => state.move_board);
    let t = (pieces[x][y].toUpperCase() === pieces[x][y]) ? '_'  : "";
    let path = pieces[x][y] != ' ' ? './pieces\/' + pieces[x][y].toUpperCase() + t + '.png' : "";
    let selected = props.coords.length >= 1 && props.coords[0][0] == x && props.coords[0][1] == y;

    const sqstyle = {
        width: '100px', // You can change this value to set the size of the square
        height: '100px', // Should be the same as the width to make it a square
        backgroundColor: (selected ? 'yellow' : ((x%2 + y)%2 ? 'white' : '#0a571f')), // You can change the background color
        position: 'relative'
    };

    const handleClick = (event) => {
        dispatch(addCoord({x,y}));
    };

    return(
    <Button disableRipple variant="contained" style = {sqstyle} onClick = {handleClick}>
        {moves[x][y] != ' ' ? <img
            src={require('./pieces/gd.png')} // Adjust the image path as needed
            style={{width : '100%', height : '100%', position: 'absolute', left: 0, top: 0, position : 'absolute',opacity: .25}}
        /> : null}
        {path ? (
            <img
                style={{ position: 'absolute', left: 0, top: 0,width : '100%', height : '100%'}}
                src={require(`${path}`)} // Adjust the image path as needed
            />
        ) : null}
    </Button>)
}