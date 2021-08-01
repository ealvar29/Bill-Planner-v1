import { InputNumber } from "@supabase/ui";
import { Input } from "@supabase/ui";
import { Listbox } from "@headlessui/react";
import { useState } from "react";
import { supabase } from "../lib/initSupabase";

export default function Form() {
  const billType = [
    { id: 1, name: "Durward Reynolds", unavailable: false },
    { id: 2, name: "Kenton Towne", unavailable: false },
    { id: 3, name: "Therese Wunsch", unavailable: false },
    { id: 4, name: "Benedict Kessler", unavailable: true },
    { id: 5, name: "Katelyn Rohan", unavailable: false },
  ];
  const [selectedType, setType] = useState(billType[0]);
  const [newBillName, setNewBillName] = useState("");
  const [errorText, setError] = useState("");
  const [cost, setCost] = useState("0");
  const [dueDate, setDueDate] = useState(new Date());
  const [bills, setBills] = useState([]);

  const onSubmit = (event) => {
    event.preventDefault();
    if (newBillName === "") return;
    supabase
      .from("bills")
      .insert({
        billName: newBillName,
        cost: cost,
        due_date: dueDate,
        user_id: supabase.auth.user().id,
      })
      .single()
      .then(({ data, error }) => {
        console.log(data, error);
        if (!error) {
          setBills((prevBills) => [data, ...prevBills]);
        }
      });
  };
  return (
    <div className="w-full bg-grey-500">
      <div className="container py-8 mx-auto">
        <div className="mx-auto bg-white rounded shadow w-96">
          <div className="px-8 py-4 mx-16 text-xl font-bold text-center text-black border-b border-grey-500">
            Enter Bill
          </div>
          <form name="student_application" id="student_application" action="">
            <div classNameName="py-4 px-8">
              <div className="mb-4">
                <Input
                  className="w-full px-3 py-3 font-bold rounded text-grey-darker"
                  label="Bill Name"
                  value={newBillName || ""}
                  onChange={(e) => {
                    setError("");
                    setNewBillName(e.target.value);
                  }}
                />
              </div>
              <div className="mb-4">
                <InputNumber
                  className="w-full px-3 py-5 font-bold border rounded text-grey-darker"
                  label="Input Amount"
                  min={0}
                  max={1000000}
                  value={cost || 0}
                  onChange={(e) => {
                    setError("");
                    setCost(e.target.value);
                  }}
                />
              </div>
              <div className="mb-4">
                <Input
                  className="w-full px-3 py-3 font-bold text-grey-darker"
                  label="Due Date"
                  type="datetime-local"
                  value={dueDate || new Date()}
                  onChange={(e) => {
                    setError("");
                    setDueDate(e.target.value);
                  }}
                />
              </div>
              <div className="mb-4">
                <button
                  className="px-24 py-1 mx-16 mb-2 bg-blue-300 rounded-full "
                  onClick={onSubmit}
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
