'use client';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
// import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { Button } from '@mui/material';

export type ChatInputOptions = {
    onSubmit: ((msg: string) => void) | ((msg: string) => Promise<void>)
    debounce?: boolean
}

export default function ChatInput({
    onSubmit, debounce
}: ChatInputOptions) {
    const [message, setMessage] = useState<string>('');

    async function handleSubmit() {
        if (message.trim()) {
            setMessage('');
            await onSubmit(message);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    return (
        <Stack direction={'row'} spacing={1} alignItems='center'>
            <TextField 
                label="Ask about professor..." 
                fullWidth 
                variant="outlined"
                size="small"
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={handleKeyDown}
                sx={{
                    borderRadius: 20,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 20,
                        backgroundColor: '#f0f0f0',
                        '& fieldset': {
                            borderColor: '#d0d0d0',
                        },
                        '&:hover fieldset': {
                            borderColor: '#3f51b5',
                            borderWidth: 2,
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#3f51b5',
                            borderWidth: 2,
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#888',
                        transition: 'color 0.3s',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#3f51b5',
                    },
                    '& .MuiInputBase-input': {
                        transition: 'color 0.3s',
                    },
                    '&:hover .MuiInputBase-input': {
                        color: '#333',
                    },
                    '&:focus-within .MuiInputBase-input': {
                        color: '#000',
                    },
                }}
            />
            {/* <IconButton 
                color="primary" 
                onClick={handleSubmit} 
                disabled={debounce || !message.trim()}
                sx={{
                    borderRadius: '50%',
                    bgcolor: '#3f51b5', 
                    color: '#fff',
                    '&:hover': {
                        bgcolor: '#303f9f',
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s, bgcolor 0.3s',
                    },
                    '&:disabled': {
                        bgcolor: '#ccc',
                        color: '#888',
                    },
                }}
            >
                <SendIcon />
            </IconButton> */}
        <Button variant="contained" sx={{ borderRadius: 10 }} onClick={handleSubmit} disabled={debounce || false}>Send</Button>
        </Stack>
    );
}
