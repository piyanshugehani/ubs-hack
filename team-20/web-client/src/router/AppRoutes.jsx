import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import SyllabusUpload from "../pages/upload/Upload";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path='/upload' element={<SyllabusUpload />} />
        </Routes>
    )
}
export default AppRoutes;