import { InputNumber } from "@supabase/ui";
import { Input } from "@supabase/ui";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { supabase } from "../lib/initSupabase";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

export default function Form() {
  const billType = [
    { id: 1, name: "Subscriptions", unavailable: false },
    { id: 2, name: "Utilities", unavailable: false },
    { id: 3, name: "Phone", unavailable: false },
    { id: 4, name: "Rent", unavailable: true },
    { id: 5, name: "Internet", unavailable: false },
    { id: 6, name: "Misc.", unavailable: false },
    { id: 7, name: "Auto", unavailable: false },
    { id: 8, name: "Credit Card", unavailable: false },
    { id: 9, name: "Gas", unavailable: false },
    { id: 10, name: "Shopping", unavailable: false },
    { id: 11, name: "Groceries ", unavailable: false },
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
                <div className="w-full px-3 py-3 font-bold text-grey-darker">
                  <label>Bill Type</label>
                </div>
                <Listbox value={billType} onChange={setType}>
                  <div className="w-full px-3 py-3 font-bold text-grey-darker">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                      <span className="block truncate">
                        {selectedType.name}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <SelectorIcon
                          className="w-5 h-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute w-1/3 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {billType.map((type, id) => (
                          <Listbox.Option
                            key={id}
                            className={({ active }) =>
                              `${active ? "shadow-md" : "text-gray-900"}
                          cursor-default select-none relative py-2 pl-10 pr-4`
                            }
                            value={type}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`${
                                    selected ? "font-medium" : "font-normal"
                                  } block truncate`}
                                >
                                  {type.name}
                                </span>
                                {selected ? (
                                  <span
                                    className={`${
                                      active
                                        ? "text-amber-600"
                                        : "text-amber-600"
                                    }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                                  >
                                    <CheckIcon
                                      className="w-5 h-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
              <div className="mb-4">
                <button
                  className="px-24 py-1 mx-16 mb-2 bg-blue-300 rounded-full"
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
