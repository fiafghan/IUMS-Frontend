

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
    <div className="grid grid-cols-3 gap-4 justify-center w-full mb-4 mt-5">

      {/* Search */}
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="border rounded px-3 py-2 min-w-[180px] max-w-xs w-full"
      />

      {/* Deputy Ministry */}
      <select
        value={selectedDeputyMinistry}
        onChange={(e) => setSelectedDeputyMinistry(e.target.value)}
        className="border rounded px-3 py-2 min-w-[180px] max-w-xs w-full"
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
        onChange={(e) => setSelectedDirectorate(e.target.value)}
        className="border rounded px-3 py-2 min-w-[180px] max-w-xs w-full
             max-h-40 overflow-y-auto"
      >
        <option value="">All Directorates</option>
        {directorateOptions
          .filter(dir => dir.id >= 6) 
          .map(dir => (
            <option key={dir.id} value={dir.id}>
              {dir.name}
            </option>
          ))}
      </select>


      {/* Status */}
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border rounded px-3 py-2 min-w-[120px] max-w-xs w-full"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="deactive">Deactive</option>
      </select>
    </div>
  );
}
