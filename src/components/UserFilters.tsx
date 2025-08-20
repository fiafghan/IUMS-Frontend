type Props = {
  deputyMinistryOptions: { id: number; name: string }[];
  directorateOptions: { id: number; name: string }[];
  selectedDeputyMinistry: string;
  setSelectedDeputyMinistry: (value: string) => void;
  selectedDirectorate: string;
  setSelectedDirectorate: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function UserFiltersPanel({
  deputyMinistryOptions,
  directorateOptions,
  selectedDeputyMinistry,
  setSelectedDeputyMinistry,
  selectedDirectorate,
  setSelectedDirectorate,
  selectedStatus,
  setSelectedStatus,
  searchTerm,
  setSearchTerm
}: Props) {

  return (
    <div className="grid grid-cols-3 gap-6 justify-center w-full mb-6 mt-6">

      {/* Search */}
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="border border-gray-300 rounded-md px-4 py-2 min-w-[180px] max-w-xs w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
      />

      {/* Deputy Ministry */}
      <select
        value={selectedDeputyMinistry}
        onChange={(e) => setSelectedDeputyMinistry(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 min-w-[180px] max-w-xs w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
      >
        <option value="">All Deputies</option>
        {deputyMinistryOptions
          .filter(dm => dm.id >= 1 && dm.id <= 5) 
          .map(dm => (
            <option key={dm.id} value={dm.name}>
              {dm.name}
            </option>
          ))}
      </select>

      {/* Directorate */}
      <select
        value={selectedDirectorate}
        onChange={(e) => {
          console.log('Directorate selected:', e.target.value);
          setSelectedDirectorate(e.target.value);
        }}
        className="border border-gray-300 rounded-md px-4 py-2 min-w-[180px] max-w-xs w-full max-h-40 overflow-y-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
      >
        <option value="">All Directorates</option>
        {directorateOptions
          .filter(dir => dir.id >= 6) 
          .map(dir => (
            <option key={dir.id} value={dir.id.toString()}>
              {dir.name}
            </option>
          ))}
      </select>

      {/* Status */}
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 min-w-[120px] max-w-xs w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="deactive">Deactive</option>
      </select>
    </div>
  );
}
