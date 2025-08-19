
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
    <div className="flex mb-4 mt-5 justify-center w-full gap-4">
      <select
        value={selectedDeputyMinistry}
        onChange={(e) => setSelectedDeputyMinistry(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">All Deputies</option>
        {deputyMinistryOptions.map(dm => (
          <option key={dm.id} value={dm.name}>{dm.name}</option>
        ))}
      </select>

      <select
        value={selectedDirectorate}
        onChange={(e) => setSelectedDirectorate(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">All Directorates</option>
        {directorateOptions.map(dir => (
          <option key={dir.id} value={dir.id}>{dir.name}</option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="deactive">Deactive</option>
      </select>

      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="border rounded px-2 py-1"
      />
    </div>
  );
}
