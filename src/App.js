import { useState } from 'react';
import MainSection from './MainSection';
import './App.css'
import SideNav from './SideNav';
//comment added
export default function App() {
  const [active, setActive] = useState("INBOX")
  return (
    <div id='main'>
      <h1>TODO 2.0</h1>
      <header>
        <div className="row">
          <div className="col-md-2">
            <SideNav change={setActive} />
          </div>
          <div className="col-md-10">
            <MainSection active={active} />
          </div>
        </div>
      </header>
    </div>
  );
}
