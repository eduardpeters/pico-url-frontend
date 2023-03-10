import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import NotFound from './components/NotFound';
import Redirect from './components/Redirect';
import Register from './components/Register';
import Root from './components/Root';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Root />} />
                <Route path="/:shortId" element={<Redirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/not-found" element={<NotFound />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
