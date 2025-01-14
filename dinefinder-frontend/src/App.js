import React, { useEffect } from 'react';
import axios from 'axios';

function App() {
    useEffect(() => {
        axios.get('/test')
            .then(response => console.log(response.data))
            .catch(error => console.error(error));
    }, []);

    return <div className="App">Welcome to DineFinder!</div>;
}

export default App;
