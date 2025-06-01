import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Login from "./page/Login.tsx"
import Dashboard from "./dashboard/Dashboard.tsx"
import UserManagement from "./dashboard/UserManagement.tsx"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/management" element={<UserManagement />} />
            </Routes>
        </Router>
    )
}

export default App