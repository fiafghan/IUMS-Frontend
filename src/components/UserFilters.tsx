import { Combobox, Popover } from "@headlessui/react";
import { Filter, Search } from "lucide-react";
import { useState } from "react";

export type FilterOption = {
  id: string;
  name: string;
};

type Props = {
  deputyMinistryOptions: FilterOption[];
  directorateOptions: FilterOption[];
  selectedDeputyMinistry: string;
  setSelectedDeputyMinistry: (val: string) => void;
  selectedDirectorate: string;
  setSelectedDirectorate: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
};

export default function UserFilters({
  deputyMinistryOptions,
  directorateOptions,
  selectedDeputyMinistry,
  setSelectedDeputyMinistry,
  selectedDirectorate,
  setSelectedDirectorate,
  selectedStatus,
  setSelectedStatus,
}: Props) {
  const [queryDirectorate, setQueryDirectorate] = useState("");

  const filteredDirectorates =
    queryDirectorate === ""
      ? directorateOptions
      : directorateOptions.filter((dir) =>
          dir.name.toLowerCase().includes(queryDirectorate.toLowerCase())
        );

  return (
    <div className="scale-80">
      <Popover className="relative">
        {() => (
          <>
            <Popover.Button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium 
            text-blue-400 bg-white shadow-sm border border-gray-200 rounded-sm hover:bg-blue-200 focus:outline-none">
              <Filter className="w-4 h-4 bg-blue-400 text-white rounded-full shadow-md p-1 scale-150" />
              Filters
            </Popover.Button>

            <Popover.Panel className="absolute left-0 right-0 z-50 mt-2 w-[500px] rounded-lg border 
            border-blue-300 bg-white p-5 shadow-lg">
              <h3 className="text-sm font-semibold text-blue-500 mb-4 flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                Filter Users
              </h3>

              <div className="flex flex-row gap-1">

                {/* Deputy Ministry */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Deputy Ministry
                  </label>
                  <select
                    className="block w-full rounded-md border border-blue-200 shadow-sm h-9 text-sm p-2"
                    value={selectedDeputyMinistry}
                    onChange={(e) => setSelectedDeputyMinistry(e.target.value)}
                  >
                    <option value="">All</option>
                    {deputyMinistryOptions.map((dep) => (
                      <option key={dep.id} value={dep.name}>{dep.name}</option>
                    ))}
                  </select>
                </div>

                {/* Directorate */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Directorate
                  </label>
                  <Combobox
                    value={selectedDirectorate}
                    onChange={(value: string | null) =>
                      setSelectedDirectorate(value ?? "")
                    }
                  >
                    <div className="relative">
                      <Combobox.Input
                        className="w-full rounded-md border border-blue-200 p-2 text-sm shadow-sm"
                        placeholder="🔍 Filter..."
                        onChange={(e) =>
                          setQueryDirectorate(e.target.value)
                        }
                        displayValue={(dir: string) => dir}
                      />
                      {queryDirectorate && filteredDirectorates.length === 0 && (
                        <div className="absolute z-50 mt-1 w-full rounded bg-white border border-gray-200 p-2 text-sm text-red-500">
                          Directorate not found!
                        </div>
                      )}
                      {filteredDirectorates.length > 0 && (
                        <Combobox.Options className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded border border-gray-200 bg-white text-sm shadow">
                          <Combobox.Option
                            value=""
                            className={({ active }) =>
                              `cursor-pointer select-none px-4 py-2 ${
                                active
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            All Directorates
                          </Combobox.Option>
                          {filteredDirectorates.map((dir) => (
                            <Combobox.Option
                              key={dir.id}
                              value={dir.name}
                              className={({ active }) =>
                                `cursor-pointer select-none px-4 py-2 ${
                                  active
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-900"
                                }`
                              }
                            >
                              {dir.name}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      )}
                    </div>
                  </Combobox>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <select
                    className="block w-full rounded-md border border-blue-200 shadow-sm h-9 text-sm p-2"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="active">Active</option>
                    <option value="deactive">Deactive</option>
                  </select>
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
}
