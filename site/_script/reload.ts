let ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = e => 
    {
        if (e.data === 'reload')
            location.reload();
    }