import { createSlice,current } from '@reduxjs/toolkit';
import { viewMoveHelper, isAttacked , findKing} from './viewMove.js';

//"rnbqkbnr"
const intial_majors = ['r','n','b','q','k','b','n','r']
const intial_pawns = ['p','p','p','p','p','p','p','p']
const blank = [' ',' ',' ',' ',' ',' ',' ',' ']

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
            mt[4] = 1;
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
    return {piece_board : piecetemp, move_board : movetemp,coords : [], moved : moved, turn : 'w',winner : "x",promoting : ['x','x','x','x','x']}
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
            state.moved[x][y] = 0;
            state.moved[xt][yt] = 0;
            if((state.piece_board[x][y] === 'p' || state.piece_board[x][y] === 'P') && (xt == 7 || xt == 0)){
                state.promoting = [x,y,xt,yt,state.turn];
                return;
            }
            else if((state.piece_board[x][y] === 'k' || state.piece_board[x][y] === 'K')  && Math.abs(y-yt) === 2){
                state.piece_board[x][4] = ' ';
                if(yt < y){
                    state.piece_board[x][0] = ' ';
                    state.piece_board[x][3] = x === 0 ? 'r' : 'R';
                    state.piece_board[x][2] = x === 0 ? 'k' : 'K';
                }
                else{
                    state.piece_board[x][7] = ' ';
                    state.piece_board[x][6] = x === 0 ? 'k' : 'K';
                    state.piece_board[x][5] = x === 0 ? 'r' : 'R';
                }
            }
            else{
                state.piece_board[xt][yt] = state.piece_board[x][y];
                state.piece_board[x][y] = ' ';
            }
            state.turn = state.turn === 'w' ? 'b' : 'w';
        },
        addCoord : (state,action) => {
            state.coords = [...state.coords,[action.payload.x,action.payload.y]]
        },
        viewMove: (state) => {
            viewMoveHelper(state,state.coords[0][0],state.coords[0][1])
        },
        checkMate: (state) => {
            let curr = 0;
            for(let i = 0 ;i<8;i++){
                for(let j = 0;j<8;j++){
                    viewMoveHelper(state,i,j)
                    for(let k = 0 ;k<8;k++){
                        for(let l = 0;l<8;l++){
                            curr += state.move_board[k][l] === '.';
                            state.move_board[k][l] = ' ';
                        }
                    }
                    if(curr)
                        break;
                }
            }
            if(curr === 0){
                state.winner = state.turn === 'w' ? 'b' : 'w';
                let k = findKing(state.turn,state.piece_board)
                if(!isAttacked(k[0],k[1],state.winner,state.piece_board)){
                    state.winner = 'stalemate'
                }
            }
        },
        promote: (state,action) => {
            console.log(action)
            state.moved[state.promoting[0]][state.promoting[1]] = 0;
            state.moved[state.promoting[2]][state.promoting[3]] = 0;
            state.piece_board[state.promoting[2]][state.promoting[3]] = action.payload;
            state.piece_board[state.promoting[0]][state.promoting[1]] = ' ';
            state.promoting = ['x','x','x','x','x']
            state.turn = state.turn === 'w' ? 'b' : 'w';
        }
    }
})

export const {movePiece , addCoord , viewMove, checkMate, promote} = boardSlice.actions;

export default boardSlice.reducer
