import { Route, Routes } from 'react-router-dom';
import NotFound from './components/NotFound';
import Redirect from './components/Redirect';
import Root from './components/Root';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Root />} />
                <Route path="/:id" element={<Redirect />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
