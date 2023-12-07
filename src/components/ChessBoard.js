import React, { useEffect,useState} from 'react';
import Tile from './Tile.js';
import { configureStore } from '@reduxjs/toolkit';
import boardReducer, { movePiece } from './boardReducer';
import { useDispatch ,useSelector} from 'react-redux';

export default function ChessBoard(){
    
    const dispatch = useDispatch()
    const pieces = useSelector((state) => state.piece_board);
    const moves = useSelector((state) => state.move_board);
    let coords = useSelector((state) => state.coords);

    useEffect(() => {
        if(coords.length == 2){
            dispatch(movePiece(coords));
        }
    },[coords]);
    
    return(
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 0fr))' , maxWidth: '800px'}}>
                {pieces.map((array, x) => 
                    array.map((char, y) => (
                        <Tile x = {x} y = {y} />
                    ))
                )}
        </div>
    )
}