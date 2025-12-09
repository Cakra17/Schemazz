import useFormStore from "@/store/form";
import { SchemaStore, type Table } from "@/store/node-store";
import type React from "react";
import { useState } from "react";

interface TableForm {
  name: string
};

const defaultValue = {
  name : ""
};

export default function AddTableForm() {
  const [ data, setData ] = useState<TableForm>(defaultValue);
  const { closeForm } = useFormStore();
  const { addTable } = SchemaStore();
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    console.log(name, value)
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTable: Table = {
      name: data.name,
      columns: []
    }
    addTable(newTable);
    closeForm();
  }

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 w-96">
        <h2 className="text-lg font-bold mb-4">Add Table</h2>
        <form
          onSubmit={handleFormSubmit}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter table name..."
              onBlur={handleFormChange}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="p-2 bg-gray-300 rounded-md hover:bg-gray-400"
              onClick={closeForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}