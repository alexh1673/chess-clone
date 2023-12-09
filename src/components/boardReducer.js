import { createSlice,current } from '@reduxjs/toolkit';
import {produce} from 'immer';
import viewMoveHelper from './viewMove';

//"rnbqkbnr"
const intial_majors = ['r','n','b','q','k','b','n','r']
const intial_pawns = ['p','p','p','p','p','p','p','p']
const blank = [' ',' ',' ',' ',' ',' ',' ',' ']

const pieceTypes = {
    wpdirs: [[1],[-1,-1],[-1,1],[-1,0]],
    bpdirs: [[1],[1,-1],[1,1],[1,0]],
    rdirs: [[8],[1,0],[0,1],[-1,0],[0,-1]], 
    ndirs: [[1],[2,1],[2,-1],[1,2],[1,-2],[-2,1],[-2,-1],[-1,2],[-1,-2]],
    bdirs: [[8],[1,-1],[1,1],[-1,-1],[-1,1]],
    qdirs: [[8],[1,0],[0,1],[-1,0],[0,-1],[1,-1],[1,1],[-1,-1],[-1,1]],
    kdirs: [[1],[1,0],[0,1],[-1,0],[0,-1],[1,-1],[1,1],[-1,-1],[-1,1]]
};

function initialize(){
    let piecetemp = [];
    let movetemp = [];
    let moved = [];
    for(let i = 0;i<8;i++){
        let order = Array.from(blank);
        let mt = new Array(8).fill(0);
        if(i === 1 || i === 6){
            order = Array.from(intial_pawns);
            mt = new Array(8).fill(1);
        }
        if(i === 0 || i === 7)
            order = Array.from(intial_majors);
        if(i === 7 || i === 6){
            for(let j = 0;j<8;j++){
                order[j] = order[j].toUpperCase();
            }
        }
        piecetemp.push(order);
        movetemp.push(blank);
        moved.push(mt);
    }
    console.log(piecetemp,"order")
    return {piece_board : piecetemp, move_board : movetemp,coords : [], moved : moved, turn : 'w',inCheck : {'b':0,'w':0}}
}

function isUpper(letter){
    if(letter === ' ')
        return 'z';
    return letter.toLowerCase() === letter ? 'b' : 'w';
}

function pawnTake(x,y,x1,y1,color,colorD,state){
    if(y === y1)
        return state.piece_board[x1][y1] === ' '
    return color !== colorD && state.piece_board[x1][y1] !== ' ';
}

function isAttacked(x,y,color){
    //can make n^2
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
            let invalid = (state.piece_board[x][y] === ' ' || (x === xt && y === yt) || state.move_board[xt][yt] === ' ')
            state.coords = [];
            for(let i = 0;i<8;i++){
                for(let j = 0;j<8;j++)
                    state.move_board[i][j] = ' ';
            }
            if(invalid)
                return;
            state.turn = state.turn === 'w' ? 'b' : 'w';
            state.piece_board[xt][yt] = state.piece_board[x][y];
            state.piece_board[x][y] = ' ';
        },
        addCoord : (state,action) => {
            state.coords = [...state.coords,[action.payload.x,action.payload.y]]
            console.log(current(state));
        },
        viewMove: (state) => {
            viewMoveHelper(state)
        }
    }
})

export const {movePiece , addCoord , viewMove} = boardSlice.actions;

export default boardSlice.reducer
