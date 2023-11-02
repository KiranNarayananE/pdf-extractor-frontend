import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoute from "./Routes/User";

function App() {
    return (
        <div className="overflow-hidden ">
            <Router>
                <Routes>
                    <Route path="/*" element={<UserRoute />} />
                    
                </Routes>
            </Router>
        </div>
    );
}

export default App;
