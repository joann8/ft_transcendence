import '../App.css';
import React, { useState } from 'react'
import useStyle from '../styles'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
type message = {
    Author: string,
    Text: string,
}
type propMessage = {
    key: number,
    author: string,
    content: string,
}

type propPostMessage = {
    onSubmit: (author: string, content: string) => void,
}

let Message = (props: propMessage) => {
    const classes = useStyle();
    if (props.author !== 'Thib')
        return ( <div className={`${classes.Message} ${classes.Left}`}>
        <div className = {`${classes.Author} ${classes.Left}`}>{props.author + ' said : '}</div>
        <div className = {`${classes.Content} ${classes.Left}`}>{props.content}</div></div>);
    else
        return (<div className={`${classes.Message} ${classes.Right}`}>
        <div className = {`${classes.Author} ${classes.Right}`}>{props.author + ' said : '}</div>
        <div className = {`${classes.Content} ${classes.Right}`}>{props.content}</div></div>)
}

let PostMessage = (props: propPostMessage) => {
    const classes = useStyle();
    const [author, setAuthor] = useState<string>();
    const [content, setContent] = useState<string>();
    let handleButtonClick = () => {
        if (author && content) {
            console.log(author, content)
            props.onSubmit(author, content)
        }
    }
    let handleChangeAuthor = (event: React.ChangeEvent<HTMLInputElement>)=> {
        setAuthor(event.target.value)
    }
    let handleChangeContent = (event: React.ChangeEvent<HTMLInputElement>)=> {
        setContent(event.target.value)
    }
    return <Grid className = {classes.PostContainer} container columnSpacing = {6} justifyContent="center">
                <Grid item> 
                    <TextField className = {classes.PostTextField} id="outlined-basic" label="User" variant="outlined" onChange={handleChangeAuthor} color = 'green'/>
                </Grid>
                <Grid item>
                    <TextField className = {classes.PostTextField} id="outlined-basic" label="Message" variant="outlined" onChange={handleChangeContent} color = 'green' />
                </Grid>
                <Grid item>
                    <Button className = {classes.PostButton} variant="contained" onClick= {handleButtonClick} color= 'green'>Send</Button>
                </Grid>
        </Grid>
}

let Channel = () => {
    const classes = useStyle();
    const [messageList, setMessageList] = useState<message[]>([]);
    let scrollDiv = React.useRef<HTMLDivElement>(null)
    React.useEffect(() => {   
        setMessageList([{
            Author:"Thib",
            Text: "My name is thib"
        },])
    }, []);
    React.useEffect(() => {   
        console.log(scrollDiv.current);
        scrollDiv.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        })
    }, [messageList]);
    let addMessage = (author: string, content: string) => {
        setMessageList([...messageList, {Author: author, Text: content}]);
    }
    return <>
    <div className={classes.MessagesContainer} >{messageList.map((elem, key)=>{
        return <Message key={key} author={elem.Author} content={elem.Text}></Message>;
    })}
    <div ref = {scrollDiv}></div>
    </div>
    <PostMessage onSubmit = {addMessage}></PostMessage>
    </>;
}

export default Channel