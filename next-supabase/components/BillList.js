import { useState, useEffect } from "react";
import { supabase } from "../lib/initSupabase";

export default function BillList({ user }) {
  const [bills, setBills] = useState([]);
  const [newBillName, setNewBillName] = useState("");
  const [errorText, setError] = useState("");

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    let { data: bills, error } = await supabase
      .from("bills")
      .select("*")
      .order("id", true);
    if (error) console.log("error", error);
    else setBills(bills);
  };
  const addBill = async (billText) => {
    let billName = billText.trim();
    if (billName.length) {
      let { data: singleBill, error } = await supabase
        .from("bills")
        .insert({ billName, user_id: user.id })
        .single();
      if (error) setError(error.message);
      else setBills([...bills, singleBill]);
    }
  };

  const deleteBill = async (id) => {
    try {
      await supabase.from("bills").delete().eq("id", id);
      setBills(bills.filter((x) => x.id != id));
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="w-full">
      <h1 className="mb-12">Bill Planner v1</h1>
      <div className="flex gap-2 my-2">
        <input
          className="w-full p-2 rounded"
          type="text"
          placeholder="Add Monthly Bill!"
          value={newBillName}
          onChange={(e) => {
            setError("");
            setNewBillName(e.target.value);
          }}
        />
        <button
          className="btn-black"
          onClick={() => {
            addBill(newBillName);
            setNewBillName("");
          }}
        >
          Add
        </button>
      </div>
      {!!errorText && <Alert text={errorText} />}
      <div className="overflow-hidden bg-white rounded-md shadow">
        <ul>
          {bills.map((bill) => (
            <Bill
              key={bill.id}
              bill={bill}
              onDelete={() => deleteBill(bill.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const Bill = ({ bill, onDelete }) => {
  const [isCompleted, setIsCompleted] = useState(bill.is_complete);

  const toggle = async () => {
    try {
      const { data, error } = await supabase
        .from("bills")
        .update({ is_complete: !isCompleted })
        .eq("id", bill.id)
        .single();
      if (error) {
        throw new Error(error);
      }
      setIsCompleted(data.is_complete);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <li
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      className="block w-full transition duration-150 ease-in-out cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
    >
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="flex items-center flex-1 min-w-0">
          <div className="text-sm font-medium leading-5 truncate">
            {bill.billName}
          </div>
        </div>
        <div>
          <input
            className="cursor-pointer"
            onChange={(e) => toggle()}
            type="checkbox"
            checked={isCompleted ? true : ""}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="w-4 h-4 ml-2 border-2 rounded hover:border-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
};

const Alert = ({ text }) => (
  <div className="p-4 my-3 bg-red-100 rounded-md">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
);
