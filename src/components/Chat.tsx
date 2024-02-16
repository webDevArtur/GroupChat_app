import {Paper, Typography, TextField, Button, List, ListItem, ListItemText, Avatar} from '@mui/material';
import {styled} from '@mui/system';
import SendIcon from '@mui/icons-material/Send';
import {useAuthState} from "react-firebase-hooks/auth";
import {useContext, useState, useEffect} from "react";
import {Context} from "../app/App.tsx";
import firebase from "firebase/compat/app";
import {collection, getDocs, addDoc, serverTimestamp, query, orderBy, deleteDoc, doc} from "firebase/firestore";
import ColorHash from 'color-hash';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMediaQuery } from '@mui/material';

const colorHash = new ColorHash({saturation: 0.3, lightness: 0.9});


const RootPaper = styled(Paper)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2),
    backgroundColor: '#f0f0f0',
}));

const ChatContainer = styled('div')(({theme}) => ({
    flexGrow: 1,
    overflowY: 'auto',
    marginBottom: theme.spacing(1),
}));

const MessageList = styled(List)({
    padding: 0,
});


interface CustomListItemProps extends React.HTMLAttributes<HTMLLIElement> {
    userColor?: string;
}

const MessageItem = styled(ListItem)<CustomListItemProps>(({theme, userColor}) => ({
    marginBottom: theme.spacing(1),
    backgroundColor: userColor || '#ffffff',
    borderRadius: '16px',
}));

const InputContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    marginTop: 'auto',
    padding: '8px',
    borderTop: '1px solid #ccc',
    backgroundColor: '#ffffff',
});

const InputTextField = styled(TextField)(() => ({
    flexGrow: 1,
}));

const SendButton = styled(Button)(({theme}) => ({
    marginLeft: theme.spacing(1),
}));

interface Message {
    displayName: string;
    text: string;
    createdAt: firebase.firestore.FieldValue;
    email: string;
    photoURL: string;
}

const Chat = () => {
    const {auth, firestore} = useContext(Context);
    const user = useAuthState(auth);
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const isMobile = useMediaQuery('(max-width:900px)');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messagesCol = collection(firestore, 'messages');
                const messageSnapshot = await getDocs(query(messagesCol, orderBy('createdAt')));
                const messageList = messageSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id, // Добавляем id сообщения
                        displayName: data.displayName,
                        text: data.text,
                        createdAt: data.createdAt,
                        email: data.email,
                        photoURL: data.photoURL
                    };
                });
                setMessages(messageList);
            } catch (error) {
                console.error("Error fetching messages: ", error);
            }
        };

        fetchMessages();
    }, [messages]);


    const sendMessage = async () => {
        try {
            await addDoc(collection(firestore, "messages"), {
                displayName: user[0]?.displayName || null,
                text: value,
                createdAt: serverTimestamp(),
                email: user[0]?.email || null,
                photoURL: user[0]?.photoURL || null
            });
            setValue('');
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const deleteMessage = async (messageId: string) => {
        try {
            await deleteDoc(doc(firestore, "messages", messageId));
        } catch (error) {
            console.error("Error deleting message: ", error);
        }
    };

    return (
        <RootPaper elevation={3}>
            <Typography variant="h5" gutterBottom>
                Групповой чат
            </Typography>
            <ChatContainer sx={{ marginBottom: isMobile ? '0' : '8px' }}>
                <MessageList>
                    {messages && messages.length > 0 ? (
                        messages.map((message, index) => (
                            <MessageItem key={index} userColor={colorHash.hex(message.email)}>
                                <Avatar alt={message.displayName} src={message.photoURL} sx={{ marginRight: 2 }} />
                                <ListItemText
                                    primary={
                                        <span style={{ fontWeight: 'bold', color: 'blue' }}>
                                            {message.displayName}:
                                        </span>
                                    }
                                    secondary={message.text}
                                />
                                {message.email === user[0]?.email && (
                                    <IconButton aria-label="delete" onClick={() => deleteMessage(message.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </MessageItem>
                        ))
                    ) : (
                        <MessageItem>
                            <ListItemText primary="Нет сообщений. Начните общение!" />
                        </MessageItem>
                    )}
                </MessageList>
            </ChatContainer>
            <InputContainer sx={{ borderRadius: isMobile ? '0' : '16px' }}>
                <InputTextField
                    label="Сообщение"
                    variant="outlined"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                />
                <SendButton variant="contained" color="primary" endIcon={<SendIcon />} onClick={sendMessage}>
                    Отправить
                </SendButton>
            </InputContainer>
        </RootPaper>
    );
};

export default Chat;

interface Message {
    displayName: string;
    text: string;
    createdAt: firebase.firestore.FieldValue;
    email: string;
    photoURL: string;
    id: string;
}