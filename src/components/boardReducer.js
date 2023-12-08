import { createSlice,current } from '@reduxjs/toolkit';
import {produce} from 'immer';

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
    return {piece_board : piecetemp, move_board : movetemp,coords : [], moved : moved, turn : 1}
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
            state.piece_board[xt][yt] = state.piece_board[x][y];
            state.piece_board[x][y] = ' ';
        },
        addCoord : (state,action) => {
            state.coords = [...state.coords,[action.payload.x,action.payload.y]]
            console.log(current(state));
        },
        viewMove: (state) => {
            let x = state.coords[0][0];
            let y = state.coords[0][1];
            if(state.piece_board[x][y] === ' '){
                state.coords = [];
                return;
            }
            let piece = state.piece_board[x][y];
            let color = isUpper(piece);
            let arr = pieceTypes[(piece.toLowerCase() === 'p' ? color : "")+piece.toLowerCase() +"dirs"]
            piece = piece.toLowerCase()
            let depth = arr[0][0];
            let valid = false;
            for(let i = 1;i<arr.length;i++){
                let a = x;
                let b = y;
                for(let j = 0;j<depth;j++){
                    let x1 = a + arr[i][0];
                    let y1 = b + arr[i][1];
                    if(x1 < 0 || x1 >= 8 || y1 < 0 || y1 >= 8)
                        break;
                    let colorD = isUpper(state.piece_board[x1][y1]);
                    a = x1;
                    b = y1;
                    pawnTake(x,y,x1,y1,color,colorD,state)
                    if(state.piece_board[x1][y1] !== 'k' && (
                        (colorD !== color && piece !== 'p') || 
                        (piece === 'p' && pawnTake(x,y,x1,y1,color,colorD,state))
                    )){
                        state.move_board[x1][y1] = '.';
                        valid = true;
                    }
                    if(state.piece_board[x1][y1] !== ' ')
                        break;
                }
            }
            if(state.moved[x][y] && piece === 'p'){
                let add = arr[3][0]*2;
                if(add + x >= 0 && x + add < 8){
                    state.move_board[x+add][y] = state.move_board[x+add][y] == ' ' ? '.' : ' ';
                }
            }
            if(!valid)
                state.coords = [];
        }
    }
})

export const {movePiece , addCoord , viewMove} = boardSlice.actions;

export default boardSlice.reducer
