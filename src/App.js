import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { InspectionReport } from "./pages/InspectionReport";
import { RCA } from "./pages/RCA";
import InspectionForm from "./pages/InspectionForm";
import SideNavbar from "./components/SideNavbar";
import WorkDetails from "./pages/WorkDetails";
import UserPage from "./pages/UserPage"; // Import your individual page component
import InspectionFormMDO from "./pages/InspectionFormMDO";
import RequestMaintenance from "./pages/RequestMaintenance";
import WorkOrder from "./pages/WorkOrder";
import RequestPart from "./pages/RequestPart";
import Reservation from "./pages/Reservation";
import Schedules from "./pages/Schedules";
import ScheduleFormUser from "./pages/ScheduleFormUser";
import DailyInspectionReport from "./pages/DailyInspectionReport";
import InspectionTransfer from "./pages/InspectionTransfer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes wrapped with SideNavbar */}
        <Route
          path="/*"
          element={
            <SideNavbar>
              <Routes>
                <Route path='inspection/inspection_report' element={<InspectionReport />} />
                <Route path='inspection/daily_inspection_report' element={<DailyInspectionReport/>} />
                <Route path='inspection/inspection_transfer' element={<InspectionTransfer/>} />
                <Route path='inspection/rca' element={<RCA />} />
                <Route path='assign/workdetails' element={<WorkDetails />} />
                <Route path='/maintenance/request_maintenance' element={<RequestMaintenance />} />
                <Route path='/maintenance/workorder' element={<WorkOrder />} />
                <Route path='/maintenance/request_part' element={<RequestPart />} />
                <Route path='/maintenance/reservation' element={<Reservation />} />
                <Route path='/schedules' element={<Schedules />} />
                {/* <Route path='inspection/inspection_form' element={<Inspection_Form_Button />} /> */}
              </Routes>
            </SideNavbar>
          }
        />
        {/* Route for the individual page */}
        <Route path="/user" element={<UserPage />} />
        <Route path="/inspection/form/:id/:asset_id/:asset_name/:emp_id/:emp_name/:dept_name" element={<InspectionForm />} />
        <Route path="inspection/form/mdo" element={<InspectionFormMDO />} />
        <Route path="user/service-maintenance/:id" element={<ScheduleFormUser />} />
        <Route path="user/service-maintenance" element={<ScheduleFormUser />} />
        {/* <Route path="inspection/form" element={<InspectionForm />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
