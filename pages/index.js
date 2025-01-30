import React, { useState, useEffect } from "react";

const MedicationsTracker = () => {
  const [medsState, setMedsState] = useState(() => {
    const storedData = localStorage.getItem("medicationsData");
    return storedData ? JSON.parse(storedData) : getInitialState();
  });

  useEffect(() => {
    localStorage.setItem("medicationsData", JSON.stringify(medsState));
  }, [medsState]);

  function getInitialState() {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    return {
      [yesterdayStr]: {
        Никита: ["Аспирин"],
        Люба: ["Витамин C"]
      },
      [today]: {
        Никита: [],
        Люба: []
      }
    };
  }

  const togglePill = (date, user, med) => {
    setMedsState((prevState) => {
      const updatedState = { ...prevState };
      updatedState[date][user] = updatedState[date][user].includes(med)
        ? updatedState[date][user].filter((m) => m !== med)
        : [...updatedState[date][user], med];
      return updatedState;
    });
  };

  const addMedication = (user, med) => {
    setMedsState((prevState) => {
      const today = new Date().toISOString().split("T")[0];
      return {
        ...prevState,
        [today]: {
          ...prevState[today],
          [user]: [...prevState[today][user], med]
        }
      };
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {Object.keys(medsState).map((date) => (
        <div key={date} style={{ marginBottom: "20px" }}>
          <h2 style={{ textAlign: "center" }}>{date}</h2>
          {Object.keys(medsState[date]).map((user) => (
            <div key={user} style={{ textAlign: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>{user}</h3>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {medsState[date][user].map((med) => (
                  <button
                    key={med}
                    onClick={() => togglePill(date, user, med)}
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "10px",
                      borderRadius: "10px",
                      margin: "5px 0",
                      cursor: "pointer",
                      border: "none",
                      width: "80%",
                      maxWidth: "250px",
                    }}
                  >
                    {med}: Принято
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MedicationsTracker;
