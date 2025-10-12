"use client";

import { listClassrooms } from "@/services/classroom";
import { useEffect, useState } from "react";

export default function Classrooms() {
  const userId = "68e404ac0026957297f5";
  const [classrooms, setClassrooms] = useState<any[]>([]);

  useEffect(() => {
    async function getClassrooms() {
      const res = await listClassrooms(userId);
      console.log(res);
      setClassrooms(res);
    }
    getClassrooms();
  }, [userId]);
  return (
    <div>
      <h1>Classrooms</h1>
      <ul>
        {classrooms.map((classroom) => (
          <li key={classroom.$id}>{classroom.name}</li>
        ))}
      </ul>
    </div>
  );
}
