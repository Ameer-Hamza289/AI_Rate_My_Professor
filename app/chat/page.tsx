'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import ChatInput from '@/components/ChatInput';
import Bubble from '@/components/Bubble';
import ChatWindow from '@/components/ChatWindow';

interface IHistory{
  role:string;
  content:string;
}

export default function Home() {
  const [history, setHistory] = useState<IHistory[]>([{
    role: "model",
    content: "Hi! I'm the Rate My Professor support assistant. How can I help you today?"
  }]);
  const [debounce, setDebounce] = useState(false);

  const router = useRouter();

  async function fetchResponse(msg: string) {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history: history, incoming: msg })
    });

    if (!res.ok) {
      throw Error(`Communication failed with code ${res.status}.`);
    }
    if (!res.body) {
      throw Error('Missing response from server.');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let txt = '';
    while (true) {
      const stream = await reader.read();
      if (stream.done) break;

      const raw = stream.value;
      txt += decoder.decode(raw);
    }

    return txt;
  }

  const sendMessage = async (msg: string) => {
    const future = [
      ...history,
      { role: 'user', content: msg }
    ];

    setHistory(future);
    setDebounce(true);

    try {
      const res = await fetchResponse(msg);
      setHistory([
        ...future,
        { role: 'model', content: res }
      ]);
      setDebounce(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4, p: 2 }}>
      
        <Stack
          direction={'column'}
          height="700px"
          borderRadius="12px"
          bgcolor="background.paper"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
          p={3}
          spacing={3}
        >
          <ChatWindow width='100%' height='100%'>
            {history.map(({ role, content }, idx) => {
              const flushLeft = role === 'model';
              const bgcolor = flushLeft ? '#3b82f6' : '#d1d5db';
              return (
                <Bubble
                  key={idx}
                  content={content}
                  bgcolor={bgcolor}
                  flushLeft={flushLeft}
                />
              );
            })}
          </ChatWindow>
          <ChatInput onSubmit={sendMessage} debounce={debounce} />
        </Stack>
    </Container>
  );
}
