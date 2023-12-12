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
    for(let i = 1;i<arr.length - (piece === 'p');i++){
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
                (piece === board[x1][y1].toLowerCase() || (piece !== 'n' && 
                (board[x1][y1].toLowerCase() === 'q' || (j == 0 && board[x1][y1].toLowerCase() === 'k'))))){
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
    let arr = pieceTypes[color + 'p' + "dirs"];
    //dfs(x,y,pieceTypes.ndirs,'n',color,board) || dfs(x,y,pieceTypes.rdirs,'r',color,board) || dfs(x,y,pieceTypes.bdirs,'b',color,board) || dfs(x,y,arr,'p',color,board)
    return dfs(x,y,pieceTypes.ndirs,'n',color,board) || dfs(x,y,pieceTypes.rdirs,'r',color,board) || dfs(x,y,pieceTypes.bdirs,'b',color,board) || dfs(x,y,arr,'p',color,board)
}

function findKing(color,board){
    let kx,ky;
    for(let i = 0 ;i<8;i++){
        for(let j = 0;j<8;j++){
            if(board[i][j].toLowerCase() === 'k' && isUpper(board[i][j]) === color){
                kx = i;
                ky = j;
            }
        }
    }
    return [kx,ky];
}

function castle(color,state){
    let x = color === 'w' ? 7 : 0;
    let res = 0;
    //king not ons tarting sq or in check
    if(!state.moved[x][4] || isAttacked(x,4,color,state.piece_board)){
        return res;
    }
    if(!isAttacked(x,3,color,state.piece_board) && !isAttacked(x,2,color,state.piece_board) && state.moved[x][0] &&
    (state.piece_board[x][3] === state.piece_board[x][2] && state.piece_board[x][2] === state.piece_board[x][1])){
        res++;
        state.move_board[x][2] = '.';
    }
    if(!isAttacked(x,5,color,state.piece_board) && !isAttacked(x,6,color,state.piece_board) && state.moved[x][7] &&
    (state.piece_board[x][5] === state.piece_board[x][6])){
        res++;
        state.move_board[x][6] = '.';
    }
    return res;
}

function viewMoveHelper(state,x,y){
    let piece = state.piece_board[x][y];
    let color = state.turn;
    if(piece === ' ' || (isUpper(piece) !== color)){
        if(state.coords.length)
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
        let add = arr[3][0];
        if(add*2 + x >= 0 && x + add*2 < 8){
            valid++;
            state.move_board[x+add*2][y] = 
            (state.piece_board[x+add][y] === state.piece_board[x+add*2][y] && state.piece_board[x+add][y] === ' ') ? '.' : ' ';
        }
    }
    //a move that would leave the king under attack is invalid*
    let board = state.piece_board;
    let k = findKing(state.turn,board);
    for(let i = 0 ;i<8;i++){
        for(let j = 0;j<8;j++){
            if(state.move_board[i][j] === '.'){
                let a = board[i][j];
                let b = board[x][y];
                board[i][j] = b;
                board[x][y] = ' ';
                if((piece === 'k' && isAttacked(i,j,color,board)) || (piece !== 'k' && isAttacked(k[0],k[1],color,board))){
                    valid--;
                    state.move_board[i][j] = ' ';
                }
                board[i][j] = a;
                board[x][y] = b;
            }
        }
    }
    if(piece === 'k')
        valid += castle(color,state);
    //no valid move
    state.moves = valid;
    if(valid === 0 && state.coords.length)
        state.coords = [];

}

export { dfs, viewMoveHelper, isAttacked, isUpper,findKing};
