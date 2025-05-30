import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Login from "./page/Login.tsx"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    )
}

export default App