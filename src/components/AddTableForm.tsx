import { useState } from "react";

export default function AddTableForm() {
  const [open, setOpen] = useState<Boolean>(false);
  const print = () => {
    console.log(open);
    setOpen(!open);
  }
  return (
    <div>
      <button 
        className="bg-indigo-500 p-[6px] rounded-md jb ml-2 text-white hover:bg-indigo-700 cursor-pointer"
        onClick={print}
      >
        Add Table
      </button>
    </div>
  );
}