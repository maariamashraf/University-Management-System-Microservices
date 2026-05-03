import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { isAuth } from '../../Services/authService';
import { getRole } from '../../Services/userService';

const GlobalErrorFallback = () => {
    const error = useRouteError();

    let title = 'An Error Occurred!';
    let message = 'Something went wrong, please try again later.';
    let status = 0;
    if (isRouteErrorResponse(error)) {
        status = error.status;
        if (error.status === 404) {
            title = 'Page Not Found';
            message = 'The page you are looking for does not exist.';
        } else if (error.status === 500) {
            title = 'Server Error';
            message = error.data?.message || message;
        }
    }
    else if (error instanceof Error) {
        message = error.message;
    }

     let redirectPage = "/"
     if(isAuth()){
       const role=getRole()
       if(role==="admin"){
        redirectPage="/dashboard/admin/users-permissions"
       } 
        else {
        redirectPage="/dashboard"
       } 
     }else{
        redirectPage="/"
     }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-red-500 text-4xl font-bold mb-4"> {status}</p>
                <h1 className="text-3xl font-bold text-red-500 mb-4">{title}</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                
                <button
                    onClick={() => window.location.href = redirectPage}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Go Back Home
                </button>
            </div>
        </div>
    );
};


export default GlobalErrorFallback;