import { memo } from "react";
import { Trash, Building, Briefcase, Users, Pencil } from "lucide-react";
import type { InternetUser } from "../types/types";
import { motion } from "framer-motion";

interface UserRowProps {
  user: InternetUser;
  idx?: number;
  handleEdit: (user: InternetUser) => void;
  handleDelete: (id: string) => void;
  handleView: (user: InternetUser) => void;
  isViewer: boolean;
  currentUserRole: string;
}

const UserRow = memo(({ user, handleEdit, handleDelete, isViewer, currentUserRole }: UserRowProps) => {

  // Safe text truncation with better length management
  const truncateText = (text: string | undefined, maxLength: number = 30) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <>
      {/* Name Column */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="relative flex-shrink-0">
              <div className="w-7 h-7 bg-gradient-to-r from-slate-800 to-slate-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>            
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 break-words" title={user.name || 'N/A'}>
              {user.name && user.name.length > 10 ? (
                <>
                  {user.name.substring(0, 10)}
                  <br />
                  {user.name.substring(10)}
                </>
              ) : (
                user.name || 'N/A'
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Last Name Column */}
      <td className="px-4 py-3">
        <div className="text-sm text-gray-700 font-medium break-words" title={user.lastname || 'N/A'}>
          {user.lastname && user.lastname.length > 10 ? (
            <>
              {user.lastname.substring(0, 10)}
              <br />
              {user.lastname.substring(10)}
            </>
          ) : (
            user.lastname || 'N/A'
          )}
        </div>
      </td>

      {/* Username Column */}
      <td className="px-4 py-3">
        <div className="text-sm text-gray-800 font-medium break-words" title={user.username || 'N/A'}>
          {user.username && user.username.length > 10 ? (
            <>
              {user.username.substring(0, 10)}
              <br />
              {user.username.substring(10)}
            </>
          ) : (
            user.username || 'N/A'
          )}
        </div>
      </td>

      {/* Directorate Column */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2" title={String(user.directorate) || 'N/A'}>
          <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-700">
            {truncateText(String(user.directorate), 30)}
          </span>
        </div>
      </td>

      {/* Position Column */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2" title={String(user.position) || 'N/A'}>
          <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-700 break-words">
            {user.position && String(user.position).length > 10 ? (
              <>
                {String(user.position).substring(0, 10)}
                <br />
                {String(user.position).substring(10)}
              </>
            ) : (
              String(user.position) || 'N/A'
            )}
          </span>
        </div>
      </td>

      {/* Groups Column */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2" title={String(user.groups) || 'N/A'}>
          <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-700">
            {truncateText(String(user.groups), 30)}
          </span>
        </div>
      </td>

      {/* Status Column */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full shadow-sm ${user.status === 1
            ? "bg-green-500"
            : user.status === 0
              ? "bg-red-500"
              : "bg-gray-400"
            }`}></div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${user.status === 1
            ? "text-green-700 bg-green-100"
            : user.status === 0
              ? "text-red-700 bg-red-100"
              : "text-gray-700 bg-gray-100"
            }`}>
            {user.status === 1 ? "Active" : user.status === 0 ? "Inactive" : "-"}
          </span>
        </div>
      </td>

      {/* Actions Column */}
      {!isViewer && (
        <td className="px-4 py-3">
          <div className="flex items-center justify-center space-x-2">

            {currentUserRole !== "viewer" && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(user)}
                  className="p-2 bg-gradient-to-r from-slate-800 to-slate-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  title="Edit User"
                >
                  <Pencil className="w-4 h-4" />
                </motion.button>
                <button
                  onClick={() => handleDelete(user.id)}
                  title="Delete User"
                  className="p-2 bg-gradient-to-r from-red-400 to-red-300 text-white rounded-md hover:bg-red-600 transition-all 
                  duration-200 hover:scale-105 shadow-sm"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </td>
      )}
    </>
  );
});

UserRow.displayName = 'UserRow';

export default UserRow;