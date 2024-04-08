"use client";

import ContextBar from "@/components/ContextBar";
import { Button } from "basicui";

export default function Resumes() {
  const newResume = () => {
    
  }

  const manageResume = (id: string) => {
    console.log(id);
  }

  const handleKeydown = (event: any, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      manageResume(id);
    }
  }

  return (
    <div>
      <ContextBar>
        <Button onClick={newResume}>
          New resume
        </Button>
        </ContextBar>
      <div className="page">
        <table className="basicui-table">
          <thead>
            <tr>
              <th>Candidate name</th>
              <th>Created on</th>
            </tr>
          </thead>
          <tbody>
          <tr tabIndex={0} onClick={() => manageResume('1')} onKeyDown={(event) => handleKeydown(event, '1')}>
              <td>Lorem ipsum</td>
              <td>Lorem ipsum</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
