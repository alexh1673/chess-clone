import { createSlice,current } from '@reduxjs/toolkit';
import { viewMoveHelper, isAttacked , isUpper , findKing} from './viewMove.js';

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
        if(i === 0 || i === 7){
            order = Array.from(intial_majors);
            mt[0] = 1;
            mt[7] = 1;
        }
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
    return {piece_board : piecetemp, move_board : movetemp,coords : [], moved : moved, turn : 'w',winner : "x"}
}

const boardSlice =  createSlice({
    name : "board",
    initialState : initialize(),
    reducers : {
        movePiece : (state,action) => {
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
        },
        viewMove: (state) => {
            viewMoveHelper(state,state.coords[0][0],state.coords[0][1])
        },
        checkMate: (state) => {
            //issue lies here
            let curr = 0;
            for(let i = 0 ;i<8;i++){
                for(let j = 0;j<8;j++){
                    viewMoveHelper(state,i,j)
                    for(let k = 0 ;k<8;k++){
                        for(let l = 0;l<8;l++){
                            curr += state.move_board[k][l] == '.';
                            state.move_board[k][l] = ' ';
                        }
                    }
                    if(curr)
                        break;
                }
            }
            if(curr == 0){
                state.winner = state.turn === 'w' ? 'b' : 'w';
                let k = findKing(state.turn,state.piece_board)
                if(!isAttacked(k[0],k[1],state.winner,state.piece_board)){
                    state.winner = 'stalemate'
                }
            }
        }
    }
})

export const {movePiece , addCoord , viewMove, checkMate} = boardSlice.actions;

export default boardSlice.reducer
