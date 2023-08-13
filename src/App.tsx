import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { buttonVariants } from "./components/ui/button";
import NavigationLayout from "./layouts/NavigationLayout";
import { useAuthUser } from "./services/auth";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full min-h-screen font-sans antialiased scroll-smooth debug-screens">
        <Main />
      </div>
    </QueryClientProvider>
  );
}

function Main() {
  const { isLoggedIn, username, logoutUrl, isLoading } = useAuthUser();
  // const { data: recipes } = useRecipes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen transition-all bg-slate-100">
        <svg
          className="w-6 h-6 animate-spin text-slate-800"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx={12}
            cy={12}
            r={10}
            stroke="currentColor"
            strokeWidth={4}
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      {!isLoggedIn ? (
        <div className="p-20">
          <a
            href="/bff/login?returnUrl=/"
            className={buttonVariants({ variant: "default" })}
          >
            Login
          </a>
        </div>
      ) : (
        <NavigationLayout>
          <div className="flex-shrink-0 block">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="block text-base font-medium text-blue-500 md:text-sm">{`Hi, ${username}!`}</p>
                <a
                  href={logoutUrl?.value}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </NavigationLayout>
      )}
      {/* {
        <ul className="py-10 space-y-2">
          {recipes &&
            recipes.map((recipe) => (
              <li className="px-4 py-3 border rounded-md shadow text-medium border-gray-20">
                {recipe.title}
              </li>
            ))}
        </ul>
      } */}
    </>
  );
}

export default App;
