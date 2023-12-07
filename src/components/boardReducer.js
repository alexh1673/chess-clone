import { createSlice,current } from '@reduxjs/toolkit';
import {produce} from 'immer';

//"rnbqkbnr"
const intial_majors = ['r','n','b','q','k','b','n','r']
const intial_pawns = ['p','p','p','p','p','p','p','p']
const blank = [' ',' ',' ',' ',' ',' ',' ',' ']

function initialize(){
    let piecetemp = [];
    let movetemp = [];
    for(let i = 0;i<8;i++){
        let order = Array.from(blank);
        if(i === 1 || i === 6)
            order = Array.from(intial_pawns);
        if(i === 0 || i === 7)
            order = Array.from(intial_majors);
        if(i === 7 || i === 6){
            for(let j = 0;j<8;j++){
                order[j] = order[j].toUpperCase();
            }
        }
        piecetemp.push(order);
        movetemp.push(blank);
    }
    console.log(piecetemp,"order")
    return {piece_board : piecetemp, move_board : movetemp,coords : []}
}


const boardSlice =  createSlice({
    name : "board",
    initialState : initialize(),
    reducers : {
        movePiece : (state,action) => {
            console.log(action.payload,"inside reducer")
            const x = action.payload[0][0];
            const y = action.payload[0][1];
            const xt = action.payload[1][0];
            const yt = action.payload[1][1];
            console.log(x,y,xt,yt,current(state));
            state.coords = [];
            if(state.piece_board[x][y] == ' ' || (x == xt && y == yt))
                return;
            state.piece_board[xt][yt] = state.piece_board[x][y];
            state.piece_board[x][y] = ' ';
        },
        addCoord : (state,action) => {
            state.coords = [...state.coords,[action.payload.x,action.payload.y]]
            console.log(current(state));
        }
    }
})

export const {movePiece , addCoord} = boardSlice.actions;

export default boardSlice.reducer
