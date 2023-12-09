import { current } from '@reduxjs/toolkit';

const pieceTypes = {
    wpdirs: [[1],[-1,-1],[-1,1],[-1,0]],
    bpdirs: [[1],[1,-1],[1,1],[1,0]],
    rdirs: [[8],[1,0],[0,1],[-1,0],[0,-1]], 
    ndirs: [[1],[2,1],[2,-1],[1,2],[1,-2],[-2,1],[-2,-1],[-1,2],[-1,-2]],
    bdirs: [[8],[1,-1],[1,1],[-1,-1],[-1,1]],
    qdirs: [[8],[1,0],[0,1],[-1,0],[0,-1],[1,-1],[1,1],[-1,-1],[-1,1]],
    kdirs: [[1],[1,0],[0,1],[-1,0],[0,-1],[1,-1],[1,1],[-1,-1],[-1,1]]
};

function pawnTake(x,y,x1,y1,color,colorD,state){
    if(y === y1)
        return state.piece_board[x1][y1] === ' '
    return color !== colorD && state.piece_board[x1][y1] !== ' ';
}

function isUpper(letter){
    if(letter === ' ')
        return 'z';
    return letter.toLowerCase() === letter ? 'b' : 'w';
}

function dfs(x,y,arr,piece,color,board){
    let depth = arr[0][0];
    for(let i = 1;i<arr.length;i++){
        let a = x;
        let b = y;
        for(let j = 0;j<depth;j++){
            let x1 = a + arr[i][0];
            let y1 = b + arr[i][1];
            if(x1 < 0 || x1 >= 8 || y1 < 0 || y1 >= 8)
                break;
            let colorD = isUpper(board[x1][y1]);
            a = x1;
            b = y1;
            if(color !== colorD && 
                (piece === board[x1][y1].toLowerCase() || (piece !== 'n' && board[x1][y1].toLowerCase() === 'q'))){
                return 1;
            }
            if(board[x1][y1] !== ' ')
                break;
        }
    }
    return 0;
}

function isAttacked(x,y,color,board){
    //check if a coord of a certain color is attacked on a given board
    return dfs(x,y,pieceTypes.ndirs,'n',color,board) || dfs(x,y,pieceTypes.rdirs,'r',color,board) || dfs(x,y,pieceTypes.bdirs,'b',color,board)
}



function viewMoveHelper(state){
    let x = state.coords[0][0];
    let y = state.coords[0][1];
    let piece = state.piece_board[x][y];
    let color = state.turn;
    if(piece === ' ' || (isUpper(piece) !== color)){
        state.coords = [];
        return;
    }
    let arr = pieceTypes[(piece.toLowerCase() === 'p' ? color : "")+piece.toLowerCase() +"dirs"]
    piece = piece.toLowerCase()
    let depth = arr[0][0];
    let valid = 0;
    //dfs with pawn insurance
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
                valid++;
            }
            if(state.piece_board[x1][y1] !== ' ')
                break;
        }
    }
    if(state.moved[x][y] && piece === 'p'){
        let add = arr[3][0]*2;
            if(add + x >= 0 && x + add < 8){
                state.move_board[x+add][y] = state.move_board[x+add][y] === ' ' ? '.' : ' ';
            }
    }
    //finding king valid move
    let board = state.piece_board;
    let kx,ky;
    for(let i = 0 ;i<8;i++){
        for(let j = 0;j<8;j++){
            if(board[i][j].toLowerCase() === 'k' && isUpper(board[i][j]) === color){
                kx = i;
                ky = j;
            }
        }
    }
    for(let i = 0 ;i<8;i++){
        for(let j = 0;j<8;j++){
            if(state.move_board[i][j] === '.'){
                let a = board[i][j];
                let b = board[x][y];
                board[i][j] = b;
                board[x][y] = ' ';
                if((piece === 'k' && isAttacked(i,j,color,board)) || (piece !== 'k' && isAttacked(kx,ky,color,board))){
                    console.log(board,"what")
                    valid--;
                    state.move_board[i][j] = ' ';
                }
                board[i][j] = a;
                board[x][y] = b;
            }
        }
    }
    //no valid move
    if(valid === 0)
        state.coords = [];
}

export default viewMoveHelper;
