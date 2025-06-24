// import { useState } from "react";
// import StartPage from "./StartPage";
// import ReviewPage from "./ReviewPage"; // Bạn sẽ tạo sau

// function HomePage() {
//   const [tab, setTab] = useState("learning");

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex justify-center gap-4 py-6">
//         <button
//           onClick={() => setTab("learning")}
//           className={`px-6 py-2 rounded-full text-sm font-semibold shadow ${
//             tab === "learning"
//               ? "bg-blue-600 text-white"
//               : "bg-white border border-gray-300 text-gray-800"
//           } transition`}
//         >
//           Learning
//         </button>
//         <button
//           onClick={() => setTab("review")}
//           className={`px-6 py-2 rounded-full text-sm font-semibold shadow ${
//             tab === "review"
//               ? "bg-green-600 text-white"
//               : "bg-white border border-gray-300 text-gray-800"
//           } transition`}
//         >
//           Review
//         </button>
//       </div>

//       {tab === "learning" ? <StartPage /> : <ReviewPage />}
//     </div>
//   );
// }

// export default HomePage;
