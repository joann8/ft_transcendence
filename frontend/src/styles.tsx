import {
    makeStyles,
    createStyles,
 } from '@material-ui/core'

const useStyle = makeStyles(()=> createStyles({
    MessagesContainer: {
        width: '30%',
        height: '80%',
        margin: '0 auto',
        overflowY: 'scroll',
        background: 'white',
        marginBottom: '2%',
    },
    Message: {
        width: '70%',
        overflowWrap: 'break-word',
        marginLeft: '3%',
        backgroundColor: '#49E68B',
        borderRadius: '10px',
        marginBottom: '10px',
        padding: '2px',
        textAlign:'center',
    },
    Author: {
        display:'inline',
        marginRight: '3%'
    },
    Left:{

    },
    Right:{
        marginLeft: 'auto',
        marginRight: '0',
    },
    Content: {
        display:'inline',
    },
    PostContainer: {
        width: '100%',
        textAlign: 'center',
    },
    PostTextField: {
    },
    PostButton: {
        height: '100%',
    }
}))

export default useStyle;