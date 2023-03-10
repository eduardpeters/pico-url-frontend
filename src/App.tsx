import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import NotFound from './components/NotFound';
import Redirect from './components/Redirect';
import Register from './components/Register';
import Root from './components/Root';
import { AuthContextProvider } from './context/AuthContext';

function App() {
    return (
        <AuthContextProvider>
            <Routes>
                <Route path="/" element={<Root />} />
                <Route path="/:shortId" element={<Redirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/not-found" element={<NotFound />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthContextProvider>
    );
}

export default App;
