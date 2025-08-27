import { Building2, CheckCircle, ChevronDown, Search, Users } from "lucide-react";

type Props = {
  directorateOptions: { id: number; name: string }[];
  selectedDirectorate: string;
  setSelectedDirectorate: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  groupOptions: { id: number; name: string }[];
  selectedGroup: string;
  setSelectedGroup: (value: string) => void;
};

export default function UserFiltersPanel({
  directorateOptions,
  selectedDirectorate,
  setSelectedDirectorate,
  selectedStatus,
  setSelectedStatus,
  searchTerm,
  setSearchTerm,
  groupOptions,
  selectedGroup,
  setSelectedGroup,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
     gap-4 w-full mb-1 px-2">

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-white bg-gradient-to-r from-slate-800 to-slate-600 p-1 rounded-full" />
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 
        text-slate-300 placeholder-slate-400 font-medium shadow-md
        bg-gradient-to-r from-slate-800 to-slate-700
          focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-600
          hover:border-slate-500 transition duration-300"
        />
      </div>

      {/* Directorate */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Building2 className="w-5 h-5 text-white bg-gradient-to-r from-slate-800 to-slate-600 p-1 rounded-full" />
        </div>
        <select
          value={selectedDirectorate}
          onChange={(e) => setSelectedDirectorate(e.target.value)}
          className="w-full pl-12 pr-10 py-3 border border-slate-300 rounded-xl 
          shadow-md font-medium cursor-pointer text-slate-400
          focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-600
          hover:border-slate-500 transition duration-300 appearance-none 
          bg-gradient-to-r from-slate-800 to-slate-700"
        >
          <option value="">All Directorates</option>
          {directorateOptions
            .filter((dir) => dir.id >= 6)
            .map((dir) => (
              <option key={dir.id} value={dir.name}>
                {dir.name}
              </option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* Group */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Users className="w-5 h-5 text-white bg-gradient-to-r from-slate-800 to-slate-600 p-1 rounded-full" />
        </div>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full pl-12 pr-10 py-3 border border-slate-300 rounded-xl 
          shadow-md font-medium cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-600
          hover:border-slate-500 text-slate-400
          bg-gradient-to-r from-slate-800 to-slate-700 transition duration-300 appearance-none"
        >
          <option value="">All Groups</option>
          {groupOptions.map((group) => (
            <option key={group.id} value={group.name}>
              {group.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* Status */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <CheckCircle className="w-5 h-5 text-white bg-gradient-to-r from-slate-800 to-slate-600 p-1 rounded-full" />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full pl-12 pr-10 py-3 border border-slate-300 rounded-xl
          bg-gradient-to-r from-slate-800 to-slate-700 text-slate-400 
          shadow-md font-medium cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-600
          hover:border-slate-500 transition duration-300 appearance-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="deactive">Deactive</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-slate-500" />
        </div>
      </div>
    </div>
  );
}
