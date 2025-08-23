import { memo } from "react";
import { Edit, Trash, Eye, Building, Briefcase, Users } from "lucide-react";
import type { InternetUser } from "../types/types";

interface UserRowProps {
  user: InternetUser;
  idx: number;
  handleEdit: (user: InternetUser) => void;
  handleDelete: (id: string) => void;
  handleView: (user: InternetUser) => void;
  isViewer: boolean;
  currentUserRole: string;
}

const UserRow = memo(({ user, idx, handleEdit, handleDelete, handleView, isViewer, currentUserRole }: UserRowProps) => {
  const isRedCard = user.violation_count === 2;
  const isYellowCard = user.violation_count === 1;

  // Safe text truncation with better length management
  const truncateText = (text: string | undefined, maxLength: number = 12) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <tr
      className={`group transition-all duration-200 border-b border-gray-100 hover:shadow-sm ${
        isRedCard
          ? "bg-red-50 hover:bg-red-100"
          : idx % 2 === 0
            ? "bg-white hover:bg-blue-50"
            : "bg-gray-50 hover:bg-blue-50"
      }`}
    >
      {/* Name Column - Compact with avatar */}
      <td className="px-2 py-3 w-28">
        <div className="flex items-center space-x-2">
          <div className="relative flex-shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs 
            font-semibold text-white shadow-sm ${
              isRedCard 
                ? "bg-red-500" 
                : isYellowCard 
                  ? "bg-yellow-500"
                  : "bg-blue-500"
            }`}>
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {/* Violation indicators */}
            {isYellowCard && (
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 
              rounded-full border-2 border-white shadow-sm"></div>
            )}
            {isRedCard && (
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 
              rounded-full border-2 border-white shadow-sm"></div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-gray-900 truncate" title={user.name || 'N/A'}>
              {truncateText(user.name, 15)}
            </div>
          </div>
        </div>
      </td>

      {/* Lastname Column - Compact */}
      <td className="px-2 py-3 w-24">
        <div className="text-xs text-gray-700 truncate font-medium" title={user.lastname || 'N/A'}>
          {truncateText(user.lastname, 15)}
        </div>
      </td>

      {/* Username Column - Compact with monospace */}
      <td className="px-2 py-3 w-20">
        <div className="text-xs font-mono text-gray-800 truncate bg-gray-50 px-2 py-1 rounded" title={user.username || 'N/A'}>
          {truncateText(user.username, 12)}
        </div>
      </td>

      {/* Directorate Column - Compact with icon */}
      <td className="px-2 py-3 w-24">
        <div className="flex items-center space-x-1" title={String(user.directorate) || 'N/A'}>
          <Building className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">
            {truncateText(String(user.directorate), 40)}
          </span>
        </div>
      </td>

      {/* Position Column - Compact with icon */}
      <td className="px-2 py-3 w-20">
        <div className="flex items-center space-x-1" title={String(user.position) || 'N/A'}>
          <Briefcase className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">
            {truncateText(String(user.position), 20)}
          </span>
        </div>
      </td>

      {/* Groups Column - Compact with icon */}
      <td className="px-2 py-3 w-20">
        <div className="flex items-center space-x-1" title={String(user.groups) || 'N/A'}>
          <Users className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-600 truncate">
            {truncateText(String(user.groups), 10)}
          </span>
        </div>
      </td>

      {/* Status Column - Compact with better styling */}
      <td className="px-2 py-3 w-18">
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full shadow-sm ${
            user.status === 1 
              ? "bg-green-500" 
              : user.status === 0 
                ? "bg-red-500" 
                : "bg-gray-400"
          }`}></div>
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full text-xs ${
            user.status === 1 
              ? "text-green-700 bg-green-100" 
              : user.status === 0 
                ? "text-red-700 bg-red-100" 
                : "text-gray-700 bg-gray-100"
          }`}>
            {user.status === 1 ? "Active" : user.status === 0 ? "Inactive" : "-"}
          </span>
        </div>
      </td>

      {/* Actions Column - Compact with better spacing */}
      <td className="px-2 py-3 w-20">
        <div className="flex items-center justify-center space-x-1">
          {isViewer && (
            <button 
              onClick={() => handleView(user)} 
              title="View Details"
              className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <Eye className="w-3 h-3" />
            </button>
          )}
          {currentUserRole !== "viewer" && (
            <>
              <button 
                onClick={() => handleEdit(user)} 
                title="Edit User"
                className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-200 hover:scale-105 shadow-sm"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button 
                onClick={() => handleDelete(user.id)} 
                title="Delete User"
                className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200 hover:scale-105 shadow-sm"
              >
                <Trash className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
});

UserRow.displayName = 'UserRow';

export default UserRow;