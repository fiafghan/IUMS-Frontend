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
    <div className="grid grid-cols-4 justify-center w-full mb-2 mt-2">

      {/* Search */}
      <div className="relative group w-full max-w-md mx-auto">
        {/* Icon inside input */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-white rounded-full p-1 group-focus-within:text-white 
          transition-colors duration-300 ml-2 mt-2 bg-slate-900" />
        </div>

        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full pl-12 pr-4 py-3 rounded-sm border-2 border-slate-900 
      bg-white/90 text-slate-900 placeholder-slate-400 font-medium shadow-lg
      focus:outline-none focus:ring-4 focus:ring-slate-900/20 focus:border-slate-900
      transition-all duration-300 hover:border-slate-700 mt-2 ml-2"
        />

      </div>


      {/* Directorate */}
      <div className="relative group w-full max-w-md mx-auto">
        {/* Left icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Building2 className="w-5 h-5 group-focus-within:text-white 
          ml-2 mt-2 transition-colors duration-300 text-white bg-slate-900 p-1 rounded-full" />
        </div>

        {/* Select box */}
        <select
          value={selectedDirectorate}
          onChange={(e) => {
            console.log("Directorate selected:", e.target.value);
            setSelectedDirectorate(e.target.value);
          }}
          className="w-full pl-12 pr-10 py-3 border-2 border-slate-900 rounded-sm bg-white/90 
      shadow-lg font-medium text-slate-900 placeholder-slate-400 cursor-pointer
      focus:outline-none focus:ring-4 focus:ring-slate-900/20 focus:border-slate-900 
      transition-all duration-300 hover:border-slate-700 appearance-none mt-2 ml-3"
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

        {/* Right icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-slate-900 group-focus-within:text-white transition-colors duration-300" />
        </div>
      </div>

      {/* Group */}
      <div className="relative group w-full max-w-md mx-auto">
        {/* Left icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Users className="w-5 h-5 group-focus-within:text-white
          mt-2 ml-4 transition-colors duration-300 text-white bg-slate-900 rounded-full p-1" />
        </div>

        {/* Select box */}
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full pl-12 pr-10 py-3 border-2 border-slate-900 rounded-sm bg-white/90 
      shadow-lg font-medium text-slate-900 placeholder-slate-400 cursor-pointer
      focus:outline-none focus:ring-4 focus:ring-slate-900/20 focus:border-slate-900 
      transition-all duration-300 hover:border-slate-700 appearance-none mt-2 ml-4"
        >
          <option value="">All Groups</option>
          {groupOptions.map((group) => (
            <option key={group.id} value={group.name}>
              {group.name}
            </option>
          ))}
        </select>

        {/* Right icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-slate-900 group-focus-within:text-white transition-colors duration-300" />
        </div>
      </div>

      {/* Status */}
      <div className="relative group w-50 max-w-md mx-auto">
        {/* Left icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <CheckCircle className="w-5 h-5 group-focus-within:text-white 
          mt-2 ml-2 transition-colors duration-300 text-white bg-slate-900 rounded-full p-1" />
        </div>

        {/* Select */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full pl-12 pr-10 py-3 border-2 border-slate-900 rounded-sm bg-white/90 
      shadow-lg font-medium text-slate-900 cursor-pointer
      focus:outline-none focus:ring-4 focus:ring-slate-900/20 focus:border-slate-900 
      transition-all duration-300 hover:border-slate-700 appearance-none ml-1 mt-2"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="deactive">Deactive</option>
        </select>

        {/* Right icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-slate-900 group-focus-within:text-white transition-colors duration-300" />
        </div>
      </div>

    </div>
  );
}
