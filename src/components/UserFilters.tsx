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
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center 
        pointer-events-none">
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl 
          bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none 
          focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
          transition-all duration-300 hover:border-gray-300 
          placeholder-gray-400 text-gray-700 font-medium scale-80"
        />
      </div>
      {/* Directorate */}
      <div className="relative group scale-80">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        </div>
        <select
          value={selectedDirectorate}
          onChange={(e) => {
            console.log('Directorate selected:', e.target.value);
            setSelectedDirectorate(e.target.value);
          }}
          className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl bg-white/80 
          backdrop-blur-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 
          focus:border-blue-500 transition-all duration-300 hover:border-gray-300 appearance-none 
          cursor-pointer font-medium text-gray-700"
        >
          <option value="">All Directorates</option>
          {directorateOptions
            .filter(dir => dir.id >= 6)
            .map(dir => (
              <option key={dir.id} value={dir.name}>
                {dir.name}
              </option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Group */}
      <div className="relative group scale-80">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        </div>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 appearance-none cursor-pointer font-medium text-gray-700"
        >
          <option value="">All Groups</option>
          {groupOptions.map(group => (
            <option key={group.id} value={group.name}>
              {group.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Status */}
      <div className="relative group scale-80">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 appearance-none cursor-pointer font-medium text-gray-700"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="deactive">Deactive</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}
