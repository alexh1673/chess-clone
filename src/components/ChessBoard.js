import React, { useEffect} from 'react';
import Tile from './tile.js';
import boardReducer, { checkMate, movePiece , viewMove } from './boardReducer';
import { useDispatch , useSelector} from 'react-redux';
import EndModal from './EndModal.js'

export default function ChessBoard(){
    
    const dispatch = useDispatch()
    const pieces = useSelector((state) => state.piece_board);
    let coords = useSelector((state) => state.coords);

    useEffect(() => {
        if(coords.length == 0){
            dispatch(checkMate());
        }
        if(coords.length == 1){
            dispatch(viewMove());
        }
        if(coords.length == 2){
            dispatch(movePiece(coords));
        }
    },[coords]);
    
    return(
        <div>
            <EndModal/>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 0fr))' , maxWidth: '800px'}}>
                    {pieces.map((array, x) => 
                        array.map((char, y) => (
                            <Tile x = {x} y = {y} coords = {coords}/>
                        ))
                    )}
            </div>
        </div>
    )
}