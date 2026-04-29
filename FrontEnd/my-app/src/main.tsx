import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from './ContextsProviders/AuthContext.tsx';
import { setupPermissionGuardInterceptor } from './Services/permissionGuard.ts';
export const queryClient = new QueryClient();

setupPermissionGuardInterceptor();

// backhome button make us go to the home page and the page consider us loged out we need to fix this 
// make the nav par chech the auth before show signup and login buttons and make the home page check the auth before show the content of the page or not
createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
     
      </AuthProvider>
    </QueryClientProvider>
)
