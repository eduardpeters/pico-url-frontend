import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import NotFound from './components/NotFound';
import Redirect from './components/Redirect';
import Root from './components/Root';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Root />} />
                <Route path="/:shortId" element={<Redirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
