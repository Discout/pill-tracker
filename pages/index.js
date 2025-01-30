import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { motion } from "framer-motion";

const defaultMedications = {
  Nikita: ["Ципрплекс", "Спитомин"],
  Lyuba: ["Ципрплекс", "Спитомин"],
};

export default function PillTracker() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("pill-tracker")) || generateInitialData();
    setData(storedData);
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem("pill-tracker", JSON.stringify(data));
    }
  }, [data]);

  function generateInitialData() {
    const today = format(new Date(), "yyyy-MM-dd");
    return { days: { [today]: { Nikita: {}, Lyuba: {} } }, medications: { ...defaultMedications } };
  }

  function togglePill(day, user, pill) {
    setData((prev) => {
      const newDays = { ...prev.days };
      if (!newDays[day]) newDays[day] = { Nikita: {}, Lyuba: {} };
      newDays[day][user][pill] = !newDays[day][user][pill];
      return { ...prev, days: newDays };
    });
  }

  function addMedication(user, name) {
    if (!data.medications[user].includes(name)) {
      setData((prev) => {
        const today = format(new Date(), "yyyy-MM-dd");
        return {
          ...prev,
          medications: { ...prev.medications, [user]: [...prev.medications[user], name] },
          days: { ...prev.days, [today]: { ...prev.days[today], [user]: { ...prev.days[today][user], [name]: false } } },
        };
      });
    }
  }

  if (!data) return <p>Загрузка...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6 bg-gray-100 min-h-screen rounded-xl shadow-xl flex flex-col">
      <h1 className="text-2xl font-bold text-center">Трекер таблеток</h1>
      <div className="flex-grow">
        {activeTab === "calendar" && (
          <div className="space-y-4">
            {Object.entries(data.days || {}).map(([date, users], index) => (
              <motion.div key={date} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-2 text-gray-700">{format(new Date(date), "dd MMMM yyyy")}</h2>
                {Object.entries(users).map(([user, meds]) => (
                  <div key={user} className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-600">{user}</h3>
                    {data.medications[user].map((med) => (
                      <button key={med} className={`block w-full p-3 my-1 rounded-xl transition-all ${meds[med] ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`} onClick={() => togglePill(date, user, med)}>
                        {med}: {meds[med] ? "Принято" : "Не принято"}
                      </button>
                    ))}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-around p-3 border-t">
        <button className={`flex-1 text-center text-lg font-semibold transition-all ${activeTab === "calendar" ? "text-blue-500" : "text-gray-400"}`} onClick={() => setActiveTab("calendar")}>
          📅 Календарь
        </button>
      </div>
    </div>
  );
}
