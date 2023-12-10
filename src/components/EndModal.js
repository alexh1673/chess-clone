import { useDispatch , useSelector} from 'react-redux';
import Modal from '@mui/material/Modal'; 
import Box from '@mui/material/Box';


export default function EndGame(){

    let winner = useSelector((state) => state.winner);

    return <Modal
            open={(winner !== 'x')}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
            style={{
                display: 'flex',
                alignItems: 'center', 
                justifyContent: 'center',
                margin: 'auto' ,
                width: '500px',height : '500px' , backgroundColor: 'black', color: 'white'
            }}
        >
        <Box style = {{width: '100%',height : '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <h2 id="parent-modal-title">Winner : {winner}</h2>
        </Box>
    </Modal>
}