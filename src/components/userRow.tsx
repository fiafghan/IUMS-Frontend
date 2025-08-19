import { memo } from "react";
import { Edit, Trash, Eye } from "lucide-react";
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
  const isRedCard = user.violations_count === 2;
  const isYellowCard = user.violations_count === 1;

  return (
    <tr
      className={`transition-colors duration-200 ${isRedCard
        ? "bg-red-50"
        : idx % 2 === 0
          ? "bg-gray-50"
          : "bg-white"
      } hover:bg-blue-100`}
    >
      <td className="px-3 py-2 text-gray-700 text-[10px] whitespace-nowrap flex items-center gap-1 font-medium">
        {user.name}
        {isYellowCard && <span className="ml-1">🟨</span>}
        {isRedCard && <span className="ml-1">🟥</span>}
      </td>
      <td className="px-3 py-2 text-gray-700 text-[10px]">{user.lastname}</td>
      <td className="px-3 py-2 text-gray-700 text-[10px]">{user.username}</td>
      <td className="px-3 py-2 text-gray-700 text-[8px]">{user.directorate}</td>
      <td className="px-3 py-2 text-gray-700 text-[8px]">{user.position}</td>
      <td className="px-3 py-2 text-gray-700 text-[8px]">{user.groups}</td>
      <td className={`px-3 py-2 text-[10px] ${user.status === 1 ? "text-green-500" : user.status === 0 ? "text-red-500" : "text-gray-700"}`}>
        {user.status === 1 ? "active" : user.status === 0 ? "deactive" : "-"}
      </td>
      <td className="px-3 py-2 text-blue-400 text-center">
        <div className="flex justify-center gap-2">
          {isViewer && (
            <button onClick={() => handleView(user)} title="View">
              <Eye className="w-5 h-5 text-white rounded-full bg-blue-400 p-1" />
            </button>
          )}
          {currentUserRole !== "viewer" && (
            <>
              <button onClick={() => handleEdit(user)} title="Edit">
                <Edit className="w-5 h-5 text-white rounded-full bg-green-400 p-1" />
              </button>
              <button onClick={() => handleDelete(user.id)} title="Delete">
                <Trash className="w-5 h-5 text-white rounded-full bg-red-300 p-1" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
});

export default UserRow;
