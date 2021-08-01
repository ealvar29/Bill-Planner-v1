import { useState, useEffect } from "react";
import { supabase } from "../lib/initSupabase";
import Bill from "./Bill";
import Alert from "./Alert";
import Form from "./Form";
export default function BillList({ user }) {
  const [bills, setBills] = useState([]);
  const [newBillName, setNewBillName] = useState("");
  const [errorText, setError] = useState("");
  const [cost, setCost] = useState("0");

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
      <h1 className="mb-12 text-center">Bill Planner v1</h1>
      <Form />
      {/* <div className="flex gap-2 my-2">
        <input
          className="w-full p-2 rounded"
          type="text"
          placeholder="Add Monthly Bill"
          value={newBillName || ""}
          onChange={(e) => {
            setError("");
            setNewBillName(e.target.value);
          }}
        />
        <input
          className="w-full p-2 rounded"
          type="text"
          placeholder="Add Amount"
          value={cost || 0}
          onChange={(e) => {
            setError("");
            setCost(e.target.value);
          }}
        />
        <button className="btn-black" onClick={onSubmit}>
          Add
        </button>
      </div> */}
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
