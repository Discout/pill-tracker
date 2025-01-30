import { useState, useEffect } from "react";
import { format, subDays, isBefore } from "date-fns";

export default function PillTracker() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("pill-tracker")) || generateInitialData();
    const today = format(new Date(), "yyyy-MM-dd");

    if (!storedData.days[today]) {
      storedData.days[today] = { Nikita: {}, Lyuba: {} };
    }

    setData(storedData);
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem("pill-tracker", JSON.stringify(data));
    }
  }, [data]);

  function generateInitialData() {
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
    return {
      days: {
        [yesterday]: { Nikita: {}, Lyuba: {} },
        [today]: { Nikita: {}, Lyuba: {} },
      },
      medications: { Nikita: ["Ципрплекс", "Спитомин"], Lyuba: ["Ципрплекс", "Спитомин"] },
    };
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
        return {
          ...prev,
          medications: { ...prev.medications, [user]: [...prev.medications[user], name] },
        };
      });
    }
  }

  if (!data) return <p style={{ textAlign: "center", fontSize: "20px" }}>Загрузка...</p>;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f3f4f6", padding: "20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Трекер таблеток</h1>

      <div>
        {activeTab === "calendar" && (
          <>
            {Object.entries(data.days)
              .sort(([a], [b]) => (isBefore(new Date(a), new Date(b)) ? -1 : 1))
              .map(([date, users]) => (
                <div key={date} style={{ background: "white", padding: "15px", margin: "10px auto", maxWidth: "400px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
                  <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>{format(new Date(date), "dd MMMM yyyy")}</h2>
                  {Object.entries(users).map(([user, meds]) => (
                    <div key={user}>
                      <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>{user}</h3>
                      {data.medications[user].map((med) => (
                        <button
                          key={med}
                          onClick={() => togglePill(date, user, med)}
                          style={{
                            backgroundColor: meds[med] ? "#28a745" : "#ccc",
                            color: "white",
                            padding: "10px",
                            borderRadius: "5px",
                            margin: "5px",
                            cursor: "pointer",
                            border: "none",
                          }}
                        >
                          {med}: {meds[med] ? "Принято" : "Не принято"}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
          </>
        )}

        {activeTab === "settings" && (
          <div style={{ background: "white", padding: "20px", margin: "10px auto", maxWidth: "400px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>Настройки</h2>
            {Object.keys(data.medications).map((user) => (
              <div key={user}>
                <h3>{user}</h3>
                {data.medications[user].map((med, index) => (
                  <div key={index}>
                    {med} <button onClick={() => addMedication(user, prompt("Введите название новой таблетки"))}>➕</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", background: "white", padding: "10px", display: "flex", justifyContent: "space-around", boxShadow: "0 -2px 10px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setActiveTab("calendar")} style={{ padding: "10px", border: "none", background: activeTab === "calendar" ? "#007bff" : "#ccc", color: "white", borderRadius: "5px" }}>
          📅 Календарь
        </button>
        <button onClick={() => setActiveTab("settings")} style={{ padding: "10px", border: "none", background: activeTab === "settings" ? "#007bff" : "#ccc", color: "white", borderRadius: "5px" }}>
          ⚙️ Настройки
        </button>
      </div>
    </div>
  );
}
