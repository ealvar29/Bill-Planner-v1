import { useState } from "react";
import { supabase } from "../lib/initSupabase";
import moment from "../node_modules/moment";

export default function Bill({ bill, onDelete }) {
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
  console.log(bill);
  return (
    <tr>
      <td className="w-1/4 p-2 text-center border border-black">
        {bill.billName}
      </td>
      <td className="w-1/4 p-2 text-center border border-black">
        {bill.bill_type}
      </td>
      <td className="w-1/4 p-2 text-center border border-black">{bill.cost}</td>
      <td className="w-1/4 p-2 text-center border border-black">
        {" "}
        {moment(bill.due_date).format("MMMM Do YYYY")}
      </td>
      <td className="w-1/4 p-2 text-center border border-black">
        {" "}
        <input
          className="cursor-pointer"
          onChange={(e) => toggle()}
          type="checkbox"
          checked={isCompleted ? true : ""}
        />
      </td>
      <td className="w-1/4 p-2 text-center border border-black">
        <button
          onClick={(e) => {
            e.preventDefault();
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
      </td>
    </tr>
  );
}
