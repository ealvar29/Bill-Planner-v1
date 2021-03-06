import { useState, useEffect } from "react";
import { supabase } from "../lib/initSupabase";
import Bill from "./Bill";
import Alert from "./Alert";
import Form from "./Form";

export default function BillList({ user }) {
  const [bills, setBills] = useState([]);
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
      {!!errorText && <Alert text={errorText} />}
      <div className="overflow-hidden bg-white rounded-md shadow">
        <table className="border-collapse table-auto">
          <thead>
            <tr className="">
              <th className="w-1/4 border border-black rounded-md">
                Bill Name
              </th>
              <th className="w-1/4 border border-black rounded-md">
                Bill Type
              </th>
              <th className="w-1/4 border border-black rounded-md">Cost</th>
              <th className="w-1/4 border border-black rounded-md">Due Date</th>
              <th className="w-1/2 p-3 border border-black rounded-md">
                Paid?
              </th>
              <th className="w-1/4 border border-black rounded-md">Delete</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <Bill
                key={bill.id}
                bill={bill}
                onDelete={() => deleteBill(bill.id)}
                onChange={() => fetchBills()}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
