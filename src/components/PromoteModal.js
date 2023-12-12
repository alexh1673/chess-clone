import { useDispatch , useSelector} from 'react-redux';
import {promote} from './boardReducer';
import Modal from '@mui/material/Modal'; 
import Button from '@mui/material/Button';


export default function PromoteModal(){

    const dispatch = useDispatch()
    let coord = useSelector((state) => state.promoting);

    function handleClick(event){
        let pass = coord[4] === 'w' ? event : event.toLowerCase();
        dispatch(promote(pass))
    }

    function getPath(piece){
        let t = coord[4] === 'w' ? '_'  : "";
        return './pieces\/' + piece + t + '.png';
    }

    return <Modal
            open={coord[2] != 'x'}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
            style={{
                display: 'flex',
                alignItems: 'center', 
                justifyContent: 'center',
                margin: 'auto'
            }}
        >
            {coord.length != 0 ? 
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto', height: '100px', backgroundColor: 'yellow', maxWidth: '400px',   borderRadius: '10px'}}>
                    <Button style={{width : '100px', height : '100px'}} onClick={() => handleClick('Q')}>
                        <img
                            style={{width : '100%', height : '100%'}}
                            src={require(`${getPath("Q")}`)} 
                        />
                    </Button>
                    <Button style={{width : '100px', height : '100px'}} onClick={() => handleClick('R')}>
                        <img
                            style={{width : '100px', height : '100px'}}
                            src={require(`${getPath("R")}`)} 
                        />
                    </Button>
                    <Button style={{width : '100px', height : '100px'}} onClick={() => handleClick('B')}>
                        <img
                            style={{width : '100px', height : '100px'}}
                            src={require(`${getPath("B")}`)} 
                        />
                    </Button>
                    <Button style={{width : '100px', height : '100px'}} onClick={() => handleClick('N')}>
                        <img
                            style={{width : '100px', height : '100px'}}
                            src={require(`${getPath("N")}`)} 
                        />
                    </Button>
                </div>
            : null
            }
    </Modal>
}