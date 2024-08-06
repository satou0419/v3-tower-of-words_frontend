// components/AllStudentCharts.tsx

"use client";
import React from "react";
import StudentChart from "./StudentChart";

interface StudentData {
    studentId: number;
    averageDuration: number;
    averageAccuracy: number;
}

const allStudentData: StudentData[] = [
    { studentId: 1, averageDuration: 30, averageAccuracy: 85 },
    { studentId: 2, averageDuration: 45, averageAccuracy: 90 },
    { studentId: 3, averageDuration: 25, averageAccuracy: 78 },
    { studentId: 4, averageDuration: 35, averageAccuracy: 82 },
    { studentId: 5, averageDuration: 40, averageAccuracy: 88 },
    { studentId: 6, averageDuration: 20, averageAccuracy: 75 },
    { studentId: 7, averageDuration: 50, averageAccuracy: 92 },
    { studentId: 8, averageDuration: 28, averageAccuracy: 80 },
    { studentId: 9, averageDuration: 32, averageAccuracy: 84 },
    { studentId: 10, averageDuration: 38, averageAccuracy: 87 },
];

const AllStudentCharts = () => {
    return (
        <div>
            {allStudentData.map((data) => (
                <StudentChart key={data.studentId} data={data} />
            ))}
        </div>
    );
};

export default AllStudentCharts;
