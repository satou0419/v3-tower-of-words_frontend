// // pages/UpdateProgress.tsx
// "use client";
// import useUpdateSimulationProgress from "@/hook/useUpdateSimulationProgress";
// import React, { useState } from "react";

// const UpdateProgress: React.FC = () => {
//     const { updateProgress, loading, error } = useUpdateSimulationProgress();
//     const [progress, setProgress] = useState({
//         simulationWordsID: 1,
//         numberOfAttempts: 3,
//         isCorrect: true,
//         score: 85,
//         duration: 120,
//         accuracy: 0.95,
//     });

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setProgress((prevProgress) => ({
//             ...prevProgress,
//             [name]: name === "isCorrect" ? e.target.checked : parseFloat(value),
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         await updateProgress(progress);
//     };

//     return (
//         <div>
//             <h1>Update Simulation Progress</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Simulation Words ID:</label>
//                     <input
//                         type="number"
//                         name="simulationWordsID"
//                         value={progress.simulationWordsID}
//                         onChange={handleInputChange}
//                     />
//                 </div>
//                 <div>
//                     <label>Number of Attempts:</label>
//                     <input
//                         type="number"
//                         name="numberOfAttempts"
//                         value={progress.numberOfAttempts}
//                         onChange={handleInputChange}
//                     />
//                 </div>

//                 <div>
//                     <label>Is Correct:</label>
//                     <input
//                         type="checkbox"
//                         name="isCorrect"
//                         checked={progress.isCorrect}
//                         onChange={handleInputChange}
//                     />
//                 </div>
//                 <div>
//                     <label>Score:</label>
//                     <input
//                         type="number"
//                         name="score"
//                         value={progress.score}
//                         onChange={handleInputChange}
//                     />
//                 </div>
//                 <div>
//                     <label>Duration:</label>
//                     <input
//                         type="number"
//                         name="duration"
//                         value={progress.duration}
//                         onChange={handleInputChange}
//                     />
//                 </div>
//                 <div>
//                     <label>Accuracy:</label>
//                     <input
//                         type="number"
//                         name="accuracy"
//                         value={progress.accuracy}
//                         onChange={handleInputChange}
//                     />
//                 </div>
//                 <button type="submit" disabled={loading}>
//                     {loading ? "Updating..." : "Update Progress"}
//                 </button>
//                 {error && <p>Error: {error}</p>}
//             </form>
//         </div>
//     );
// };

// export default UpdateProgress;
