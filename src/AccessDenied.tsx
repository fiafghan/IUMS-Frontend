import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function AccessDenied() {
const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md p-10 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600">
          You Are Not Allowed to Access This Page!!!
          <div>
            <button onClick={() => {
              navigate('/')
            }} className="bg-blue-400 rounded-md p-1 text-white">Back</button>
          </div>

        </p>
      </div>
    </div>
  );
}
