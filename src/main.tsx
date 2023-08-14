import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { router } from "./Router";
import "./index.css";

const queryClient = new QueryClient();

// const rootElement = document.getElementById("root")!;
// if (!rootElement.innerHTML) {
//   const root = ReactDOM.createRoot(rootElement);
//   root.render(
//     <StrictMode>
//       <QueryClientProvider client={queryClient}>
//         <div className="h-full min-h-screen font-sans antialiased scroll-smooth debug-screens">
//           <RouterProvider router={router} />
//         </div>
//       </QueryClientProvider>
//     </StrictMode>
//   );
// }

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
